'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Clock, Snowflake, X, Zap } from 'lucide-react';
import type { Receta } from '@/lib/recetas';
import { Foto } from './comunes';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Hoja inferior con la receta completa: por qué cae bien, ingredientes, pasos y (plegados) los valores por porción. */
export function HojaReceta({
  receta,
  onCerrar,
  accion,
}: {
  receta: Receta | null;
  onCerrar: () => void;
  accion?: ReactNode;
}) {
  useEffect(() => {
    if (!receta) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => {
      window.removeEventListener('keydown', tecla);
      document.body.style.overflow = antes;
    };
  }, [receta, onCerrar]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {receta && (
        <>
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCerrar}
            aria-hidden="true"
            className="fixed inset-0 z-30 bg-[color-mix(in_oklab,var(--text-primary)_45%,transparent)]"
          />
          <motion.section
            key="hoja"
            role="dialog"
            aria-modal="true"
            aria-label={receta.nombre}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ maxHeight: "88dvh" }}
            className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md flex-col rounded-t-3xl bg-[var(--bg)] shadow-[var(--shadow-2)]"
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-[var(--surface-2)]" />
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar receta"
                className="-mr-3 flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)]"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pb-[max(32px,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-4">
                <Foto receta={receta} className="size-24" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">{receta.comida}</p>
                  <h2 className="text-balance text-2xl font-bold leading-tight [font-family:var(--font-display)]">
                    {receta.nombre}
                  </h2>
                </div>
              </div>
              <p className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm font-semibold">
                  <Clock size={16} aria-hidden="true" /> {receta.min} min
                </span>
                {receta.min <= 15 && (
                  <span className="flex items-center gap-1 rounded-full bg-[var(--mustard-soft)] px-3 py-1 text-sm font-semibold text-[var(--mustard-ink)]">
                    <Zap size={16} aria-hidden="true" /> Express
                  </span>
                )}
                {receta.congelable_dias ? (
                  <span className="flex items-center gap-1 rounded-full bg-[var(--sky)] px-3 py-1 text-sm font-semibold text-[var(--sky-ink)]">
                    <Snowflake size={16} aria-hidden="true" /> Se guarda {receta.congelable_dias} días
                  </span>
                ) : null}
                {receta.sintomas.map((s) => (
                  <span key={s} className="rounded-full bg-[var(--peach)] px-3 py-1 text-sm font-semibold text-[var(--peach-ink)]">
                    {s}
                  </span>
                ))}
              </p>
              <p className="mt-4 rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4 text-base leading-snug">
                <b>Por qué te cae bien.</b> {receta.porque}
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Ingredientes</h3>
              <ul className="mt-2 flex flex-col gap-2 text-base">
                {receta.ing.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    {i}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Cómo se hace</h3>
              <ol className="mt-2 flex flex-col gap-3 text-base">
                {receta.pasos.map((p, n) => (
                  <li key={p} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--olive-wash)] text-sm font-bold text-[var(--accent)]"
                    >
                      {n + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>
              <details className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface)] px-4 shadow-[var(--shadow-1)]">
                <summary className="min-h-12 cursor-pointer py-3 text-base font-semibold text-[var(--accent)]">
                  Ver valores por porción
                </summary>
                <dl className="grid grid-cols-2 gap-3 pb-3 text-base">
                  {[
                    ['Energía', `${receta.kcal} kcal`],
                    ['Proteína', `${receta.prot} g`],
                    ['Carbohidratos', `${receta.carb} g`],
                    ['Grasas', `${receta.gras} g`],
                    ['Fibra', `${receta.fibra} g`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-sm text-[var(--text-secondary)]">{k}</dt>
                      <dd className="text-lg font-bold tabular-nums [font-family:var(--font-display)]">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pb-3 text-sm text-[var(--text-secondary)]">
                  Valores estimados con las tablas INCAP y USDA. Orientativos: no reemplazan a tu profesional de la nutrición.
                </p>
              </details>
              {accion && <div className="mt-6">{accion}</div>}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
