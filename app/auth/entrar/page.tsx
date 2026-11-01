'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseNavegador } from '@/lib/supabase/navegador';

/** Destino del enlace del correo: toma la sesión que viene en la dirección y entra a la app. */
export default function Entrar() {
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const datos = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const acceso = datos.get('access_token');
    const renovar = datos.get('refresh_token');
    if (!acceso || !renovar) {
      void Promise.resolve().then(() => setFallo(true));
      return;
    }
    void supabaseNavegador()
      .auth.setSession({ access_token: acceso, refresh_token: renovar })
      .then(({ error }) => {
        if (error) setFallo(true);
        else window.location.replace('/app');
      });
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      {fallo ? (
        <>
          <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Este enlace ya no sirve</h1>
          <p className="text-base text-[var(--text-secondary)]">Cada enlace funciona una sola vez y dura poco. Pide uno nuevo y ábrelo enseguida.</p>
          <Link href="/login" className="flex min-h-14 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-base font-bold text-[var(--bg)]">
            Pedir un enlace nuevo
          </Link>
        </>
      ) : (
        <p role="status" className="text-lg font-semibold">
          Entrando a tu app…
        </p>
      )}
    </main>
  );
}
