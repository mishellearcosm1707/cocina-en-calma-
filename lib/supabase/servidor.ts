import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cliente de Supabase para rutas del servidor: lee y escribe la sesión en las cookies. */
export async function supabaseServidor() {
  const almacen = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          /* llamado desde un componente de servidor: el proxy ya renueva la sesión */
        }
      },
    },
  });
}
