'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { faltaPerfil, iniciarSincronizacion } from '@/lib/semana';
import { BookOpen, CalendarDays, ChefHat, Sun, User, type LucideIcon } from 'lucide-react';
import { FotosContext, GuiaContext } from './comunes';

const PESTANAS: { href: string; etiqueta: string; icono: LucideIcon }[] = [
  { href: '/app', etiqueta: 'Hoy', icono: Sun },
  { href: '/app/semana', etiqueta: 'Semana', icono: CalendarDays },
  { href: '/app/recetas', etiqueta: 'Recetas', icono: BookOpen },
  { href: '/app/prep', etiqueta: 'Prep', icono: ChefHat },
  { href: '/app/yo', etiqueta: 'Yo', icono: User },
];

export function AppShell({ fotos, guia, children }: { fotos: string[]; guia: string | null; children: ReactNode }) {
  const ruta = usePathname();
  useEffect(() => {
    void iniciarSincronizacion().then(() => {
      if (faltaPerfil()) window.location.replace('/onboarding?cuenta=1');
    });
  }, []);
  return (
    <FotosContext.Provider value={fotos}>
      <GuiaContext.Provider value={guia}>
      <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80"
          style={{
            background:
              'radial-gradient(360px 260px at 0% 0%, var(--peach) 0%, transparent 70%), radial-gradient(320px 240px at 100% 6%, var(--mustard-soft) 0%, transparent 68%)',
          }}
        />
        <main className="relative z-10 pb-32">{children}</main>
        <nav
          aria-label="Secciones de la app"
          className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-[var(--surface-2)] bg-[var(--surface)] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_-12px_rgb(35_41_31/0.18)]"
        >
          <ul className="flex items-stretch justify-between">
            {PESTANAS.map((p) => {
              const activa =
                p.href === '/app' ? ruta === '/app' : p.href === '/app/prep' ? ruta.startsWith('/app/prep') || ruta.startsWith('/app/compras') : ruta.startsWith(p.href);
              const Icono = p.icono;
              return (
                <li key={p.href} className="flex-1">
                  <Link
                    href={p.href}
                    aria-current={activa ? 'page' : undefined}
                    className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-button)] [touch-action:manipulation]"
                  >
                    <span
                      className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                        activa ? 'bg-[var(--olive-wash)]' : ''
                      }`}
                    >
                      <Icono
                        size={22}
                        strokeWidth={activa ? 2.4 : 1.8}
                        color={activa ? 'var(--accent)' : 'var(--text-secondary)'}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={`text-sm ${activa ? 'font-bold text-[var(--accent)]' : 'font-medium text-[var(--text-secondary)]'}`}
                    >
                      {p.etiqueta}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      </GuiaContext.Provider>
    </FotosContext.Provider>
  );
}
