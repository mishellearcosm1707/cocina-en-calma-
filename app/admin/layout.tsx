import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { NavAdmin } from '@/components/admin/Nav';
import { exigirAdmin } from '@/lib/admin/acceso';

export const metadata: Metadata = { title: 'Panel — Cocina en Calma', robots: { index: false, follow: false } };

export default function LayoutAdmin({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p role="status" className="p-5 text-base text-[var(--text-secondary)]">Cargando el panel…</p>}>
      <InteriorAdmin>{children}</InteriorAdmin>
    </Suspense>
  );
}

// Cada página y cada acción vuelve a verificar que quien pide es admin; esta es la primera barrera (404 si no lo es).
async function InteriorAdmin({ children }: { children: ReactNode }) {
  const admin = await exigirAdmin();
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-4">
        <header className="flex items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2">
            <Logo alto={32} />
            <p className="text-lg font-bold [font-family:var(--font-display)]">Panel</p>
          </div>
          <Link href="/app" className="min-h-11 text-base font-semibold text-[var(--accent)] underline underline-offset-4">
            Ir a la app
          </Link>
        </header>
        <NavAdmin />
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Entraste como {admin.email}</p>
        <main className="mt-4">{children}</main>
      </div>
    </div>
  );
}
