import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServidor } from '@/lib/supabase/servidor';

/**
 * Eliminar mi cuenta (derecho de eliminación). Solo la propia persona, con sesión válida.
 * Borra sus datos de salud y su cuenta de acceso. Se conservan, sin sus datos de contacto: el registro de su compra
 * (obligación de conservar comprobantes) y la evidencia mínima de sus consentimientos (solo una huella del correo).
 */
export async function DELETE() {
  const supabase = await supabaseServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'sin sesión' }, { status: 401 });

  const db = supabaseAdmin();
  const { data: esAdmin } = await db.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (esAdmin) return NextResponse.json({ error: 'cuenta de administración' }, { status: 409 });

  const { error: errEstado } = await db.from('estado_app').delete().eq('user_id', user.id);
  if (errEstado) return NextResponse.json({ error: 'estado' }, { status: 500 });
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: 'cuenta' }, { status: 500 });
  return new Response(null, { status: 204 });
}
