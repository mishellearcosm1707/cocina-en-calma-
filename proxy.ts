import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protege /app: hace falta sesión (enlace del correo) Y un acceso activo (compra en Hotmart).
 * También renueva la sesión en cada visita. Sin acceso → pantalla de planes; sin sesión → acceso.
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  const { data: acceso } = await supabase.from('accesos').select('estado').maybeSingle();
  if (acceso?.estado !== 'activo') {
    const url = request.nextUrl.clone();
    url.pathname = '/paywall';
    url.search = '?sin_acceso=1';
    return NextResponse.redirect(url);
  }
  return respuesta;
}

export const config = { matcher: ['/app/:path*'] };
