'use client';

// PANTALLA DE PLANES — plan único de pago único (FICHA-MERCADO: $14.99, sin suscripción, garantía de 7 días por Hotmart).
// Misión: que la persona desbloquee su semana completa. Objeto principal: la semana con el lunes ya armado y
// 6 días bloqueados (pérdida honesta). Copy trazado a FICHA-AVATAR (deseo: terminar el día ligera sin contar;
// objeción "es caro" → precio por día (el ancla con la tarifa de una consulta se añade cuando la dueña aporte la cifra real); objeción de confianza → garantía y pago por Hotmart).
// El cobro real se conecta en la etapa de servicios externos: hasta entonces el botón NO simula un pago.

import { Logo } from '@/components/Logo';
import { TOTAL_RECETAS } from '@/lib/oferta';
import { useEffect, useState } from 'react';
import { animate, AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Apple, BadgeCheck, Check, ChevronDown, Coffee, Loader2, Lock, Moon, Soup, X, type LucideIcon } from 'lucide-react';
import { calcularRequerimientos, generarMenu, type Actividad, type Objetivo, type Ritmo, type Sexo } from '@/lib/calculos';
import { Sello } from '@/components/landing/Sello';
import type { Comida, Receta, Sintoma } from '@/lib/recetas';

const CLAVE = 'cec-onboarding-v1';
const CHECKOUT_URL = process.env.NEXT_PUBLIC_HOTMART_CHECKOUT_URL ?? '';
const PRECIO = 14.99;
const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const EASE = [0.16, 1, 0.3, 1] as const;

const ENTRA = { oculto: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const APARECE = { oculto: { opacity: 0 }, visible: { opacity: 1 } };

interface Guardado {
  sexo: Sexo;
  edad: string;
  peso: string;
  talla: string;
  actividad: Actividad | null;
  objetivo: Objetivo | null;
  sintomas: Sintoma[];
  ingredientes: string[];
  dolores: ('panza' | 'cansancio' | 'bascula')[];
  ritmo: Ritmo | null;
  nombre: string;
}

function leer(): Partial<Guardado> {
  try {
    return JSON.parse(window.sessionStorage.getItem(CLAVE) ?? '{}') as Partial<Guardado>;
  } catch {
    return {};
  }
}

/** Cuenta de 0 al valor en tabular-nums; sin conteo con movimiento reducido. */
function Precio({ valor }: { valor: number }) {
  const reducido = useReducedMotion();
  const [v, setV] = useState(reducido ? valor : 0);
  useEffect(() => {
    if (reducido) return;
    const c = animate(0, valor, { duration: 0.9, ease: EASE, onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [valor, reducido]);
  return <span className="tabular-nums">${v.toFixed(2)}</span>;
}

const ICONO: Record<Comida, LucideIcon> = { Desayuno: Coffee, Almuerzo: Soup, Merienda: Apple, Cena: Moon };

/** Foto real si existe; si no, chip con ícono de línea de la misma familia (nunca emojis mezclados). */
function Miniatura({ receta, foto }: { receta: Receta; foto: boolean }) {
  const Icono = ICONO[receta.comida];
  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-button)] bg-[var(--olive-wash)]">
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/recetas/${receta.id}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Icono size={24} strokeWidth={1.8} color="var(--accent)" aria-hidden="true" />
      )}
    </span>
  );
}

/** La línea sobre el titular sigue la situación que la persona eligió al empezar (literales de la FICHA-AVATAR). */
const LINEA_DOLOR = {
  panza: '¿Panza de embarazada sin estarlo?',
  cansancio: '¿Llegas agotada y sin saber qué cocinar?',
  bascula: '¿Harta de pesar la comida y contar calorías?',
} as const;

const PREGUNTAS = [
  { q: '¿Tengo que pesar la comida?', a: 'No. Usamos tazas, puños y unidades. La app hace las cuentas: tú solo eliges qué comer.' },
  { q: '¿Cómo pago desde mi país?', a: 'Con tarjeta u otros métodos que Hotmart ofrece según tu país. Pagas una sola vez, sin renovaciones.' },
];

const BENEFICIOS = [
  'Tus 7 días con 4 comidas, ajustados a tu síntoma',
  'Preparación de una sola tarde y lista de compras',
  `${TOTAL_RECETAS} recetas con ingredientes de casa`,
  'Chequeo diario que ajusta tu menú de mañana',
];

export function Paywall({ fotos }: { fotos: string[] }) {
  // Solo se dibuja en el navegador (carga dinámica sin SSR), así que puede leer el progreso al nacer.
  const [g] = useState<Partial<Guardado>>(leer);
  const [aviso, setAviso] = useState('');
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState<number | null>(null);
  const [diaAviso, setDiaAviso] = useState(false);

  const dolores = g.dolores ?? [];
  const sintomas = g.sintomas ?? [];
  const ingredientes = g.ingredientes ?? [];
  const datosOk = Boolean(g.edad && g.peso && g.talla && g.actividad && g.objetivo);
  const kcal = datosOk
    ? calcularRequerimientos({
        sexo: g.sexo ?? 'mujer',
        edad: Number(g.edad),
        peso: Number(g.peso),
        talla: Number(g.talla),
        actividad: g.actividad as Actividad,
        objetivo: g.objetivo as Objetivo,
      }).kcal
    : 1800;
  const ritmo = g.ritmo ?? null;
  const nombre = (g.nombre ?? '').trim();
  const menu = generarMenu(sintomas, ingredientes, kcal, fotos, ritmo);
  // Costo hundido VISIBLE (regla a de la escalera): todo lo que la persona ya puso en su Menú Calma.
  const respuestas = (datosOk ? 6 : 0) + dolores.length + sintomas.length + (ritmo ? 1 : 0) + ingredientes.length;

  const fuerte = 'font-semibold text-[var(--text-primary)]';
  const susSintomas = sintomas.slice(0, 2).map((s) => s.toLowerCase()).join(' y ');
  const subtitulo =
    respuestas > 0 ? (
      <>
        Hecho con tus <b className={fuerte}>{respuestas} respuestas</b>: {susSintomas || 'tu síntoma'}, tu ritmo y lo que ya tienes en casa.
      </>
    ) : (
      <>
        Armado para <b className={fuerte}>tu síntoma</b> y con lo que ya tienes en casa.
      </>
    );

  function desbloquear() {
    if (cargando) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setAviso('Parece que no tienes conexión. Revisa tu internet y vuelve a intentarlo.');
      return;
    }
    setAviso('');
    setCargando(true);
    if (CHECKOUT_URL) {
      window.location.href = CHECKOUT_URL;
      return;
    }
    // Sin enlace de Hotmart todavía: no se simula ningún cobro, se dice la verdad.
    window.setTimeout(() => {
      setCargando(false);
      setAviso('Estamos conectando el pago con Hotmart. Por ahora no se cobra nada.');
    }, 700);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96"
          style={{
            background:
              'radial-gradient(420px 300px at 0% 0%, var(--peach) 0%, transparent 70%), radial-gradient(380px 280px at 100% 10%, var(--mustard-soft) 0%, transparent 68%)',
          }}
        />
        <motion.main
          initial="oculto"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="relative mx-auto w-full max-w-md px-5"
        >
          <motion.div variants={APARECE} className="flex h-14 items-center justify-between">
            <a
              href="/onboarding"
              aria-label="Cerrar y volver a mi menú de hoy"
              className="-ml-3 flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] [touch-action:manipulation]"
            >
              <X size={22} aria-hidden="true" />
            </a>
            <span className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
              <Logo alto={32} />
              Cocina en Calma
            </span>
            <span aria-hidden="true" className="size-11" />
          </motion.div>

          <motion.p
            variants={APARECE}
            className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"
          >
            <motion.span
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 15 }}
              className="flex size-6 items-center justify-center rounded-full bg-[var(--accent)]"
            >
              <Check size={14} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
            </motion.span>
            Tu menú del lunes está listo
          </motion.p>
          <motion.p
            variants={ENTRA}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent-2)]"
          >
            {LINEA_DOLOR[dolores[0] ?? 'panza']}
          </motion.p>
          <motion.h1
            variants={ENTRA}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-2 text-balance text-3xl font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]"
          >
            {nombre ? `${nombre}, tu` : 'Tu'} Menú Calma de{' '}
            <span className="text-[var(--accent)] [background-image:linear-gradient(transparent_62%,var(--mustard-soft)_62%)]">
              toda la semana
            </span>
          </motion.h1>
          <motion.p
            variants={ENTRA}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]"
          >
            {subtitulo}
          </motion.p>

          {/* Visual del valor: la semana con el lunes ya armado y 6 días bloqueados (pérdida honesta) */}
          <motion.section
            aria-label="Tu semana"
            variants={ENTRA}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
          >
            <div className="flex items-center justify-between gap-1">
              {DIAS.map((d, i) => (
                <motion.button
                  type="button"
                  key={d}
                  aria-label={i === 0 ? 'Lunes, ya armado' : 'Se desbloquea al comprar'}
                  onClick={() => i > 0 && setDiaAviso(true)}
                  whileTap={{ scale: 0.92 }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, type: 'spring', stiffness: 380, damping: 22 }}
                  className={`flex h-11 flex-1 items-center justify-center rounded-full text-sm font-bold [touch-action:manipulation] ${
                    i === 0
                      ? 'bg-[var(--accent)] text-[var(--bg)]'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)]'
                  }`}
                >
                  {i === 0 ? d : <Lock size={13} strokeWidth={2.2} aria-hidden="true" />}
                </motion.button>
              ))}
            </div>
            <p role="status" className="mt-4 text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
              <motion.span key={String(diaAviso)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="inline-block">
                {diaAviso ? 'Martes a domingo se desbloquean al comprar' : 'Lunes · ya armado'}
              </motion.span>
            </p>
            <ul className="mt-3 space-y-3">
                {menu.items.map((it) => (
                  <li key={it.receta.id} className="flex items-center gap-3">
                    <Miniatura receta={it.receta} foto={fotos.includes(it.receta.id)} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                        {it.receta.comida}
                      </p>
                      <p className="text-base font-semibold leading-snug text-[var(--text-primary)]">
                        {it.receta.nombre}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--peach-wash)] p-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--peach)]"
              >
                <Lock size={18} color="var(--peach-ink)" />
              </span>
              <p className="text-sm leading-snug text-[var(--text-primary)]">
                <b className="font-semibold">Martes a domingo</b> se arman al desbloquear, con tu preparación de una tarde y tu lista
                de compras.
              </p>
            </div>
          </motion.section>

          {/* Plan único ya seleccionado: precio + beneficios en UNA caja (el precio vive en esta pantalla) */}
          <motion.section
            aria-label="Plan"
            variants={ENTRA}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative mt-9 rounded-[var(--radius-card)] border-2 border-transparent px-5 pb-6 pt-6 shadow-[var(--shadow-2)]"
            style={{
              background:
                'linear-gradient(var(--olive-wash), var(--olive-wash)) padding-box, linear-gradient(135deg, var(--accent), var(--mustard)) border-box',
            }}
          >
            <span className="absolute -top-3 left-5 rounded-full bg-[var(--mustard)] px-3 py-1 text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
              Pago único
            </span>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1 text-sm font-semibold text-[var(--accent)] shadow-[var(--shadow-1)]">
              <BadgeCheck size={20} aria-hidden="true" />
              Avalada por una nutricionista
            </p>
            <p className="text-5xl font-bold leading-none text-[var(--text-primary)] [font-family:var(--font-display)]">
              <Precio valor={PRECIO} />
            </p>
            <p className="mt-3 text-base text-[var(--text-secondary)]">
              Una sola vez, sin renovaciones. Menos de <b className={fuerte}>$0.05 al día</b> si la usas un año.
            </p>
            <ul className="mt-5 space-y-3 border-t border-[color-mix(in_oklab,var(--accent)_25%,transparent)] pt-5">
              {BENEFICIOS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-base leading-snug text-[var(--text-primary)]">
                  <span
                    aria-hidden="true"
                    className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]"
                  >
                    <Check size={14} strokeWidth={3} color="var(--accent)" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.div
            variants={ENTRA}
            transition={{ duration: 0.45, ease: EASE }}
            className="mt-4 flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--peach-wash)] p-4 text-base text-[var(--text-secondary)]"
          >
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ scale: 0.4, rotate: -40, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 14 }}
                className="shrink-0"
              >
                <Sello tamano={96} giro={-8} fuente={13} texto="GARANTÍA CALMA · 7 DÍAS ·" />
              </motion.span>
              <p>
                <b className={fuerte}>Garantía Calma de 7 días:</b> si no te convence, lo pides desde tu compra en Hotmart y te devuelven todo.
              </p>
            </div>
            <p className="flex items-start gap-3">
              <Lock size={20} color="var(--peach-ink)" aria-hidden="true" className="mt-0.5 shrink-0" />
              Pago seguro con Hotmart. Tus datos de salud no se comparten.
            </p>
          </motion.div>

          <motion.section variants={ENTRA} transition={{ duration: 0.45, ease: EASE }} aria-label="Preguntas" className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Antes de decidir</h2>
            <div className="mt-2 divide-y divide-[var(--surface-2)] rounded-[var(--radius-card)] bg-[var(--surface)] px-4 shadow-[var(--shadow-1)]">
              {PREGUNTAS.map((p, i) => {
                const abierta = abierto === i;
                return (
                  <div key={p.q} className="py-1">
                    <button
                      type="button"
                      aria-expanded={abierta}
                      aria-controls={`resp-${i}`}
                      onClick={() => setAbierto(abierta ? null : i)}
                      className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-base font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
                    >
                      {p.q}
                      <ChevronDown
                        size={20}
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {abierta && (
                        <motion.div
                          id={`resp-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-3 text-base leading-relaxed text-[var(--text-secondary)]">{p.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.div variants={APARECE} className="mt-6 text-center">
            <a
              href="/onboarding"
              className="inline-flex h-11 items-center px-4 text-sm font-medium text-[var(--text-secondary)] underline underline-offset-4 [touch-action:manipulation]"
            >
              Ahora no, volver a mi menú de hoy
            </a>
            <a
              href="/login"
              className="mt-1 flex h-11 items-center justify-center px-4 text-sm font-medium text-[var(--text-secondary)] underline underline-offset-4 [touch-action:manipulation]"
            >
              ¿Ya compraste? Entra a tu cuenta
            </a>
          </motion.div>
        </motion.main>

        <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md bg-[var(--bg)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_16px_var(--bg)]">
          <AnimatePresence>
            {aviso && (
              <motion.p
                role="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-2 rounded-[var(--radius-button)] bg-[var(--mustard-soft)] px-3 py-2 text-center text-sm text-[var(--text-primary)]"
              >
                {aviso}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={desbloquear}
            aria-busy={cargando}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)] [touch-action:manipulation]"
          >
            {cargando && <Loader2 size={20} className="animate-spin" aria-hidden="true" />}
            {cargando ? 'Preparando tu pago…' : 'Desbloquear mi semana completa'}
          </motion.button>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            <span className="tabular-nums">$14.99</span> una sola vez · Garantía Calma de 7 días
          </p>
        </footer>
      </div>
    </MotionConfig>
  );
}
