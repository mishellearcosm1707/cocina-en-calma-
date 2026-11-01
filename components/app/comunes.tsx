'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { Apple, ChefHat, Coffee, Moon, ShoppingBasket, Soup, type LucideIcon } from 'lucide-react';
import type { Comida, Receta } from '@/lib/recetas';

// Piezas compartidas de la app interna: fotos disponibles, miniatura de receta, esqueleto de carga y chips.

export const FotosContext = createContext<string[]>([]);
export const useFotos = () => useContext(FotosContext);

export const ICONO_COMIDA: Record<Comida, LucideIcon> = { Desayuno: Coffee, Almuerzo: Soup, Merienda: Apple, Cena: Moon };

/** Foto real si existe; si no, chip con ícono de línea de la misma familia (nunca emojis mezclados). */
export function Foto({ receta, className = 'size-14' }: { receta: Receta; className?: string }) {
  const fotos = useFotos();
  const Icono = ICONO_COMIDA[receta.comida];
  const hay = fotos.includes(receta.id);
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-button)] bg-[var(--olive-wash)] ${className}`}
    >
      {hay ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/recetas/${receta.id}.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Icono size={24} strokeWidth={1.7} color="var(--accent)" aria-hidden="true" />
      )}
    </span>
  );
}

export function Esqueleto() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4 px-5 pt-6">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[var(--surface-2)]" />
      <div className="h-24 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
    </div>
  );
}

export function Cabecera({ etiqueta, titulo, children }: { etiqueta: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <header className="px-5 pt-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-2)]">{etiqueta}</p>
      <h1 className="mt-1 text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">{titulo}</h1>
      {children}
    </header>
  );
}

export function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`min-h-11 shrink-0 rounded-full border px-4 text-base font-semibold transition-colors duration-200 [touch-action:manipulation] ${
        activo
          ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
          : 'border-[var(--surface-2)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'
      }`}
    >
      {children}
    </button>
  );
}

/** Cuenta del valor anterior al nuevo (número héroe animado); sin animación con movimiento reducido. */
export function Conteo({ valor }: { valor: number }) {
  const reducido = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const previo = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducido) {
      el.textContent = String(valor);
      previo.current = valor;
      return;
    }
    const ctl = animate(previo.current, valor, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    previo.current = valor;
    return () => ctl.stop();
  }, [valor, reducido]);
  return (
    <span ref={ref} className="tabular-nums">
      {valor}
    </span>
  );
}

/** Cambia entre las dos mitades de "Prep y compras" (son dos rutas, el mismo lugar para la persona). */
export function ConmutadorPrep({ actual }: { actual: 'prep' | 'compras' }) {
  const op = [
    { id: 'prep', t: 'Meal prep', href: '/app/prep', icono: ChefHat },
    { id: 'compras', t: 'Compras', href: '/app/compras', icono: ShoppingBasket },
  ] as const;
  return (
    <div role="tablist" aria-label="Prep y compras" className="mx-5 mt-4 flex gap-1 rounded-full bg-[var(--surface-2)] p-1">
      {op.map((o) => {
        const Icono = o.icono;
        const on = actual === o.id;
        return (
          <Link
            key={o.id}
            href={o.href}
            role="tab"
            aria-selected={on}
            replace
            className={`flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-base font-bold transition-colors duration-200 [touch-action:manipulation] ${
              on ? 'bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-1)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <Icono size={20} aria-hidden="true" /> {o.t}
          </Link>
        );
      })}
    </div>
  );
}
