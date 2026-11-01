'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Flame, Frown, Meh, Smile, type LucideIcon } from 'lucide-react';
import { calcularRequerimientos, REPARTO } from '@/lib/calculos';
import { COMIDAS, type Comida, type Receta } from '@/lib/recetas';
import {
  actualizar,
  aIso,
  clave,
  contarLlenos,
  fechaLarga,
  indiceDia,
  lunesDe,
  resolverSemana,
  sumarDias,
  TOTAL_ESPACIOS,
  useApp,
  type Nivel,
} from '@/lib/semana';
import { Cabecera, Conteo, Esqueleto, Foto } from './comunes';
import { HojaReceta } from './HojaReceta';

const EASE = [0.16, 1, 0.3, 1] as const;
const NIVELES: { v: Nivel; t: string; icono: LucideIcon; fondo: string; tinta: string }[] = [
  { v: 'ligera', t: 'Ligera', icono: Smile, fondo: 'var(--olive-wash)', tinta: 'var(--accent)' },
  { v: 'normal', t: 'Normal', icono: Meh, fondo: 'var(--mustard-soft)', tinta: 'var(--mustard-ink)' },
  { v: 'hinchada', t: 'Hinchada', icono: Frown, fondo: 'var(--peach)', tinta: 'var(--peach-ink)' },
];

export function Hoy() {
  const app = useApp();
  const [abierta, setAbierta] = useState<Receta | null>(null);
  const cerrar = useCallback(() => setAbierta(null), []);
  if (!app) return <Esqueleto />;

  const hoy = new Date();
  const lunes = lunesDe(hoy);
  const plan = app.semanas[aIso(lunes)];
  const recetas = resolverSemana(plan);
  const d = indiceDia(hoy);
  const req = calcularRequerimientos({
    sexo: app.perfil.sexo,
    edad: app.perfil.edad,
    peso: app.perfil.peso,
    talla: app.perfil.talla,
    actividad: app.perfil.actividad,
    objetivo: app.perfil.objetivo,
  });
  const comidasHoy = COMIDAS.map((c) => ({ c, r: recetas.get(clave(d, c)) }));
  const kcalHoy = comidasHoy.reduce((s, x) => {
    if (!x.r) return s;
    const p = Math.min(1.5, Math.max(0.75, Math.round(((req.kcal * REPARTO[x.c]) / x.r.kcal) * 4) / 4));
    return s + x.r.kcal * p;
  }, 0);
  const cobertura = Math.min(100, Math.round((kcalHoy / req.kcal) * 100));
  const llenos = contarLlenos(plan);
  // La comida que toca ahora según la hora: es la acción obvia de la pantalla.
  const hora = hoy.getHours();
  const toca: Comida = hora < 10 ? 'Desayuno' : hora < 15 ? 'Almuerzo' : hora < 18 ? 'Merienda' : 'Cena';

  const hoyIso = aIso(hoy);
  const miNivel = app.chequeos[hoyIso];
  // Patrón de los últimos 7 días con chequeo (inversión activa: lo que anotas hoy cambia lo que ves mañana).
  const ultimos = Array.from({ length: 7 }, (_, i) => app.chequeos[aIso(sumarDias(hoy, -i))]).filter(Boolean);
  const ligeras = ultimos.filter((n) => n === 'ligera').length;
  let racha = 0;
  for (let i = miNivel ? 0 : 1; app.chequeos[aIso(sumarDias(hoy, -i))]; i++) racha++;

  function anotar(n: Nivel) {
    actualizar((e) => ({ ...e, chequeos: { ...e.chequeos, [hoyIso]: n } }));
  }

  return (
    <MotionConfig reducedMotion="user">
      <Cabecera
        etiqueta={fechaLarga(hoy)}
        titulo={
          <>
            {app.perfil.nombre ? `Hola, ${app.perfil.nombre}: ` : 'Hola: '}
            <span className="text-[var(--accent)]">tu día</span> en calma
          </>
        }
      />

      <motion.section
        aria-label="Tu menú de hoy"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mx-5 mt-5 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold [font-family:var(--font-display)]">Tu menú de hoy</h2>
          <span className="rounded-full bg-[var(--olive-wash)] px-3 py-1 text-base font-bold text-[var(--accent)]">
            <Conteo valor={cobertura} />%
          </span>
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">de lo que tu cuerpo necesita hoy, sin pesar nada</p>
        <div
          role="progressbar"
          aria-valuenow={cobertura}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Cuánto de lo que necesita tu cuerpo cubre tu menú de hoy"
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]"
        >
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--mustard))]"
            initial={{ width: 0 }}
            animate={{ width: `${cobertura}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
        <ul className="mt-4 flex flex-col gap-3">
          {comidasHoy.map(({ c, r }, n) => (
            <motion.li
              key={c}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * n, duration: 0.3, ease: EASE }}
            >
              {r ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAbierta(r)}
                  className={`flex min-h-16 w-full items-center gap-3 rounded-[var(--radius-button)] text-left [touch-action:manipulation] ${
                    c === toca ? '-mx-2 bg-[var(--olive-wash)] p-2 ring-2 ring-[var(--accent)]' : ''
                  }`}
                >
                  <Foto receta={r} className="size-16" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{c}</span>
                    <span className="block text-base font-semibold leading-snug">{r.nombre}</span>
                    <span className="block text-sm text-[var(--text-secondary)]">{r.min} min</span>
                  </span>
                  {c === toca ? (
                    <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-bold text-[var(--bg)]">Te toca</span>
                  ) : (
                    <ArrowRight size={18} aria-hidden="true" color="var(--text-secondary)" />
                  )}
                </motion.button>
              ) : (
                <Link
                  href="/app/semana"
                  className="flex min-h-16 items-center justify-between rounded-[var(--radius-button)] border border-dashed border-[var(--text-tertiary)] px-4 text-base font-semibold text-[var(--accent)]"
                >
                  Elegir tu {c.toLowerCase()} <ArrowRight size={18} aria-hidden="true" />
                </Link>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        aria-label="Chequeo del día"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
        className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
      >
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">¿Cómo te sientes hoy?</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {NIVELES.map((n) => {
            const Icono = n.icono;
            const activo = miNivel === n.v;
            return (
              <motion.button
                key={n.v}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => anotar(n.v)}
                aria-pressed={activo}
                className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-button)] border-2 text-base font-semibold [touch-action:manipulation] ${
                  activo ? 'border-[var(--accent)]' : 'border-transparent'
                }`}
                style={{ background: n.fondo, color: n.tinta }}
              >
                <Icono size={28} strokeWidth={1.8} aria-hidden="true" />
                {n.t}
              </motion.button>
            );
          })}
        </div>
        <p role="status" className="mt-3 flex items-start gap-2 text-base text-[var(--text-secondary)]">
          {miNivel ? (
            <>
              <Check size={20} color="var(--accent)" aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                Anotado. En los últimos 7 días te sentiste <b className="text-[var(--text-primary)]">ligera {ligeras} {ligeras === 1 ? 'vez' : 'veces'}</b> de{' '}
                {ultimos.length}.
              </span>
            </>
          ) : (
            <span>Un toque y ves tu patrón de la semana. Sin pesar nada.</span>
          )}
        </p>
        {racha > 0 && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-2)]">
            <Flame size={18} aria-hidden="true" /> {racha} {racha === 1 ? 'día' : 'días'} seguidos de chequeo
          </p>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
      >
        <Link
          href="/app/semana"
          className="mx-5 mt-4 flex min-h-16 items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-1)] active:scale-[0.98] [touch-action:manipulation]"
        >
          <span>
            <span className="block text-base font-bold">Tu semana: {llenos} de {TOTAL_ESPACIOS} comidas</span>
            <span className="block text-sm text-[var(--text-secondary)]">
              {llenos >= TOTAL_ESPACIOS ? 'Lista: ya puedes preparar todo en una tarde' : `Completa las ${TOTAL_ESPACIOS - llenos} que faltan y desbloqueas tu preparación`}
            </span>
          </span>
          <ArrowRight size={20} aria-hidden="true" color="var(--accent)" />
        </Link>
      </motion.div>

      <HojaReceta receta={abierta} onCerrar={cerrar} />
    </MotionConfig>
  );
}
