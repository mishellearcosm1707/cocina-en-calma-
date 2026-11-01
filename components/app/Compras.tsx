'use client';

import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Lock, Snowflake } from 'lucide-react';
import {
  actualizar,
  aIso,
  contarLlenos,
  listaCompras,
  lunesDe,
  PASILLOS,
  rangoSemana,
  resolverSemana,
  TOTAL_ESPACIOS,
  useApp,
} from '@/lib/semana';
import { Cabecera, Esqueleto } from './comunes';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Compras() {
  const app = useApp();
  if (!app) return <Esqueleto />;

  const lunes = lunesDe(new Date());
  const semanaKey = aIso(lunes);
  const plan = app.semanas[semanaKey];
  const items = listaCompras(plan);
  const llenos = contarLlenos(plan);
  const completa = llenos >= TOTAL_ESPACIOS;
  const marca = (k: string) => `${semanaKey}:${k}`;
  const comprados = items.filter((i) => app.comprados[marca(i.clave)]).length;

  // Preparación de una tarde: las recetas de la semana que se guardan, de la que más tarda a la que menos.
  const unicas = [...new Map([...resolverSemana(plan).values()].map((r) => [r.id, r])).values()];
  const aGuardar = unicas.filter((r) => r.congelable_dias).sort((a, b) => b.min - a.min).slice(0, 6);
  const minutos = aGuardar.reduce((s, r) => s + r.min, 0);

  function alternar(k: string) {
    actualizar((e) => ({ ...e, comprados: { ...e.comprados, [marca(k)]: !e.comprados[marca(k)] } }));
  }
  function desmarcar() {
    actualizar((e) => {
      const c = { ...e.comprados };
      for (const i of items) delete c[marca(i.clave)];
      return { ...e, comprados: c };
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cabecera
        etiqueta={`Semana del ${rangoSemana(lunes)}`}
        titulo={
          <>
            Tu lista, <span className="text-[var(--accent)]">lista</span>
          </>
        }
      />

      <section aria-label="Lista de compras" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-bold">
            <span className="tabular-nums">{comprados}</span> de <span className="tabular-nums">{items.length}</span> en el carrito
          </p>
          {comprados > 0 && (
            <button type="button" onClick={desmarcar} className="min-h-11 text-sm font-semibold text-[var(--accent)] underline underline-offset-4">
              Desmarcar todo
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-valuenow={comprados}
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-label="Ingredientes ya comprados"
          className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]"
        >
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--mustard))]"
            animate={{ width: items.length ? `${(comprados / items.length) * 100}%` : '0%' }}
            transition={{ duration: 0.4, ease: EASE }}
          />
        </div>
        {items.length === 0 ? (
          <p className="mt-4 text-base text-[var(--text-secondary)]">
            Aún no hay comidas elegidas esta semana.{' '}
            <Link href="/app/semana" className="font-semibold text-[var(--accent)] underline underline-offset-4">
              Armar mi semana
            </Link>
          </p>
        ) : (
          PASILLOS.map((p) => {
            const delPasillo = items.filter((i) => i.pasillo === p);
            if (!delPasillo.length) return null;
            return (
              <div key={p} className="mt-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-2)]">{p}</h2>
                <ul className="mt-1">
                  {delPasillo.map((i) => {
                    const hecho = Boolean(app.comprados[marca(i.clave)]);
                    return (
                      <li key={i.clave}>
                        <label className="flex min-h-12 cursor-pointer items-center gap-3 py-1">
                          <input type="checkbox" checked={hecho} onChange={() => alternar(i.clave)} className="peer sr-only" />
                          <span
                            aria-hidden="true"
                            className="flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-[var(--text-tertiary)] bg-[var(--bg)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]"
                          >
                            {hecho && <Check size={16} strokeWidth={3} color="var(--bg)" />}
                          </span>
                          <span className={`flex-1 text-base ${hecho ? 'text-[var(--text-secondary)] line-through' : ''}`}>{i.nombre}</span>
                          {i.veces > 1 && (
                            <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-sm font-semibold tabular-nums">×{i.veces}</span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </section>

      <section aria-label="Preparación de una tarde" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4">
        <h2 className="flex items-center gap-2 text-xl font-bold [font-family:var(--font-display)]">
          {!completa && <Lock size={20} aria-hidden="true" />}
          Preparación de una tarde
        </h2>
        {!completa ? (
          <>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Elige tus {TOTAL_ESPACIOS} comidas y desbloqueas la guía para cocinar todo junto. Llevas{' '}
              <b className="tabular-nums text-[var(--text-primary)]">{llenos}</b>.
            </p>
            <Link
              href="/app/semana"
              className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-base font-bold text-[var(--bg)] [touch-action:manipulation]"
            >
              Completar mi semana <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </>
        ) : aGuardar.length === 0 ? (
          <p className="mt-2 text-base text-[var(--text-secondary)]">
            Esta semana tus recetas son de cocina corta. Si prefieres cocinar todo en una tarde, cambia algunas por las que dicen{' '}
            <b>Congelable</b> en Recetas.
          </p>
        ) : (
          <>
            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Cocina estas {aGuardar.length} recetas juntas, guárdalas y tendrás la semana lista. Tiempo estimado:{' '}
              <b className="tabular-nums text-[var(--text-primary)]">
                {minutos >= 60 ? `${Math.floor(minutos / 60)} h ${minutos % 60 ? `${minutos % 60} min` : ''}` : `${minutos} min`}
              </b>
              .
            </p>
            <ol className="mt-4 flex flex-col gap-3">
              {aGuardar.map((r, n) => (
                <li key={r.id} className="flex items-start gap-3 rounded-[var(--radius-button)] bg-[var(--surface)] p-3 shadow-[var(--shadow-1)]">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--bg)]"
                  >
                    {n + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-snug">{r.nombre}</span>
                    <span className="mt-1 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      {r.min} min <Snowflake size={16} aria-hidden="true" color="var(--sky-ink)" /> se guarda {r.congelable_dias} días
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Al final, reparte en recipientes y rotula cada uno con el día en que lo vas a comer.
            </p>
          </>
        )}
      </section>
    </MotionConfig>
  );
}
