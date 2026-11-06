'use client';

// Onboarding de Cocina en Calma (etapa 2 de la secuencia maestra) — v2 tras la primera revisión.
// Una decisión por pantalla · elección única = auto-avance a los 300ms (50 §A3) · acento SOLO en la acción y la
// palabra clave · el botón nunca nace apagado: si falta algo, avisa qué (los datos viven solo en memoria
// mientras dura el recorrido; el registro del consentimiento con servidor llega con la etapa de servicios).

import { registrarEvento } from '@/lib/eventos';
import { Logo } from '@/components/Logo';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import {
  Activity, ArrowLeft, ArrowRight, BatteryLow, Bike, CalendarDays, Check, CircleAlert, CircleCheck, CircleDot,
  Clock, Dumbbell, Footprints, Gauge, Heart, HeartPulse, Hourglass, Mars, Scale, ShieldCheck, ShoppingBasket, Smile,
  Sofa, Sunset, Target, Timer, TrendingDown, TrendingUp, User, Venus, Weight, Wind, Zap, type LucideIcon,
} from 'lucide-react';
import {
  calcularRequerimientos,
  generarMenu,
  INGREDIENTES_RAPIDOS,
  REPARTO,
  type Actividad,
  type Datos,
  type Objetivo,
  type Ritmo,
  type Sexo,
} from '@/lib/calculos';
import { COMIDAS, RECETAS, type Sintoma } from '@/lib/recetas';
import { FotoReceta } from './FotoReceta';

// Orden v3 (tras comparar con los mejores onboardings): primero la EMPATÍA (reconocerse en su día), luego el
// síntoma y su ritmo de cocina; recién después el permiso y los datos del cuerpo; al final el momento "ajá".
type Paso =
  | 'gancho'
  | 'sintomas'
  | 'tiempo'
  | 'consent'
  | 'filtro'
  | 'datos'
  | 'actividad'
  | 'objetivo'
  | 'cuerpo'
  | 'nombre'
  | 'ingredientes'
  | 'armando'
  | 'menu';
const PASOS: Paso[] = [
  'gancho',
  'sintomas',
  'tiempo',
  'consent',
  'filtro',
  'datos',
  'actividad',
  'objetivo',
  'cuerpo',
  'nombre',
  'ingredientes',
  'armando',
  'menu',
];
/** Pasos de elección única (sin botón, avanzan solos al elegir) y el de carga animada (avanza solo). */
const AUTO: Paso[] = ['tiempo', 'filtro', 'actividad', 'objetivo', 'armando'];

const TONOS = {
  peach: { fondo: 'var(--peach)', tinta: 'var(--peach-ink)' },
  mustard: { fondo: 'var(--mustard-soft)', tinta: 'var(--mustard-ink)' },
  sky: { fondo: 'var(--sky)', tinta: 'var(--sky-ink)' },
  olive: { fondo: 'var(--olive-wash)', tinta: 'var(--accent)' },
} as const;
type Tono = keyof typeof TONOS;
const ORDEN: Tono[] = ['peach', 'mustard', 'sky', 'olive'];

function ChipIcono({ icono: Icono, tono, tam = 40 }: { icono: LucideIcon; tono: Tono; tam?: 40 | 64 }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full ${tam === 64 ? 'size-16' : 'size-10'}`}
      style={{ background: TONOS[tono].fondo }}
    >
      <Icono size={tam === 64 ? 32 : 20} strokeWidth={1.9} color={TONOS[tono].tinta} />
    </span>
  );
}

export type Dolor = 'panza' | 'cansancio' | 'bascula';
/** Las situaciones salen literales de la FICHA-AVATAR (dolores #1, #4 y "harta de pesar y contar"). */
const DOLORES: { v: Dolor; t: string; icono: LucideIcon }[] = [
  { v: 'panza', t: 'Me levanto bien, pero al final del día parezco de 5 meses de embarazada', icono: Sunset },
  { v: 'cansancio', t: 'Llego cansada y me da fatiga pensar qué cocinar hoy', icono: BatteryLow },
  { v: 'bascula', t: 'Estoy harta de pesar la comida y contar calorías', icono: Scale },
];
/** Ícono grande de cada paso: da vida y orienta de un vistazo (solo decoración, no cambia el contenido). */
const ICONO_PASO: Partial<Record<Paso, [LucideIcon, Tono]>> = {
  gancho: [Heart, 'peach'],
  sintomas: [Activity, 'mustard'],
  tiempo: [Clock, 'sky'],
  consent: [ShieldCheck, 'olive'],
  filtro: [HeartPulse, 'peach'],
  datos: [User, 'sky'],
  actividad: [Footprints, 'mustard'],
  objetivo: [Target, 'peach'],
  cuerpo: [Gauge, 'olive'],
  nombre: [Smile, 'mustard'],
  ingredientes: [ShoppingBasket, 'olive'],
};
const ICONO_RITMO: Record<Ritmo, LucideIcon> = { prep: CalendarDays, diaria: Timer, express: Zap };
const ICONO_SINTOMA: Record<Sintoma, LucideIcon> = { Hinchazón: CircleDot, Gases: Wind, Pesadez: Weight, 'Digestión lenta': Hourglass };
const RITMOS: { v: Ritmo; t: string; nota: string }[] = [
  { v: 'prep', t: 'Cocino todo en una tarde a la semana', nota: 'Preparación de una tarde: recetas que se guardan bien' },
  { v: 'diaria', t: 'Tengo 20 a 30 minutos al día', nota: 'Recetas de cocina corta y diaria' },
  { v: 'express', t: 'Lo menos posible: casi sin cocinar', nota: 'Recetas express de 15 minutos o menos' },
];

const SINTOMAS: Sintoma[] = ['Hinchazón', 'Gases', 'Pesadez', 'Digestión lenta'];
const ACTIVIDADES: { v: Actividad; t: string; icono: LucideIcon }[] = [
  { v: 'sedentaria', t: 'Casi nada: mi día es sedentario', icono: Sofa },
  { v: 'ligera', t: 'Ligera: 1 a 3 días por semana', icono: Footprints },
  { v: 'moderada', t: 'Moderada: 3 a 5 días por semana', icono: Bike },
  { v: 'alta', t: 'Alta: 6 a 7 días por semana', icono: Dumbbell },
];
const OBJETIVOS: { v: Objetivo; t: string; icono: LucideIcon }[] = [
  { v: 'mantener', t: 'Mantener mi peso', icono: Scale },
  { v: 'bajar', t: 'Bajar de peso con calma', icono: TrendingDown },
  { v: 'subir', t: 'Subir de peso con calma', icono: TrendingUp },
];
const CONDICIONES = [
  'Estoy embarazada o en lactancia',
  'Tengo diabetes, enfermedad renal o hepática',
  'Tengo alergias alimentarias graves',
  'He tenido un trastorno de la conducta alimentaria',
];

const GRUPOS_INGREDIENTES: { titulo: string; items: string[] }[] = [
  { titulo: 'Proteínas', items: ['Pechuga de pollo', 'Huevos', 'Pescado blanco', 'Lenteja', 'Garbanzo', 'Yogur griego'] },
  { titulo: 'Cereales y tubérculos', items: ['Arroz integral', 'Avena', 'Papa', 'Camote'] },
  { titulo: 'Verduras y frutas', items: ['Zapallo', 'Zanahoria', 'Espinaca', 'Brócoli', 'Zucchini', 'Pepino', 'Aguacate', 'Banano'] },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const CLAVE = 'cec-onboarding-v1';

interface Guardado {
  idx: number;
  c: { terminos: boolean; salud: boolean; novedades: boolean; analitica: boolean };
  filtro: 'ok' | 'aplica' | null;
  sexo: Sexo;
  edad: string;
  peso: string;
  talla: string;
  actividad: Actividad | null;
  objetivo: Objetivo | null;
  sintomas: Sintoma[];
  ingredientes: string[];
  dolores: Dolor[];
  ritmo: Ritmo | null;
  nombre: string;
}

/** Progreso de esta visita (se borra al cerrar la pestaña; nunca sale del navegador). */
function leerGuardado(): Partial<Guardado> {
  try {
    return JSON.parse(window.sessionStorage.getItem(CLAVE) ?? '{}') as Partial<Guardado>;
  } catch {
    return {};
  }
}

function Resaltada({ children }: { children: ReactNode }) {
  return <span className="text-[var(--accent)]">{children}</span>;
}

function Titulo({ children }: { children: ReactNode }) {
  return <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">{children}</h1>;
}

function Casilla({
  marcada,
  onChange,
  children,
}: {
  marcada: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <input type="checkbox" checked={marcada} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-[var(--text-tertiary)] bg-[var(--bg)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]"
      >
        {marcada && <Check size={16} strokeWidth={3} color="var(--bg)" />}
      </span>
      <span className="text-sm leading-snug text-[var(--text-primary)]">{children}</span>
    </label>
  );
}

function Opcion({
  activa,
  onClick,
  children,
  icono,
  tono = 'peach',
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
  icono?: LucideIcon;
  tono?: Tono;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={activa}
      className={`flex min-h-14 w-full items-center gap-3 rounded-[var(--radius-button)] border px-4 py-3 text-left text-base font-semibold transition-colors duration-200 ${
        activa
          ? 'border-[var(--accent)] bg-[var(--chip-bg)] text-[var(--text-primary)]'
          : 'border-[var(--surface-2)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'
      }`}
    >
      {icono && <ChipIcono icono={icono} tono={activa ? 'olive' : tono} />}
      <span className="flex-1">{children}</span>
      {activa && <Check size={20} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />}
    </motion.button>
  );
}

function Campo({
  etiqueta,
  unidad,
  valor,
  onChange,
  error,
  min,
  max,
  ejemplo,
  alEnter,
  autoFocus,
}: {
  etiqueta: string;
  unidad: string;
  valor: string;
  onChange: (v: string) => void;
  error?: string;
  min: number;
  max: number;
  ejemplo: string;
  alEnter: () => void;
  autoFocus?: boolean;
}) {
  const id = `campo-${etiqueta}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-[var(--text-secondary)]">
        {etiqueta} ({unidad})
      </label>
      <input
        id={id}
        inputMode="decimal"
        type="number"
        min={min}
        max={max}
        value={valor}
        placeholder={ejemplo}
        autoFocus={autoFocus}
        onKeyDown={(e) => e.key === 'Enter' && alEnter()}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          error ? 'border-[var(--error)]' : 'border-[var(--surface-2)]'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Cuenta de 0 al valor (conteo animado del número héroe). Sin animación si hay reduced-motion. */
function Conteo({ hasta, sufijo = '' }: { hasta: number; sufijo?: string }) {
  const reducir = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducir) {
      el.textContent = `${hasta}${sufijo}`;
      return;
    }
    const ctl = animate(0, hasta, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${sufijo}`;
      },
    });
    return () => ctl.stop();
  }, [hasta, sufijo, reducir]);
  return <span ref={ref}>{`${hasta}${sufijo}`}</span>;
}

/** Momento "ajá": 3 frases reales (lo que la app de verdad hace con sus respuestas) y avanza solo; se puede saltar. */
function Armando({ frases, alTerminar, reducir }: { frases: string[]; alTerminar: () => void; reducir: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = [
      window.setTimeout(() => setN(1), 1200),
      window.setTimeout(() => setN(2), 2400),
      window.setTimeout(alTerminar, 3600),
    ];
    return () => t.forEach((x) => window.clearTimeout(x));
  }, [alTerminar]);
  return (
    <div className="flex flex-col items-center gap-6 pt-12 text-center" role="status" aria-live="polite">
      <div className="relative flex size-24 items-center justify-center">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-4 border-[var(--olive-wash)] border-t-[var(--accent)]"
          animate={{ rotate: reducir ? 0 : 360 }}
          transition={{ duration: 1.1, ease: 'linear', repeat: Infinity }}
        />
        <Logo alto={44} />
      </div>
      <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
        Armando tu <Resaltada>Menú Calma</Resaltada>
      </h1>
      <ul className="flex w-full flex-col gap-3 text-left">
        {frases.map((f, i) => (
          <motion.li
            key={f}
            initial={false}
            animate={{ opacity: i <= n ? 1 : 0.35 }}
            transition={{ duration: reducir ? 0 : 0.3 }}
            className="flex items-center gap-3 rounded-[var(--radius-button)] bg-[var(--surface)] p-3 text-base shadow-[var(--shadow-1)]"
          >
            <span
              aria-hidden="true"
              className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                i < n ? 'bg-[var(--accent)]' : 'bg-[var(--surface-2)]'
              }`}
            >
              {i < n && <Check size={14} strokeWidth={3} color="var(--bg)" />}
            </span>
            {f}
          </motion.li>
        ))}
      </ul>
      <button
        type="button"
        onClick={alTerminar}
        className="min-h-12 rounded-[var(--radius-button)] border border-[var(--accent)] px-5 text-base font-semibold text-[var(--accent)]"
      >
        Ver ya mi menú
      </button>
    </div>
  );
}

function porcionTexto(p: number): string {
  if (p < 1) return 'Porción chica';
  if (p >= 1.25) return 'Porción generosa';
  return 'Porción normal';
}

export function Flow({ fotos = [] }: { fotos?: string[] }) {
  // /onboarding?cuenta=1: la persona ya compró y entró con su correo; el recorrido solo arma su perfil y la lleva a la app.
  const [cuenta] = useState(() => new URLSearchParams(window.location.search).get('cuenta') === '1');
  const reducir = useReducedMotion();
  const [ini] = useState(leerGuardado);
  const [idx, setIdx] = useState(Math.min(ini.idx ?? 0, PASOS.length - 1));
  const [dir, setDir] = useState(1);
  const [bloqueo, setBloqueo] = useState(false);
  const [aviso, setAviso] = useState('');
  const paso = PASOS[idx];
  useEffect(() => {
    if (cuenta) return;
    registrarEvento('onboarding_paso_visto', { paso });
    if (paso === 'menu') registrarEvento('onboarding_completado');
  }, [paso, cuenta]);

  const [c, setC] = useState(ini.c ?? { terminos: false, salud: false, novedades: false, analitica: false });
  const [filtro, setFiltro] = useState<'ok' | 'aplica' | null>(ini.filtro ?? null);
  const [sexo, setSexo] = useState<Sexo>(ini.sexo ?? 'mujer');
  const [edad, setEdad] = useState(ini.edad ?? '');
  const [peso, setPeso] = useState(ini.peso ?? '');
  const [talla, setTalla] = useState(ini.talla ?? '');
  const [actividad, setActividad] = useState<Actividad | null>(ini.actividad ?? null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(ini.objetivo ?? null);
  const [intento, setIntento] = useState(false);
  const [sintomas, setSintomas] = useState<Sintoma[]>(ini.sintomas ?? []);
  const [ingredientes, setIngredientes] = useState<string[]>(ini.ingredientes ?? []);
  const [dolores, setDolores] = useState<Dolor[]>(ini.dolores ?? []);
  const [verMas, setVerMas] = useState(false);
  const [nombre, setNombre] = useState(ini.nombre ?? '');
  const [ritmo, setRitmo] = useState<Ritmo | null>(ini.ritmo ?? null);

  const errores = {
    edad: !(+edad >= 18 && +edad <= 99) ? 'Escribe una edad entre 18 y 99 años' : '',
    peso: !(+peso >= 30 && +peso <= 250) ? 'Escribe un peso entre 30 y 250 kg' : '',
    talla: !(+talla >= 120 && +talla <= 220) ? 'Escribe una talla entre 120 y 220 cm' : '',
  };
  const datosOk = !errores.edad && !errores.peso && !errores.talla;

  const req = useMemo(() => {
    if (!datosOk || !actividad || !objetivo) return null;
    const d: Datos = { sexo, edad: +edad, peso: +peso, talla: +talla, actividad, objetivo };
    return calcularRequerimientos(d);
  }, [datosOk, sexo, edad, peso, talla, actividad, objetivo]);
  const menu = useMemo(
    () => (req ? generarMenu(sintomas, ingredientes, req.kcal, fotos, ritmo) : null),
    [req, sintomas, ingredientes, fotos, ritmo],
  );

  useEffect(() => {
    try {
      const g: Guardado = { idx, c, filtro, sexo, edad, peso, talla, actividad, objetivo, sintomas, ingredientes, dolores, ritmo, nombre };
      window.sessionStorage.setItem(CLAVE, JSON.stringify(g));
    } catch {
      /* sin almacenamiento: el recorrido funciona igual, solo no recuerda al recargar */
    }
  }, [idx, c, filtro, sexo, edad, peso, talla, actividad, objetivo, sintomas, ingredientes, dolores, ritmo, nombre]);

  function ir(delta: number) {
    setDir(delta);
    setAviso('');
    setIdx((i) => {
      let n = Math.min(PASOS.length - 1, Math.max(0, i + delta));
      if (delta < 0 && PASOS[n] === 'armando') n -= 1; // la carga animada no se vuelve a ver al retroceder
      return n;
    });
  }

  /** Elección única: marca y avanza a los 300ms (el usuario VE su elección antes de que cambie la pantalla). */
  function elegirYAvanzar(poner: () => void) {
    if (bloqueo) return;
    poner();
    setBloqueo(true);
    window.setTimeout(
      () => {
        setBloqueo(false);
        ir(1);
      },
      reducir ? 0 : 300,
    );
  }

  /** Pasa de la carga animada al menú (se llama una sola vez, por tiempo o al saltar). */
  const irAlMenu = useCallback(() => {
    setDir(1);
    setIdx((i) => (PASOS[i] === 'armando' ? i + 1 : i));
  }, []);

  function siguiente() {
    if (paso === 'consent' && !(c.terminos && c.salud)) {
      setAviso('Marca las dos casillas obligatorias para continuar.');
      return;
    }
    if (paso === 'datos') {
      setIntento(true);
      if (!datosOk) {
        setAviso('Revisa los campos marcados en rojo.');
        return;
      }
    }
    if (paso === 'gancho' && dolores.length === 0) {
      setAviso('Elige al menos una para continuar.');
      return;
    }
    if (paso === 'sintomas' && sintomas.length === 0) {
      setAviso('Elige al menos una opción para ajustar tu menú.');
      return;
    }
    if (paso === 'ingredientes' && ingredientes.length < 3) {
      setAviso(`Marca ${3 - ingredientes.length} más para armar tu menú.`);
      return;
    }
    ir(1);
  }

  const progreso = 6 + (idx / (PASOS.length - 1)) * 94;
  const variantes = {
    entra: (d: number) => ({ opacity: 0, x: reducir ? 0 : d * 40 }),
    centro: { opacity: 1, x: 0 },
    sale: (d: number) => ({ opacity: 0, x: reducir ? 0 : d * -24 }),
  };
  const toggle = <T,>(lista: T[], v: T): T[] => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v]);
  const sinBoton = AUTO.includes(paso);
  // El aviso de los datos desaparece solo cuando ya están bien escritos.
  const avisoVisible = paso === 'datos' && datosOk ? '' : aviso;

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          background:
            'radial-gradient(360px 260px at 0% 0%, var(--peach) 0%, transparent 70%), radial-gradient(320px 240px at 100% 6%, var(--mustard-soft) 0%, transparent 68%)',
        }}
      />
      <header className="relative z-10 flex items-center gap-3 px-5 pb-2 pt-4">
        <button
          type="button"
          onClick={() => ir(-1)}
          disabled={idx === 0 || paso === 'armando'}
          aria-label="Volver al paso anterior"
          className="flex size-11 items-center justify-center rounded-full text-[var(--text-secondary)] disabled:opacity-0"
        >
          <ArrowLeft size={24} aria-hidden="true" />
        </button>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progreso)}
          aria-label="Avance del recorrido"
          className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]"
        >
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--mustard))]"
            initial={false}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: reducir ? 0 : 0.3, ease: EASE }}
          />
        </div>
        <span className="w-10 text-right text-xs tabular-nums text-[var(--text-secondary)]">{Math.round(progreso)}%</span>
      </header>

      <main className="relative z-10 flex-1 overflow-x-hidden px-5 pb-48 pt-4">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.section
            key={paso}
            custom={dir}
            variants={variantes}
            initial="entra"
            animate="centro"
            exit="sale"
            transition={{ duration: reducir ? 0.2 : 0.3, ease: EASE }}
          >
            {ICONO_PASO[paso] && (
              <motion.div
                initial={{ scale: reducir ? 1 : 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.05 }}
                className="mb-4 w-fit"
              >
                <ChipIcono icono={ICONO_PASO[paso]![0]} tono={ICONO_PASO[paso]![1]} tam={64} />
              </motion.div>
            )}

            {paso === 'gancho' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cuál se parece más a tus <Resaltada>días</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Elige las que quieras. Aquí no hay culpa: solo comida rica que te cuida.
                </p>
                <div className="flex flex-col gap-3">
                  {DOLORES.map((d) => {
                    const activa = dolores.includes(d.v);
                    const Icono = d.icono;
                    return (
                      <motion.button
                        key={d.v}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        aria-pressed={activa}
                        onClick={() => {
                          setAviso('');
                          setDolores(toggle(dolores, d.v));
                        }}
                        className={`flex min-h-16 w-full items-center gap-3 rounded-[var(--radius-card)] border p-4 text-left text-base font-semibold leading-snug transition-colors duration-200 ${
                          activa
                            ? 'border-[var(--accent)] bg-[var(--chip-bg)]'
                            : 'border-[var(--surface-2)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--peach)]"
                        >
                          <Icono size={24} strokeWidth={1.8} color="var(--peach-ink)" />
                        </span>
                        <span className="flex-1">{d.t}</span>
                        {activa && <Check size={20} strokeWidth={2.5} color="var(--accent)" aria-hidden="true" />}
                      </motion.button>
                    );
                  })}
                </div>
                {dolores.length > 0 ? (
                  <p role="status" className="rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4 text-base leading-snug">
                    <b>Te entendemos.</b> Para eso armamos tu Menú Calma: comida suave, sin pesar y sin contar.
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">Tus respuestas se quedan solo en tu celular.</p>
                )}
              </div>
            )}

            {paso === 'tiempo' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cuánto tiempo tienes para <Resaltada>cocinar</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Tu menú se arma a tu ritmo. Cero culpa: elige lo que de verdad puedes.
                </p>
                <div className="flex flex-col gap-3">
                  {RITMOS.map((r, n) => (
                    <Opcion key={r.v} icono={ICONO_RITMO[r.v]} tono={ORDEN[n % 4]} activa={ritmo === r.v} onClick={() => elegirYAvanzar(() => setRitmo(r.v))}>
                      <span className="block">{r.t}</span>
                      <span className="mt-1 block text-sm font-normal text-[var(--text-secondary)]">{r.nota}</span>
                    </Opcion>
                  ))}
                </div>
                <p className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug">
                  <b>Tu ritmo cambia tu menú.</b> Si tienes poco tiempo, te sugerimos recetas cortas; si cocinas una tarde a la semana, las que se guardan bien en el refrigerador o el congelador.
                </p>
              </div>
            )}

            {paso === 'armando' && (
              <Armando
                reducir={Boolean(reducir)}
                alTerminar={irAlMenu}
                frases={[
                  `Cruzando lo que sientes (${sintomas.join(' y ').toLowerCase() || 'tu síntoma'}) con tus ingredientes…`,
                  'Calculando lo que necesita tu cuerpo…',
                  `Armando tu menú de hoy a tu ritmo${ritmo === 'prep' ? ' de una tarde' : ''}…`,
                ]}
              />
            )}

            {paso === 'consent' && (
              <div className="flex flex-col gap-4">
                <Titulo>
                  Cuidamos tu salud y <Resaltada>tus datos</Resaltada>
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Para calcular lo que necesita tu cuerpo te pedimos datos de salud. Por eso te pedimos tu permiso.
                </p>
                <div className="mt-2 flex flex-col gap-3">
                  <Casilla marcada={c.terminos} onChange={(v) => setC({ ...c, terminos: v })}>
                    <b>Obligatoria.</b> Acepto los{' '}
                    <a href="/terminos" target="_blank" rel="noopener" className="font-semibold underline underline-offset-4">
                      términos
                    </a>
                    , el{' '}
                    <a href="/aviso-salud" target="_blank" rel="noopener" className="font-semibold underline underline-offset-4">
                      aviso de salud
                    </a>{' '}
                    y la{' '}
                    <a href="/privacidad" target="_blank" rel="noopener" className="font-semibold underline underline-offset-4">
                      política de privacidad
                    </a>
                    . Tengo 18 años o más.
                  </Casilla>
                  <Casilla marcada={c.salud} onChange={(v) => setC({ ...c, salud: v })}>
                    <b>Obligatoria.</b> Autorizo el uso de mis datos de salud para armar mis menús. Puedo retirarlo cuando quiera.
                  </Casilla>
                  <details className="px-1 text-sm text-[var(--text-secondary)]">
                    <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--accent)]">
                      Qué datos son y dónde se guardan
                    </summary>
                    <p className="pb-2 leading-snug">
                      Sexo, edad, peso, talla, actividad física y síntomas digestivos. Son datos sensibles y se guardan en
                      servidores de proveedores en el extranjero. Los usamos solo para armar tus menús y no los vendemos.
                    </p>
                  </details>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Opcionales</p>
                  <Casilla marcada={c.novedades} onChange={(v) => setC({ ...c, novedades: v })}>
                    Quiero novedades y recetas por correo.
                  </Casilla>
                  <Casilla marcada={c.analitica} onChange={(v) => setC({ ...c, analitica: v })}>
                    Ayudar a mejorar la app (medir mi uso).
                  </Casilla>
                </div>
              </div>
            )}

            {paso === 'filtro' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  Una pregunta antes de <Resaltada>seguir</Resaltada>
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Cocina en Calma es orientación nutricional general. ¿Alguna de estas situaciones te aplica?
                </p>
                <ul className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-base">
                  {CONDICIONES.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--accent)]">
                        •
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3">
                  <Opcion icono={CircleCheck} tono="olive" activa={filtro === 'ok'} onClick={() => elegirYAvanzar(() => setFiltro('ok'))}>
                    Ninguna me aplica
                  </Opcion>
                  <Opcion icono={CircleAlert} tono="mustard" activa={filtro === 'aplica'} onClick={() => setFiltro('aplica')}>
                    Alguna me aplica
                  </Opcion>
                </div>
                {filtro === 'aplica' && (
                  <div
                    role="status"
                    className="rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-4 text-base leading-snug"
                  >
                    <b>Gracias por contarlo.</b> Para cuidarte, lo mejor es que tu profesional de salud te indique cómo
                    alimentarte. Puedes volver cuando él o ella lo apruebe.
                    <Link href="/" className="mt-3 block font-semibold text-[var(--accent)] underline underline-offset-4">
                      Volver al inicio
                    </Link>
                  </div>
                )}
              </div>
            )}

            {paso === 'datos' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¡Hola! Empecemos por <Resaltada>ti</Resaltada>
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Con esto calculamos cuánto necesita tu cuerpo y armamos tu menú de hoy en un par de minutos.
                </p>
                <fieldset>
                  <legend className="mb-2 text-sm text-[var(--text-secondary)]">Sexo (lo pide la fórmula)</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <Opcion icono={Venus} tono="peach" activa={sexo === 'mujer'} onClick={() => setSexo('mujer')}>
                      Mujer
                    </Opcion>
                    <Opcion icono={Mars} tono="sky" activa={sexo === 'hombre'} onClick={() => setSexo('hombre')}>
                      Hombre
                    </Opcion>
                  </div>
                </fieldset>
                <Campo ejemplo="Ej. 34" alEnter={siguiente} autoFocus etiqueta="Edad" unidad="años" valor={edad} onChange={setEdad} min={18} max={99} error={intento ? errores.edad : ''} />
                <Campo ejemplo="Ej. 62" alEnter={siguiente} etiqueta="Peso" unidad="kg" valor={peso} onChange={setPeso} min={30} max={250} error={intento ? errores.peso : ''} />
                <Campo ejemplo="Ej. 160" alEnter={siguiente} etiqueta="Talla" unidad="cm" valor={talla} onChange={setTalla} min={120} max={220} error={intento ? errores.talla : ''} />
              </div>
            )}

            {paso === 'actividad' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cuánto te <Resaltada>mueves</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">Ejercicio o caminatas, en una semana normal.</p>
                <div className="flex flex-col gap-3">
                  {ACTIVIDADES.map((a, n) => (
                    <Opcion key={a.v} icono={a.icono} tono={ORDEN[n % 4]} activa={actividad === a.v} onClick={() => elegirYAvanzar(() => setActividad(a.v))}>
                      {a.t}
                    </Opcion>
                  ))}
                </div>
                <p className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug"><b>¿Por qué lo preguntamos?</b> Cuenta caminatas, bicicleta, gimnasio o baile. Con esto calculamos cuánta energía gasta tu cuerpo en un día.</p>
              </div>
            )}

            {paso === 'objetivo' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Qué buscas con tu <Resaltada>peso</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Cualquier cambio es gradual y suave: nada de dietas extremas.
                </p>
                <div className="flex flex-col gap-3">
                  {OBJETIVOS.map((o, n) => (
                    <Opcion key={o.v} icono={o.icono} tono={ORDEN[(n + 1) % 4]} activa={objetivo === o.v} onClick={() => elegirYAvanzar(() => setObjetivo(o.v))}>
                      {o.t}
                    </Opcion>
                  ))}
                </div>
                <p className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug"><b>Siempre con calma.</b> Si buscas cambiar de peso, lo hacemos de forma gradual (hasta un 10%) y nunca por debajo de un mínimo seguro.</p>
              </div>
            )}

            {paso === 'cuerpo' && req && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  Ya sabemos lo que necesita tu <Resaltada>cuerpo</Resaltada>
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  La app hace las cuentas. Tú solo eliges qué comer y vas viendo cuánto de tu día cubres.
                </p>
                <div className="rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Así se reparte tu día</p>
                  <ul className="mt-4 flex flex-col gap-4">
                    {COMIDAS.map((comida, n) => (
                      <li key={comida}>
                        <div className="flex items-baseline justify-between text-base">
                          <span className="font-semibold">{comida}</span>
                          <span className="tabular-nums text-[var(--text-secondary)]">
                            {Math.round(REPARTO[comida] * 100)}% de tu día
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                          <motion.div
                            className="h-full rounded-full bg-[var(--accent)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(REPARTO[comida] * 100)}%` }}
                            transition={{ duration: reducir ? 0 : 0.7, delay: reducir ? 0 : 0.08 * n, ease: EASE }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <details className="mt-4">
                    <summary className="min-h-11 cursor-pointer py-2 text-base font-semibold text-[var(--accent)]">
                      Ver mis números
                    </summary>
                    <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
                      {[
                        ['Energía', `${req.kcal.toLocaleString('es')} kcal`],
                        ['Proteína', `${req.proteina} g`],
                        ['Carbohidratos', `${req.carbohidratos} g`],
                        ['Grasas', `${req.grasas} g`],
                        ['Fibra', `${req.fibra} g`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[var(--text-secondary)]">{k}</dt>
                          <dd className="text-lg font-bold [font-family:var(--font-display)]">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 text-sm text-[var(--text-secondary)]">
                      Calculado con la fórmula de Mifflin-St Jeor. Es aproximado y orientativo: no reemplaza una consulta con tu profesional de la nutrición.
                    </p>
                  </details>
                </div>
              </div>
            )}

            {paso === 'sintomas' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cómo te sientes <Resaltada>hoy</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Cuéntanos sin pena. Elige todo lo que aplique: aquí no hay juicios, solo comida rica que te cuida.
                </p>
                <div className="flex flex-col gap-3">
                  {SINTOMAS.map((s, n) => (
                    <Opcion
                      key={s}
                      icono={ICONO_SINTOMA[s]}
                      tono={ORDEN[n % 4]}
                      activa={sintomas.includes(s)}
                      onClick={() => {
                        setAviso('');
                        setSintomas(toggle(sintomas, s));
                      }}
                    >
                      {s}
                    </Opcion>
                  ))}
                </div>
                <p className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug"><b>Puedes elegir varios.</b> Cada síntoma cambia las recetas que te sugerimos: elegimos comidas suaves y fáciles de digerir.</p>
              </div>
            )}

            {paso === 'nombre' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cómo te <Resaltada>llamas</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Para que tu Menú Calma sea tuyo de verdad. Es opcional.
                </p>
                <div>
                  <label htmlFor="campo-nombre" className="mb-2 block text-sm text-[var(--text-secondary)]">
                    Tu nombre
                  </label>
                  <input
                    id="campo-nombre"
                    type="text"
                    autoComplete="given-name"
                    maxLength={24}
                    value={nombre}
                    placeholder="Ej. Laura"
                    onChange={(e) => setNombre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && ir(1)}
                    className="h-14 w-full rounded-[var(--radius-button)] border border-[var(--surface-2)] bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                </div>
                <p className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug">
                  <b>Se queda en tu celular.</b> Solo lo usamos para escribir tu nombre en tu menú y en tu plan.
                </p>
              </div>
            )}

            {paso === 'ingredientes' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¡Casi listo! Marca <Resaltada>3</Resaltada> que tengas en casa
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">
                  Con eso armamos tu primer menú en segundos. Después puedes sumar más.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAviso('');
                    setIngredientes(
                      Array.from(new Set([...ingredientes, 'Pechuga de pollo', 'Zapallo', 'Avena'])).slice(
                        0,
                        Math.max(3, ingredientes.length),
                      ),
                    );
                  }}
                  className="min-h-12 self-start rounded-[var(--radius-button)] border border-[var(--accent)] px-5 text-base font-semibold text-[var(--accent)]"
                >
                  Elige por mí
                </button>
                <div className="flex flex-col gap-5">
                  {GRUPOS_INGREDIENTES.map((g, gi) => (
                    <div key={g.titulo}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{g.titulo}</p>
                      <div className="flex flex-wrap gap-3">
                        {INGREDIENTES_RAPIDOS.filter((i) => g.items.includes(i.etiqueta))
                          .filter((i, n) => verMas || n < 4 || ingredientes.includes(i.etiqueta))
                          .map((i) => {
                          const activo = ingredientes.includes(i.etiqueta);
                          return (
                      <motion.button
                        key={i.etiqueta}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        aria-pressed={activo}
                        onClick={() => {
                          setAviso('');
                          setIngredientes(toggle(ingredientes, i.etiqueta));
                        }}
                        className={`min-h-11 rounded-full border px-4 text-base transition-colors duration-200 ${
                          activo
                            ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[var(--bg)]'
                            : 'border-transparent shadow-[var(--shadow-1)]'
                        }`}
                        style={activo ? undefined : { background: TONOS[(['peach', 'mustard', 'olive'] as const)[gi % 3]].fondo }}
                      >
                        {i.etiqueta}
                      </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setVerMas(!verMas)}
                  aria-expanded={verMas}
                  className="min-h-11 self-start text-base font-semibold text-[var(--accent)] underline underline-offset-4"
                >
                  {verMas ? 'Ver menos ingredientes' : 'Ver más ingredientes'}
                </button>
                <p className="text-sm tabular-nums text-[var(--text-secondary)]" aria-live="polite">
                  {ingredientes.length >= 3
                    ? `${ingredientes.length} marcados: listo para armar tu menú`
                    : `${ingredientes.length} de 3 marcados`}
                </p>
              </div>
            )}

            {paso === 'menu' && menu && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                    <motion.span
                      initial={{ scale: reducir ? 1 : 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                      className="flex size-6 items-center justify-center rounded-full bg-[var(--accent)]"
                    >
                      <Check size={14} strokeWidth={3} color="var(--bg)" aria-hidden="true" />
                    </motion.span>
                    Listo en menos de 5 minutos
                  </p>
                  <h1 className="mt-2 text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                    Tu menú de hoy para <Resaltada>{sintomas.join(' y ').toLowerCase()}</Resaltada>
                  </h1>
                  {ritmo && (
                    <p className="mt-2 text-base text-[var(--text-secondary)]">
                      {nombre.trim() ? `${nombre.trim()}, ` : ''}{RITMOS.find((x) => x.v === ritmo)?.nota}.
                    </p>
                  )}
                </div>
                <div className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4">
                  <p className="text-sm font-semibold">
                    <Conteo hasta={menu.items.length} /> de 4 comidas armadas, con la porción ajustada a ti
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: reducir ? 0 : 0.9, ease: EASE }}
                    />
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {menu.items.map((it, n) => (
                    <motion.li
                      key={it.receta.id}
                      initial={{ opacity: 0, y: reducir ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reducir ? 0 : 0.06 * n, duration: 0.3, ease: EASE }}
                      className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-[var(--shadow-1)]"
                    >
                      <FotoReceta receta={it.receta} className="h-28" conFoto={fotos.includes(it.receta.id)} />
                      <div className="flex flex-1 flex-col p-3">
                        <h2 className="min-h-11 text-base font-bold leading-snug">{it.receta.nombre}</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {it.receta.min} min · {porcionTexto(it.porcion)}
                        </p>
                        <p className="mt-auto flex flex-wrap gap-1 pt-2">
                          {it.receta.min <= 15 && (
                            <span className="rounded-full bg-[var(--mustard-soft)] px-2 py-1 text-xs font-semibold text-[var(--mustard-ink)]">
                              Express
                            </span>
                          )}
                          {it.receta.congelable_dias ? (
                            <span className="rounded-full bg-[var(--sky)] px-2 py-1 text-xs font-semibold text-[var(--sky-ink)]">
                              Congelable
                            </span>
                          ) : null}
                          {it.receta.sintomas.slice(0, 1).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-[var(--chip-bg)] px-2 py-1 text-xs font-semibold text-[var(--accent)]"
                            >
                              {s}
                            </span>
                          ))}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                {!cuenta && (
                <div className="rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-4 text-sm leading-snug">
                  <b>Este es tu menú de hoy, gratis.</b> Con tu plan completo armas toda la semana con {RECETAS.length} recetas, ves tus compras y cocinas todo en una tarde. <b>Pago único de $14.99</b> y 7 días de garantía.
                </div>
                )}
                <p className="text-sm text-[var(--text-secondary)]">
                  Orientación nutricional general. No reemplaza a tu médico o nutricionista.
                </p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
        {AUTO.includes(paso) && paso !== 'armando' && (
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">Toca una opción y seguimos.</p>
        )}
      </main>

      {!sinBoton && (
        <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md bg-[var(--bg)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_16px_var(--bg)]">
          <p role="alert" aria-live="polite" className="mb-2 min-h-5 text-center text-sm text-[var(--error)]">
            {avisoVisible}
          </p>
          {paso === 'menu' ? (
            <motion.a
              whileTap={{ scale: 0.97 }}
              href={cuenta ? '/app' : '/paywall'}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
            >
              {cuenta ? 'Entrar a mi app' : 'Ver mi semana completa'}
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </motion.a>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={siguiente}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
            >
              {(paso === 'consent' || paso === 'gancho') && 'Continuar'}
              {paso === 'nombre' && (nombre.trim() ? 'Continuar' : 'Seguir sin nombre')}
              {paso === 'datos' && 'Siguiente'}
              {paso === 'cuerpo' && 'Siguiente'}
              {paso === 'sintomas' && 'Siguiente'}
              {paso === 'ingredientes' && 'Ver mi primer menú'}
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </motion.button>
          )}
        </footer>
      )}
    </div>
  );
}
