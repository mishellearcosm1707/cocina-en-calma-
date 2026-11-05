'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const SECCIONES: Array<[string, string]> = [
  ['/admin', 'Resumen'],
  ['/admin/ventas', 'Ventas'],
  ['/admin/ganancia', 'Ganancia'],
  ['/admin/usuarios', 'Usuarias'],
  ['/admin/uso', 'Uso'],
  ['/admin/negocio', 'Negocio'],
  ['/admin/salud', 'Salud'],
  ['/admin/ajustes', 'Ajustes'],
];

export function NavAdmin() {
  const ruta = usePathname();
  const lista = useRef<HTMLUListElement>(null);
  useEffect(() => {
    lista.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [ruta]);
  return (
    <nav aria-label="Secciones del panel" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul ref={lista} className="flex gap-2 pb-1">
        {SECCIONES.map(([href, nombre]) => {
          const activa = href === '/admin' ? ruta === '/admin' : ruta.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={activa ? 'page' : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-base font-semibold transition-transform duration-150 active:scale-[0.97] [touch-action:manipulation] ${
                  activa ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]' : 'border-[var(--surface-2)] bg-[var(--surface)] text-[var(--text-primary)]'
                }`}
              >
                {nombre}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
