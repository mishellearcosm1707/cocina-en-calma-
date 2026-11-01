import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/** Cliente de Supabase para el navegador (solo usa la clave pública; la seguridad real la da RLS). */
export function supabaseNavegador() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}

/**
 * Cliente SOLO para pedir el enlace del correo: usa el flujo "implícito", así el enlace funciona aunque se abra
 * en otro navegador o en otro celular (con el flujo normal el enlace solo sirve donde se pidió). No guarda sesión.
 */
export function supabaseEnlace() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { flowType: 'implicit', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
