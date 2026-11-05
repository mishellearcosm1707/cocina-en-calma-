import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { estadoDeEvento, estadoDeVenta, extraer, hottokValido, type EventoHotmart } from '@/lib/hotmart';

type Resultado = 'aplicado' | 'duplicado' | 'ignorado' | 'no_autorizado' | 'error';

/**
 * Aviso automático de Hotmart cuando alguien compra, pide reembolso o hace contracargo.
 * Orden: autenticidad (hottok) → producto permitido → no repetido → acceso + venta en la base de datos.
 * Respuestas: 401 no autenticado · 200 ignorado/ya procesado/aplicado · 500 falló algo (Hotmart reintenta).
 * Cada intento queda en webhook_log para que el panel avise si algo falla.
 */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY;
  const hottok = process.env.HOTMART_HOTTOK;
  const producto = process.env.HOTMART_PRODUCT_ID;
  // Sin configuración completa NO se acepta nada (nunca queda abierto por defecto).
  if (!url || !clave || !hottok || !producto) {
    console.error('[hotmart] falta configuración del servidor');
    return NextResponse.json({ error: 'sin configurar' }, { status: 500 });
  }
  const db = createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
  const anotar = async (resultado: Resultado, evento?: string) => {
    await db.from('webhook_log').insert({ resultado, evento: evento ?? null });
  };

  let cuerpo: EventoHotmart;
  try {
    cuerpo = JSON.parse(await request.text()) as EventoHotmart;
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }

  if (!hottokValido(request.headers.get('x-hotmart-hottok') ?? cuerpo.hottok, hottok)) {
    console.warn('[hotmart] aviso rechazado: hottok no válido');
    await anotar('no_autorizado', cuerpo.event);
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  const d = extraer(cuerpo);
  if (d.productoId !== producto) {
    await anotar('ignorado', d.evento);
    return NextResponse.json({ ignorado: 'otro producto' });
  }
  const estado = estadoDeEvento(d.evento);
  const estadoVenta = estadoDeVenta(d.evento);
  if (!estado || !estadoVenta || !d.email || !d.transaccion) {
    await anotar('ignorado', d.evento);
    return NextResponse.json({ ignorado: 'evento sin efecto' });
  }
  const email = d.email;
  const transaccion = d.transaccion;
  const evento = d.evento as string;

  // Hotmart reenvía avisos: cada (transacción, evento) se procesa una sola vez.
  const { error: repetido } = await db.from('eventos_hotmart').insert({ transaccion, evento });
  if (repetido) {
    if (repetido.code === '23505') {
      await anotar('duplicado', evento);
      return NextResponse.json({ duplicado: true });
    }
    console.error('[hotmart] no se pudo registrar el evento', repetido.code);
    await anotar('error', evento);
    return NextResponse.json({ error: 'registro' }, { status: 500 });
  }

  try {
    await aplicar(db, { ...d, email, transaccion }, estado, estadoVenta);
  } catch (e) {
    // Se libera el evento para que el reintento de Hotmart pueda aplicarse.
    await db.from('eventos_hotmart').delete().match({ transaccion, evento });
    console.error('[hotmart] no se pudo aplicar', e instanceof Error ? e.message : 'error');
    await anotar('error', evento);
    return NextResponse.json({ error: 'aplicar' }, { status: 500 });
  }
  await anotar('aplicado', evento);
  return NextResponse.json({ ok: true });
}

async function aplicar(
  db: SupabaseClient,
  d: ReturnType<typeof extraer> & { email: string; transaccion: string },
  estado: 'activo' | 'reembolsado' | 'cancelado',
  estadoVenta: 'aprobada' | 'reembolsada' | 'contracargo' | 'cancelada',
) {
  const { data: previo, error: errLeer } = await db.from('accesos').select('id, transaccion').eq('email', d.email).maybeSingle();
  if (errLeer) throw errLeer;
  // Un reembolso de una compra vieja no le quita el acceso a una compra más reciente.
  const esCompraVieja = Boolean(previo) && estado !== 'activo' && previo?.transaccion !== d.transaccion;

  if (!esCompraVieja) {
    if (previo) {
      const cambios = estado === 'activo' ? { estado, transaccion: d.transaccion, nombre: d.nombre, origen: 'hotmart' } : { estado };
      const { error } = await db.from('accesos').update(cambios).eq('id', previo.id);
      if (error) throw error;
    } else if (estado === 'activo') {
      const { error } = await db.from('accesos').insert({ email: d.email, estado, transaccion: d.transaccion, nombre: d.nombre, origen: 'hotmart' });
      if (error) throw error;
    }
  }

  // Libro de ventas: los importes que Hotmart no informa quedan en NULL (el panel dirá "Sin datos").
  if (estadoVenta === 'aprobada') {
    const { error } = await db.from('ventas').upsert(
      {
        transaccion: d.transaccion,
        email: d.email,
        producto_id: d.productoId,
        moneda: d.moneda,
        bruto_minor: d.bruto,
        fee_hotmart_minor: d.feeHotmart,
        afiliado_minor: d.afiliado,
        neto_productor_minor: d.netoProductor,
        canal: d.canal,
        estado: 'aprobada',
        ...(d.fechaCompra ? { comprada_en: d.fechaCompra } : {}),
      },
      { onConflict: 'transaccion' },
    );
    if (error) throw error;
  } else {
    const { error } = await db
      .from('ventas')
      .update({ estado: estadoVenta, cerrada_en: new Date().toISOString() })
      .eq('transaccion', d.transaccion);
    if (error) throw error;
  }
}
