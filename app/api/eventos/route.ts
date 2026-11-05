import { createClient } from '@supabase/supabase-js';
import { supabaseServidor } from '@/lib/supabase/servidor';

// Lista CERRADA: cualquier otro nombre se descarta. Ningún evento lleva correo, nombre ni respuestas de salud.
const EVENTOS = new Set([
  'onboarding_paso_visto',
  'onboarding_completado',
  'paywall_visto',
  'checkout_iniciado',
  'sesion_iniciada',
  'chequeo_registrado',
  'receta_planificada',
  'semana_completada',
  'prep_armado',
]);
const PROPS = ['paso', 'canal', 'dias'];
const sinContenido = () => new Response(null, { status: 204 });

/** Recibe eventos de uso anónimos y errores de la app. Nunca falla hacia la persona: ante cualquier duda responde 204. */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !clave) return sinContenido();

  let texto = '';
  try {
    texto = await request.text();
  } catch {
    return sinContenido();
  }
  if (texto.length > 2048) return sinContenido();
  let cuerpo: { tipo?: string; evento?: string; sesion?: string; mensaje?: string; pantalla?: string; props?: Record<string, unknown> };
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    return sinContenido();
  }

  // Si hay sesión de una persona con cuenta, el evento se asocia a su id (no a su correo).
  let userId: string | null = null;
  try {
    const supabase = await supabaseServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  const db = createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
  if (cuerpo.tipo === 'error') {
    const mensaje = String(cuerpo.mensaje ?? '').slice(0, 300);
    if (mensaje) await db.from('error_log').insert({ mensaje, pantalla: String(cuerpo.pantalla ?? '').slice(0, 100) || null, user_id: userId });
    return sinContenido();
  }

  if (cuerpo.tipo !== 'evento' || !cuerpo.evento || !EVENTOS.has(cuerpo.evento)) return sinContenido();
  const props: Record<string, string | number> = {};
  for (const k of PROPS) {
    const v = cuerpo.props?.[k];
    if (typeof v === 'string') props[k] = v.slice(0, 40);
    else if (typeof v === 'number' && Number.isFinite(v)) props[k] = v;
  }
  await db.from('event_log').insert({
    evento: cuerpo.evento,
    user_id: userId,
    sesion: typeof cuerpo.sesion === 'string' ? cuerpo.sesion.slice(0, 64) : null,
    props,
  });
  return sinContenido();
}
