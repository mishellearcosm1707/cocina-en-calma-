'use client';

import { useEffect } from 'react';
import { registrarError } from '@/lib/eventos';

/** Si algo se rompe en cualquier pantalla: la persona ve un mensaje claro (nunca pantalla blanca) y el error queda en el panel. */
export default function ErrorGeneral({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    registrarError(error.message || 'Error sin mensaje', typeof window === 'undefined' ? '' : window.location.pathname);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <h1 className="text-2xl font-bold [font-family:var(--font-display)]">Algo no salió bien</h1>
      <p className="text-base text-[var(--text-secondary)]">No es tu culpa. Tus datos están a salvo. Intenta de nuevo y, si sigue igual, vuelve en unos minutos.</p>
      <button
        type="button"
        onClick={reset}
        className="flex min-h-14 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-base font-bold text-[var(--bg)]"
      >
        Intentar de nuevo
      </button>
    </main>
  );
}
