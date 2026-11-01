import { createBrowserClient } from '@supabase/ssr';

/** Cliente de Supabase para el navegador (solo usa la clave pública; la seguridad real la da RLS). */
export function supabaseNavegador() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}
