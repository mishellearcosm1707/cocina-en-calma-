import { NextResponse } from 'next/server';
import { supabaseServidor } from '@/lib/supabase/servidor';

/**
 * Guía de meal prep en PDF: vive en un bucket PRIVADO de Supabase. El proxy ya exige sesión y acceso activo para /app,
 * y la política del bucket también; aquí se pide un enlace temporal (5 minutos) y se redirige.
 */
export async function GET(request: Request) {
  const supabase = await supabaseServidor();
  const { data, error } = await supabase.storage.from('guias').createSignedUrl('guia-meal-prep.pdf', 300);
  if (error || !data?.signedUrl) return NextResponse.redirect(new URL('/app/prep', request.url));
  return NextResponse.redirect(data.signedUrl);
}
