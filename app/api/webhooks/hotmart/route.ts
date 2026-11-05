import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { estadoDeEvento, extraer, hottokValido, type EventoHotmart } from '@/lib/hotmart';

/**
 * Aviso automático de Hotmart cuando alguien compra, pide reembolso o hace contracontracargo.
 * Orden: autenticidad (hottok) → producto permitido → no repetido → cambio de acceso en la base de datos.
 * Respuestas: 401 no autenticado · 200 ignorado/ya procesado/aplicado · 500 falló algo (Hotmart reintenta).
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

  let cuerpo: EventoHotmart;
  try {
    cuerpo = JSON.parse(await request.text()) as EventoHotmart;
  } catch {
    return NextResponse.json({ error: 'cuerpo inválido' }, { status: 400 });
  }

  if (!hottokValido(request.headers.get('x-hotmart-hottok') ?? cuerpo.hottok, hottok)) {
    console.warn('[hotmart] aviso rechazado: hottok no válido');
    return NextResponse.json({ error: 'no autorizado' }, { status: 401 });
  }

  const { evento, email, transaccion, productoId } = extraer(cuerpo);
  if (productoId !== producto) return NextResponse.json({ ignorado: 'otro producto' });
  const estado = estadoDeEvento(evento);
  if (!estado || !email || !transaccion) return NextResponse.json({ ignorado: 'evento sin efecto' });

  const db = createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });

  // Hotmart reenvía avisos: cada (transacción, evento) se procesa una sola vez.
  const { error: repetido } = await db.from('eventos_hotmart').insert({ transaccion, evento });
  if (repetido) {
    if (repetido.code === '23505') return NextResponse.json({ duplicado: true });
    console.error('[hotmart] no se pudo registrar el evento', repetido.code);
    return NextResponse.json({ error: 'registro' }, { status: 500 });
  }

  try {
    const { data: previo, error: errLeer } = await db.from('accesos').select('id, transaccion').eq('email', email).maybeSingle();
    if (errLeer) throw errLeer;
    if (previo) {
      // Un reembolso de una compra vieja no le quita el acceso a una compra más reciente.
      if (estado !== 'activo' && previo.transaccion !== transaccion) return NextResponse.json({ ignorado: 'compra anterior' });
      const { error } = await db
        .from('accesos')
        .update(estado === 'activo' ? { estado, transaccion } : { estado })
        .eq('id', previo.id);
      if (error) throw error;
    } else if (estado === 'activo') {
      const { error } = await db.from('accesos').insert({ email, estado, transaccion });
      if (error) throw error;
    }
  } catch (e) {
    // Se libera el evento para que el reintento de Hotmart pueda aplicarse.
    await db.from('eventos_hotmart').delete().match({ transaccion, evento });
    console.error('[hotmart] no se pudo aplicar el acceso', e instanceof Error ? e.message : 'error');
    return NextResponse.json({ error: 'aplicar' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
