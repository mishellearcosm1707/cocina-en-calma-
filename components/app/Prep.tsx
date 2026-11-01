'use client';

import { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Check, ChefHat, Clock, Refrigerator, Snowflake, Sparkles, Undo2, UtensilsCrossed } from 'lucide-react';
import { actualizar, aIso, armarPrep, DIAS, lunesDe, rangoSemana, tandasPrep, useApp } from '@/lib/semana';
import { Cabecera, ConmutadorPrep, Esqueleto, Foto } from './comunes';

const EASE = [0.16, 1, 0.3, 1] as const;

function duracion(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
}

function diasTexto(dias: number[]) {
  const nombres = dias.map((d) => DIAS[d].slice(0, 3));
  return nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}` : nombres[0];
}

export function Prep() {
  const app = useApp();
  const [antes, setAntes] = useState<Record<string, string> | null>(null);
  if (!app) return <Esqueleto />;

  const lunes = lunesDe(new Date());
  const semanaKey = aIso(lunes);
  const plan = app.semanas[semanaKey];
  const tandas = tandasPrep(plan);
  const minutos = tandas.reduce((s, t) => s + t.receta.min, 0);
  const porciones = tandas.reduce((s, t) => s + t.dias.length, 0);
  const marca = (id: string, i: number) => `prep:${semanaKey}:${id}:${i}`;
  const pasosTotal = tandas.reduce((s, t) => s + t.receta.pasos.length, 0);
  const pasosHechos = tandas.reduce((s, t) => s + t.receta.pasos.filter((_, i) => app.comprados[marca(t.receta.id, i)]).length, 0);
  const poco = tandas.length < 3;

  function alternar(id: string, i: number) {
    actualizar((e) => ({ ...e, comprados: { ...e.comprados, [marca(id, i)]: !e.comprados[marca(id, i)] } }));
  }
  function armar() {
    setAntes({ ...(plan ?? {}) });
    actualizar((e) => ({ ...e, semanas: { ...e.semanas, [semanaKey]: armarPrep(e.perfil, e.semanas[semanaKey] ?? {}) } }));
  }
  function deshacer() {
    if (!antes) return;
    const previo = antes;
    actualizar((e) => ({ ...e, semanas: { ...e.semanas, [semanaKey]: previo } }));
    setAntes(null);
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cabecera
        etiqueta={`Semana del ${rangoSemana(lunes)}`}
        titulo={
          <>
            Cocina <span className="text-[var(--accent)]">una vez</span>, come toda la semana
          </>
        }
      />
      <ConmutadorPrep actual="prep" />

      {tandas.length > 0 && (
        <motion.section
          aria-label="Resumen de tu tarde de cocina"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mx-5 mt-4 overflow-hidden rounded-[var(--radius-card)] bg-[var(--accent)] p-4 text-[var(--bg)] shadow-[var(--shadow-2)]"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-on-dark)]">Tu tarde de cocina</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            {[
              [String(tandas.length), 'recetas'],
              [String(porciones), 'comidas listas'],
              [duracion(minutos), 'en total'],
            ].map(([n, t]) => (
              <div key={t} className="rounded-[var(--radius-button)] bg-white/10 p-2">
                <p className="text-2xl font-bold tabular-nums [font-family:var(--font-display)]">{n}</p>
                <p className="text-sm">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div
              role="progressbar"
              aria-valuenow={pasosHechos}
              aria-valuemin={0}
              aria-valuemax={pasosTotal}
              aria-label="Pasos de la tarde de cocina que ya hiciste"
              className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <motion.div
                className="h-full rounded-full bg-[var(--accent-on-dark)]"
                animate={{ width: pasosTotal ? `${(pasosHechos / pasosTotal) * 100}%` : '0%' }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
            <p className="text-sm font-semibold tabular-nums">
              {pasosHechos}/{pasosTotal} pasos
            </p>
          </div>
        </motion.section>
      )}

      {poco && (
        <section aria-label="Armar tu meal prep" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--mustard-soft)]">
            <ChefHat size={26} color="var(--mustard-ink)" aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-xl font-bold [font-family:var(--font-display)]">
            {tandas.length === 0 ? 'Aún no planeaste ninguna receta para varios días' : 'Pocas recetas para cocinar una vez'}
          </h2>
          <p className="mt-1 text-base text-[var(--text-secondary)]">
            El meal prep es cocinar una receta una sola vez y comerla en varios días. También puedes hacerlo tú: al elegir una receta en Semana o en Recetas, la app te recomienda en qué días repetirla. O deja que yo te arme una semana con 5 recetas que se guardan bien, cada una en dos días.
          </p>
          <button
            type="button"
            onClick={armar}
            className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)] [touch-action:manipulation]"
          >
            <Sparkles size={20} aria-hidden="true" /> Armar mi semana de meal prep
          </button>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Cambia hasta 10 comidas de esta semana. Puedes deshacerlo.</p>
        </section>
      )}

      {antes && !poco && (
        <div role="status" className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-[var(--radius-button)] bg-[var(--olive-wash)] px-4 py-2">
          <span className="text-base font-semibold text-[var(--accent)]">Listo: tu semana ya es de meal prep</span>
          <button type="button" onClick={deshacer} className="flex min-h-11 items-center gap-1 text-base font-bold text-[var(--accent)] underline underline-offset-4">
            <Undo2 size={18} aria-hidden="true" /> Deshacer
          </button>
        </div>
      )}

      {tandas.length > 0 && (
        <>
          <section aria-label="Cómo organizar la tarde" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--sky)] p-4">
            <h2 className="flex items-center gap-2 text-lg font-bold [font-family:var(--font-display)]">
              <Clock size={20} color="var(--sky-ink)" aria-hidden="true" /> Cómo organizar la tarde
            </h2>
            <ol className="mt-2 flex flex-col gap-1 text-base text-[var(--sky-ink)]">
              <li>
                <b>1.</b> Saca todo lo que vas a usar y lava y pica las verduras de una vez.
              </li>
              <li>
                <b>2.</b> Empieza por la que más tarda y, mientras cocina, avanza con la siguiente.
              </li>
              <li>
                <b>3.</b> Deja enfriar, reparte en recipientes y rotula con el día.
              </li>
            </ol>
          </section>

          <ol className="mt-4 flex flex-col gap-4">
            {tandas.map((t, n) => {
              const r = t.receta;
              const hechos = r.pasos.filter((_, i) => app.comprados[marca(r.id, i)]).length;
              const lista = hechos === r.pasos.length;
              return (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * n, duration: 0.35, ease: EASE }}
                  className={`mx-5 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-1)] ${lista ? 'bg-[var(--olive-wash)]' : 'bg-[var(--surface)]'}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--bg)]"
                    >
                      {lista ? <Check size={18} strokeWidth={3} /> : n + 1}
                    </span>
                    <Foto receta={r} className="size-14" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold leading-snug">{r.nombre}</span>
                      <span className="block text-sm text-[var(--text-secondary)]">
                        {r.min} min · alcanza para {t.dias.length} {t.dias.length === 1 ? 'comida' : 'comidas'}
                      </span>
                    </span>
                  </div>

                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                    <UtensilsCrossed size={16} aria-hidden="true" /> La comes: {diasTexto(t.dias)}
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                      t.guardar === 'nevera' ? 'bg-[var(--mustard-soft)] text-[var(--mustard-ink)]' : 'bg-[var(--sky)] text-[var(--sky-ink)]'
                    }`}
                  >
                    {t.guardar === 'nevera' ? (
                      <>
                        <Refrigerator size={16} aria-hidden="true" /> Guárdala en la nevera
                      </>
                    ) : (
                      <>
                        <Snowflake size={16} aria-hidden="true" /> Congélala ({r.congelable_dias} días) y pásala a la nevera la noche antes
                      </>
                    )}
                  </p>

                  <ul className="mt-3">
                    {r.pasos.map((p, i) => {
                      const hecho = Boolean(app.comprados[marca(r.id, i)]);
                      return (
                        <li key={i}>
                          <label className="flex min-h-12 cursor-pointer items-start gap-3 py-2">
                            <input type="checkbox" checked={hecho} onChange={() => alternar(r.id, i)} className="peer sr-only" />
                            <span
                              aria-hidden="true"
                              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-[var(--text-tertiary)] bg-[var(--bg)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]"
                            >
                              {hecho && <Check size={16} strokeWidth={3} color="var(--bg)" />}
                            </span>
                            <span className={`flex-1 text-base ${hecho ? 'text-[var(--text-secondary)] line-through' : ''}`}>{p}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </motion.li>
              );
            })}
          </ol>
        </>
      )}
    </MotionConfig>
  );
}
