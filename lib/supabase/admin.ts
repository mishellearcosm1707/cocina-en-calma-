import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con la clave SECRETA de Supabase: se salta RLS. Solo existe en el servidor (server-only impide importarlo
 * desde el navegador) y SOLO se usa después de verificar que quien pide es admin (lib/admin/acceso.ts).
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !clave) throw new Error('Falta SUPABASE_SECRET_KEY en el servidor');
  return createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } });
}
