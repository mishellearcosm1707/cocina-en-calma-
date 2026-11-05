import 'server-only';
import { notFound } from 'next/navigation';
import { supabaseServidor } from '@/lib/supabase/servidor';
import { supabaseAdmin } from '@/lib/supabase/admin';

export interface Admin {
  id: string;
  email: string;
}

/**
 * Verifica EN EL SERVIDOR que quien pide es admin: sesión válida (Supabase valida el token, no solo se lee la cookie)
 * Y una fila en la tabla `admins`. Se llama al principio de cada página, consulta y acción del panel (no basta con
 * esconder la ruta). Si no es admin, la ruta responde 404: ni siquiera confirma que el panel existe.
 */
export async function exigirAdmin(): Promise<Admin> {
  const supabase = await supabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data } = await supabaseAdmin().from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!data) notFound();
  return { id: user.id, email: user.email ?? '' };
}

/** Deja constancia de una acción manual de la admin (quién, qué, a quién, cuándo). */
export async function auditar(admin: Admin, accion: string, objetivo?: string, detalle?: Record<string, unknown>) {
  await supabaseAdmin().from('admin_log').insert({ admin_id: admin.id, accion, objetivo: objetivo ?? null, detalle: detalle ?? {} });
}
