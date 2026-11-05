'use server';

import { randomUUID } from 'node:crypto';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { auditar, exigirAdmin } from '@/lib/admin/acceso';

// Toda acción manual del panel: 1) verifica admin en el servidor, 2) valida lo que llega, 3) actúa, 4) deja auditoría.

export interface Resultado {
  ok: boolean;
  mensaje: string;
  enlace?: string;
}

const CORREO_OK = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const ESTADOS = new Set(['activo', 'reembolsado', 'cancelado']);

const texto = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const numero = (f: FormData, k: string) => {
  const t = texto(f, k).replace(',', '.');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};

/** Agrega a una persona a mano (por ejemplo si el aviso de Hotmart no le dio el acceso). */
export async function agregarUsuario(_: Resultado | null, f: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  const email = texto(f, 'email').toLowerCase();
  const nombre = texto(f, 'nombre').slice(0, 80);
  if (!CORREO_OK.test(email)) return { ok: false, mensaje: 'Revisa el correo: parece que le falta algo, por ejemplo nombre@correo.com.' };
  const db = supabaseAdmin();
  const { data: previo, error: errLeer } = await db.from('accesos').select('id').eq('email', email).maybeSingle();
  if (errLeer) return { ok: false, mensaje: 'No se pudo revisar si ya existe. Inténtalo de nuevo.' };
  const { error } = previo
    ? await db.from('accesos').update({ estado: 'activo', nombre: nombre || null, origen: 'manual' }).eq('id', previo.id)
    : await db.from('accesos').insert({ email, nombre: nombre || null, estado: 'activo', origen: 'manual', transaccion: `manual-${randomUUID()}` });
  if (error) return { ok: false, mensaje: 'No se pudo guardar. Inténtalo de nuevo.' };
  await auditar(admin, previo ? 'reactivar_acceso_manual' : 'agregar_acceso_manual', email);
  revalidatePath('/admin/usuarios');
  return { ok: true, mensaje: `Listo: ${email} ya tiene acceso. Puede entrar pidiendo su enlace en la pantalla de acceso.` };
}

/** Activa, desactiva o marca como reembolsado un acceso. */
export async function cambiarEstado(f: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const id = texto(f, 'id');
  const estado = texto(f, 'estado');
  if (!id || !ESTADOS.has(estado)) return;
  const db = supabaseAdmin();
  const { data } = await db.from('accesos').select('email').eq('id', id).maybeSingle();
  if (!data) return;
  const { error } = await db.from('accesos').update({ estado }).eq('id', id);
  if (error) return;
  await auditar(admin, 'cambiar_estado_acceso', data.email, { estado });
  revalidatePath('/admin/usuarios');
}

/** Genera un enlace de entrada de un solo uso para alguien a quien no le llegó el correo. */
export async function generarEnlace(_: Resultado | null, f: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  const email = texto(f, 'email').toLowerCase();
  if (!CORREO_OK.test(email)) return { ok: false, mensaje: 'Correo no válido.' };
  const db = supabaseAdmin();
  const { data: acceso } = await db.from('accesos').select('estado').eq('email', email).maybeSingle();
  if (acceso?.estado !== 'activo') return { ok: false, mensaje: 'Esa persona no tiene un acceso activo. Primero agrégala o actívala.' };
  const h = await headers();
  const origen = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`;
  const { data, error } = await db.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo: `${origen}/auth/entrar` } });
  if (error || !data.properties?.action_link) return { ok: false, mensaje: 'No se pudo crear el enlace. Inténtalo de nuevo.' };
  await auditar(admin, 'generar_enlace_acceso', email);
  return { ok: true, mensaje: 'Enlace listo. Dáselo a esa persona por un medio privado: funciona una sola vez y entra como ella.', enlace: data.properties.action_link };
}

/** Guarda los costos mensuales y el porcentaje de impuestos. Un campo vacío no cambia nada. */
export async function guardarCostos(_: Resultado | null, f: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  const campos: Array<[string, string, number]> = [
    ['impuesto_pct', 'El porcentaje de impuestos', 100],
    ['infra_mensual', 'El costo de infraestructura', 1_000_000],
    ['email_mensual', 'El costo de correos', 1_000_000],
  ];
  const filas: Array<{ clave: string; valor: number; moneda: string; actualizado_en: string }> = [];
  for (const [clave, nombre, tope] of campos) {
    const v = numero(f, clave);
    if (v === null) continue;
    if (Number.isNaN(v) || v < 0 || v > tope) return { ok: false, mensaje: `${nombre} no es válido.` };
    filas.push({ clave, valor: v, moneda: 'USD', actualizado_en: new Date().toISOString() });
  }
  if (!filas.length) return { ok: false, mensaje: 'No escribiste ningún valor.' };
  const { error } = await supabaseAdmin().from('costos_config').upsert(filas, { onConflict: 'clave' });
  if (error) return { ok: false, mensaje: 'No se pudo guardar. Inténtalo de nuevo.' };
  await auditar(admin, 'guardar_costos', undefined, Object.fromEntries(filas.map((x) => [x.clave, x.valor])));
  revalidatePath('/admin', 'layout');
  return { ok: true, mensaje: 'Costos guardados. La ganancia ya los usa.' };
}

/** Registra lo que gastaste en conseguir clientes en un canal (anuncios, afiliados, etc.). */
export async function agregarGasto(_: Resultado | null, f: FormData): Promise<Resultado> {
  const admin = await exigirAdmin();
  const canal = texto(f, 'canal').slice(0, 40);
  const monto = numero(f, 'monto');
  const desde = texto(f, 'desde');
  const hasta = texto(f, 'hasta');
  const nota = texto(f, 'nota').slice(0, 120);
  if (!canal) return { ok: false, mensaje: 'Escribe el canal (por ejemplo: ads_meta, afiliados, organico).' };
  if (monto === null || Number.isNaN(monto) || monto < 0) return { ok: false, mensaje: 'El monto no es válido.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(desde) || !/^\d{4}-\d{2}-\d{2}$/.test(hasta) || hasta < desde) return { ok: false, mensaje: 'Revisa las fechas: "hasta" no puede ser antes de "desde".' };
  const { error } = await supabaseAdmin().from('gasto_adquisicion').insert({ canal, monto_minor: Math.round(monto * 100), moneda: 'USD', desde, hasta, nota: nota || null });
  if (error) return { ok: false, mensaje: 'No se pudo guardar. Inténtalo de nuevo.' };
  await auditar(admin, 'agregar_gasto', canal, { monto, desde, hasta });
  revalidatePath('/admin', 'layout');
  return { ok: true, mensaje: 'Gasto registrado.' };
}

export async function borrarGasto(f: FormData): Promise<void> {
  const admin = await exigirAdmin();
  const id = texto(f, 'id');
  if (!id) return;
  const { error } = await supabaseAdmin().from('gasto_adquisicion').delete().eq('id', id);
  if (error) return;
  await auditar(admin, 'borrar_gasto', id);
  revalidatePath('/admin', 'layout');
}
