'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, ChefHat, ChevronLeft, ChevronRight, Plus, Sparkles, X } from 'lucide-react';
import { COMIDAS, esComida, opcionPrep, RECETAS, type Comida, type Receta } from '@/lib/recetas';
import {
  actualizar,
  aIso,
  clave,
  completarSemana,
  contarLlenos,
  DIAS,
  DIAS_CORTOS,
  indiceDia,
  lunesDe,
  rangoSemana,
  resolverSemana,
  sumarDias,
  TOTAL_ESPACIOS,
  useApp,
} from '@/lib/semana';
import { Cabecera, Chip, Conteo, Esqueleto, Foto } from './comunes';
import { HojaReceta } from './HojaReceta';
import { PlanificarPrep } from './PlanificarPrep';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Semana() {
  const app = useApp();
  const [offset, setOffset] = useState(0);
  const [diaElegido, setDia] = useState<number | null>(null);
  const [ver, setVer] = useState<Receta | null>(null);
  const [elegir, setElegir] = useState<{ dia: number; comida: Comida } | null>(null);
  const [paso, setPaso] = useState<Receta | null>(null);
  const [soloMios, setSoloMios] = useState(true);
  const [texto, setTexto] = useState('');
  const [deshacer, setDeshacer] = useState<{ semana: string; plan: Record<string, string> } | null>(null);
  const cerrarVer = useCallback(() => setVer(null), []);
  const cerrarElegir = useCallback(() => {
    setElegir(null);
    setPaso(null);
    setTexto('');
  }, []);

  useEffect(() => {
    if (!deshacer) return;
    const t = window.setTimeout(() => setDeshacer(null), 6000);
    return () => window.clearTimeout(t);
  }, [deshacer]);

  useEffect(() => {
    if (!elegir) return;
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && cerrarElegir();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [elegir, cerrarElegir]);

  if (!app) return <Esqueleto />;

  const hoy = new Date();
  const dia = diaElegido ?? indiceDia(hoy);
  const lunes = sumarDias(lunesDe(hoy), offset * 7);
  const semanaKey = aIso(lunes);
  const plan = app.semanas[semanaKey];
  const recetas = resolverSemana(plan);
  const llenos = contarLlenos(plan);
  const completa = llenos >= TOTAL_ESPACIOS;
  const esHoy = (i: number) => aIso(sumarDias(lunes, i)) === aIso(hoy);
  const llenosDia = (i: number) => COMIDAS.filter((c) => recetas.has(clave(i, c))).length;

  function poner(d: number, c: Comida, r: Receta | null) {
    actualizar((e) => {
      const actual = { ...(e.semanas[semanaKey] ?? {}) };
      if (r) actual[clave(d, c)] = r.id;
      else delete actual[clave(d, c)];
      return { ...e, semanas: { ...e.semanas, [semanaKey]: actual } };
    });
    cerrarElegir();
  }

  function ponerVarios(dias: number[], comida: Comida, r: Receta) {
    actualizar((e) => {
      const actual = { ...(e.semanas[semanaKey] ?? {}) };
      for (const d of dias) actual[clave(d, comida)] = r.id;
      return { ...e, semanas: { ...e.semanas, [semanaKey]: actual } };
    });
    cerrarElegir();
  }

  function completar() {
    setDeshacer({ semana: semanaKey, plan: { ...(plan ?? {}) } });
    actualizar((e) => ({
      ...e,
      semanas: { ...e.semanas, [semanaKey]: completarSemana(e.perfil, e.semanas[semanaKey] ?? {}) },
    }));
  }

  function volverAtras() {
    if (!deshacer) return;
    const { semana, plan: anterior } = deshacer;
    actualizar((e) => ({ ...e, semanas: { ...e.semanas, [semana]: anterior } }));
    setDeshacer(null);
  }

  const candidatas = elegir
    ? RECETAS.filter(
        (r) =>
          esComida(r) &&
          r.comida === elegir.comida &&
          (!soloMios || r.sintomas.some((s) => app.perfil.sintomas.includes(s))) &&
          (!texto.trim() || r.nombre.toLowerCase().includes(texto.trim().toLowerCase())),
      )
    : [];

  return (
    <MotionConfig reducedMotion="user">
      <Cabecera
        etiqueta="Semana"
        titulo={
          <>
            Tu semana, <span className="text-[var(--accent)]">resuelta</span>
          </>
        }
      />

      <div className="mx-5 mt-4 flex items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface)] px-2 shadow-[var(--shadow-1)]">
        <button
          type="button"
          onClick={() => setOffset(offset - 1)}
          aria-label="Semana anterior"
          className="flex size-12 items-center justify-center rounded-full text-[var(--accent)]"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <p className="text-center text-base font-bold" aria-live="polite">
          {rangoSemana(lunes)}
          <span className="block text-sm font-normal text-[var(--text-secondary)]">
            {offset === 0 ? 'Esta semana' : offset === -1 ? 'Semana pasada' : offset === 1 ? 'Próxima semana' : lunes.getFullYear()}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setOffset(offset + 1)}
          aria-label="Semana siguiente"
          className="flex size-12 items-center justify-center rounded-full text-[var(--accent)]"
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      <motion.section
        aria-label="Avance de la semana"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.35, ease: EASE }}
        className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4"
      >
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold">
            <Conteo valor={llenos} /> de {TOTAL_ESPACIOS} comidas
          </p>
          {completa && <span className="text-sm font-bold text-[var(--accent)]">¡Semana completa!</span>}
        </div>
        <div
          role="progressbar"
          aria-valuenow={llenos}
          aria-valuemin={0}
          aria-valuemax={TOTAL_ESPACIOS}
          aria-label="Comidas elegidas esta semana"
          className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]"
        >
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--mustard))]"
            animate={{ width: `${(llenos / TOTAL_ESPACIOS) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        {!completa && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={completar}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--accent)] bg-[var(--surface)] px-4 text-base font-semibold text-[var(--accent)] [touch-action:manipulation]"
          >
            <Sparkles size={18} aria-hidden="true" /> Completar las {TOTAL_ESPACIOS - llenos} por mí
          </motion.button>
        )}
      </motion.section>

      <div className="mx-5 mt-4 flex gap-2" role="tablist" aria-label="Días de la semana">
        {DIAS.map((nombre, i) => {
          const activo = dia === i;
          const n = llenosDia(i);
          return (
            <motion.button
              key={nombre}
              type="button"
              whileTap={{ scale: 0.95 }}
              role="tab"
              aria-selected={activo}
              aria-label={`${nombre} ${sumarDias(lunes, i).getDate()}, ${n} de 4 comidas`}
              onClick={() => setDia(i)}
              className={`flex min-h-20 flex-1 flex-col items-center justify-center rounded-[var(--radius-button)] border-2 text-sm font-bold [touch-action:manipulation] ${
                activo
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                  : esHoy(i)
                    ? 'border-[var(--accent)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'
                    : 'border-transparent bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'
              }`}
            >
              {DIAS_CORTOS[i]}
              <span className="text-base tabular-nums">{sumarDias(lunes, i).getDate()}</span>
              <span aria-hidden="true" className={`mt-1 text-sm font-semibold tabular-nums ${n === 4 ? (activo ? 'text-[var(--accent-on-dark)]' : 'text-[var(--accent)]') : 'text-[var(--text-secondary)]'}`}>
                {n}/4
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.section
        key={dia}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        aria-label={DIAS[dia]}
        className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
      >
        <h2 className="text-xl font-bold [font-family:var(--font-display)]">
          {DIAS[dia]} {sumarDias(lunes, dia).getDate()}
          {esHoy(dia) && <span className="ml-2 rounded-full bg-[var(--peach)] px-2 py-0.5 align-middle text-sm font-bold text-[var(--peach-ink)]">Hoy</span>}
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {COMIDAS.map((c) => {
            const r = recetas.get(clave(dia, c));
            return (
              <li key={c} className="flex items-center gap-3">
                {r ? (
                  <>
                    <button type="button" onClick={() => setVer(r)} className="flex min-h-16 flex-1 items-center gap-3 text-left [touch-action:manipulation]">
                      <Foto receta={r} className="size-16" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{c}</span>
                        <span className="block text-base font-semibold leading-snug">{r.nombre}</span>
                      </span>
                    </button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setElegir({ dia, comida: c })}
                      className="min-h-11 shrink-0 rounded-full border border-[var(--surface-2)] px-3 text-sm font-semibold text-[var(--accent)]"
                    >
                      Cambiar
                    </motion.button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setElegir({ dia, comida: c })}
                    className="flex min-h-16 flex-1 items-center justify-between rounded-[var(--radius-button)] border border-dashed border-[var(--text-tertiary)] px-4 text-base font-semibold text-[var(--accent)] [touch-action:manipulation]"
                  >
                    Elegir tu {c.toLowerCase()} <Plus size={20} aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </motion.section>

      <motion.div
        key={String(completa)}
        initial={{ scale: completa ? 0.92 : 1, opacity: completa ? 0 : 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      >
      <Link
        href="/app/prep"
        className={`mx-5 mt-4 flex min-h-16 items-center gap-3 rounded-[var(--radius-card)] px-4 py-3 [touch-action:manipulation] ${
          completa ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--surface)] shadow-[var(--shadow-1)]'
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${completa ? 'bg-[var(--bg)]' : 'bg-[var(--surface-2)]'}`}
        >
          <ChefHat size={20} color="var(--accent)" />
        </span>
        <span className="flex-1">
          <span className="block text-base font-bold">
            Tu meal prep de la semana
          </span>
          <span className={`block text-sm ${completa ? 'text-[var(--bg)]' : 'text-[var(--text-secondary)]'}`}>
            Cocina una vez, come toda la semana
          </span>
        </span>
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
      </motion.div>

      <HojaReceta receta={ver} onCerrar={cerrarVer} />

      {typeof document !== 'undefined' &&
        createPortal(
      <AnimatePresence>
        {elegir && (
          <>
            <motion.div
              key="fondo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cerrarElegir}
              aria-hidden="true"
              className="fixed inset-0 z-30 bg-[color-mix(in_oklab,var(--text-primary)_45%,transparent)]"
            />
            <motion.section
              key="selector"
              role="dialog"
              aria-modal="true"
              aria-label={`Elegir ${elegir.comida.toLowerCase()}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease: EASE }}
              style={{ maxHeight: '88dvh' }}
              className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md flex-col rounded-t-3xl bg-[var(--bg)] shadow-[var(--shadow-2)]"
            >
              <div className="flex items-center justify-between px-5 pt-4">
                <h2 className="text-xl font-bold [font-family:var(--font-display)]">
                  Elige tu {elegir.comida.toLowerCase()} del {DIAS[elegir.dia].toLowerCase()}
                </h2>
                <button
                  type="button"
                  onClick={cerrarElegir}
                  aria-label="Cerrar"
                  className="-mr-3 flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--text-secondary)]"
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              {paso ? (
                <div className="overflow-y-auto px-5 pb-8 pt-3">
                  <div className="flex items-center gap-3">
                    <Foto receta={paso} className="size-14" />
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold leading-snug">{paso.nombre}</p>
                      <button
                        type="button"
                        onClick={() => setPaso(null)}
                        className="min-h-11 text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
                      >
                        Elegir otra
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <PlanificarPrep
                      receta={paso}
                      diaBase={elegir.dia}
                      soloTexto={`Solo el ${DIAS[elegir.dia].toLowerCase()}`}
                      ocupados={new Set(DIAS.map((_, d) => d).filter((d) => d !== elegir.dia && plan?.[clave(d, elegir.comida)]))}
                      onElegir={(dias) => (dias.length > 1 ? ponerVarios(dias, elegir.comida, paso) : poner(elegir.dia, elegir.comida, paso))}
                    />
                  </div>
                </div>
              ) : (
                <>
                <div className="flex flex-wrap items-center gap-2 px-5 pt-2">
                  <input
                    type="search"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Buscar"
                    aria-label="Buscar receta"
                    className="h-12 min-w-0 flex-1 rounded-[var(--radius-button)] border border-[var(--surface-2)] bg-[var(--surface)] px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                  <Chip activo={soloMios} onClick={() => setSoloMios(!soloMios)}>
                    Para mi síntoma
                  </Chip>
                </div>
                <ul className="mt-3 flex flex-col gap-2 overflow-y-auto px-5 pb-8">
                  {candidatas.length === 0 && (
                    <li className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-base text-[var(--text-secondary)]">
                      Nada con eso. Quita el filtro &quot;Para mi síntoma&quot; o cambia la búsqueda.
                    </li>
                  )}
                  {candidatas.map((r) => {
                    const elegida = plan?.[clave(elegir.dia, elegir.comida)] === r.id;
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => (opcionPrep(r) ? setPaso(r) : poner(elegir.dia, elegir.comida, r))}
                          className="flex min-h-16 w-full items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface)] p-2 text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
                        >
                          <Foto receta={r} className="size-14" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-base font-semibold leading-snug">{r.nombre}</span>
                            <span className="block text-sm text-[var(--text-secondary)]">{r.min} min</span>
                          </span>
                          {elegida && <Check size={20} color="var(--accent)" aria-label="Elegida" />}
                        </button>
                      </li>
                    );
                  })}
                  {plan?.[clave(elegir.dia, elegir.comida)] && (
                    <li>
                      <button
                        type="button"
                        onClick={() => poner(elegir.dia, elegir.comida, null)}
                        className="min-h-12 w-full text-base font-semibold text-[var(--text-secondary)] underline underline-offset-4"
                      >
                        Quitar de mi semana
                      </button>
                    </li>
                  )}
                </ul>
                </>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>,
          document.body,
        )}

      <AnimatePresence>
        {deshacer && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-5 top-4 z-30 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-[var(--radius-button)] bg-[var(--text-primary)] px-4 py-3 text-base text-[var(--bg)] shadow-[var(--shadow-2)]"
          >
            Semana completada.
            <button type="button" onClick={volverAtras} className="min-h-11 font-bold text-[var(--accent-on-dark)] underline underline-offset-4">
              Deshacer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
