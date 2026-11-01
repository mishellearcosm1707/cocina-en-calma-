import { NextResponse } from 'next/server';
import { supabaseServidor } from '@/lib/supabase/servidor';

/** Destino del enlace del correo: canjea el código por una sesión y entra a la app. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  if (code) {
    const supabase = await supabaseServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/app`);
  }
  return NextResponse.redirect(`${origin}/login?enlace=invalido`);
}
