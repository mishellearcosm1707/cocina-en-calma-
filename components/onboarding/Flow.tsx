'use client';

// Onboarding de Cocina en Calma (etapa 2 de la secuencia maestra) — v2 tras la primera revisión.
// Una decisión por pantalla · elección única = auto-avance a los 300ms (50 §A3) · acento SOLO en la acción y la
// palabra clave · el botón nunca nace apagado: si falta algo, avisa qué (los datos viven solo en memoria
// mientras dura el recorrido; el registro del consentimiento con servidor llega con la etapa de servicios).

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import {
  calcularRequerimientos,
  generarMenu,
  INGREDIENTES_RAPIDOS,
  REPARTO,
  type Actividad,
  type Datos,
  type Objetivo,
  type Sexo,
} from '@/lib/calculos';
import { COMIDAS, type Sintoma } from '@/lib/recetas';
import { FotoReceta } from './FotoReceta';

type Paso = 'consent' | 'filtro' | 'datos' | 'actividad' | 'objetivo' | 'cuerpo' | 'sintomas' | 'ingredientes' | 'menu';
const PASOS: Paso[] = ['consent', 'filtro', 'datos', 'actividad', 'objetivo', 'cuerpo', 'sintomas', 'ingredientes', 'menu'];
/** Pasos de elección única: sin botón, avanzan solos al elegir. */
const AUTO: Paso[] = ['filtro', 'actividad', 'objetivo'];

const SINTOMAS: Sintoma[] = ['Hinchazón', 'Gases', 'Pesadez', 'Digestión lenta'];
const ACTIVIDADES: { v: Actividad; t: string }[] = [
  { v: 'sedentaria', t: 'Casi nada: paso el día sentada' },
  { v: 'ligera', t: 'Ligera: 1 a 3 días por semana' },
  { v: 'moderada', t: 'Moderada: 3 a 5 días por semana' },
  { v: 'alta', t: 'Alta: 6 a 7 días por semana' },
];
const OBJETIVOS: { v: Objetivo; t: string }[] = [
  { v: 'mantener', t: 'Mantener mi peso' },
  { v: 'bajar', t: 'Bajar de peso con calma' },
  { v: 'subir', t: 'Subir de peso con calma' },
];
const CONDICIONES = [
  'Estoy embarazada o en lactancia',
  'Tengo diabetes, enfermedad renal o hepática',
  'Tengo alergias alimentarias graves',
  'He tenido un trastorno de la conducta alimentaria',
];

const EASE = [0.16, 1, 0.3, 1] as const;

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

function Opcion({ activa, onClick, children }: { activa: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={activa}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-[var(--radius-button)] border px-4 py-3 text-left text-base font-semibold transition-colors duration-200 ${
        activa
          ? 'border-[var(--accent)] bg-[var(--chip-bg)] text-[var(--text-primary)]'
          : 'border-[var(--surface-2)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-1)]'
      }`}
    >
      <span>{children}</span>
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
}: {
  etiqueta: string;
  unidad: string;
  valor: string;
  onChange: (v: string) => void;
  error?: string;
  min: number;
  max: number;
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

function porcionTexto(p: number): string {
  if (p < 1) return 'Porción chica';
  if (p >= 1.25) return 'Porción generosa';
  return 'Porción normal';
}

export function Flow({ fotos = [] }: { fotos?: string[] }) {
  const reducir = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [bloqueo, setBloqueo] = useState(false);
  const [aviso, setAviso] = useState('');
  const paso = PASOS[idx];

  const [c, setC] = useState({ terminos: false, salud: false, novedades: false, analitica: false });
  const [filtro, setFiltro] = useState<'ok' | 'aplica' | null>(null);
  const [sexo, setSexo] = useState<Sexo>('mujer');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [intento, setIntento] = useState(false);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);
  const [ingredientes, setIngredientes] = useState<string[]>([]);

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
    () => (req ? generarMenu(sintomas, ingredientes, req.kcal) : null),
    [req, sintomas, ingredientes],
  );

  function ir(delta: number) {
    setDir(delta);
    setAviso('');
    setIdx((i) => Math.min(PASOS.length - 1, Math.max(0, i + delta)));
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
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button
          type="button"
          onClick={() => ir(-1)}
          disabled={idx === 0}
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
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: reducir ? 0 : 0.3, ease: EASE }}
          />
        </div>
        <span className="w-10 text-right text-xs tabular-nums text-[var(--text-secondary)]">{Math.round(progreso)}%</span>
      </header>

      <main className="flex-1 overflow-x-hidden px-5 pb-48 pt-4">
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
                    <b>Obligatoria.</b> Acepto el{' '}
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
                    <b>Obligatoria.</b> Autorizo que usen mis datos de salud (sexo, edad, peso, talla, actividad y
                    síntomas) para calcular mis requerimientos y sugerirme menús. Son datos sensibles, se guardan en
                    servidores en el extranjero y puedo retirar mi permiso cuando quiera.
                  </Casilla>
                  <Casilla marcada={c.novedades} onChange={(v) => setC({ ...c, novedades: v })}>
                    Quiero recibir novedades y recetas por correo.
                  </Casilla>
                  <Casilla marcada={c.analitica} onChange={(v) => setC({ ...c, analitica: v })}>
                    Acepto que midan cómo uso la app para mejorarla.
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
                  <Opcion activa={filtro === 'ok'} onClick={() => elegirYAvanzar(() => setFiltro('ok'))}>
                    Ninguna me aplica
                  </Opcion>
                  <Opcion activa={filtro === 'aplica'} onClick={() => setFiltro('aplica')}>
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
                  Con estos datos calculamos cuánto necesita tu cuerpo. Es rápido.
                </p>
                <fieldset>
                  <legend className="mb-2 text-sm text-[var(--text-secondary)]">Sexo (lo pide la fórmula)</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <Opcion activa={sexo === 'mujer'} onClick={() => setSexo('mujer')}>
                      Mujer
                    </Opcion>
                    <Opcion activa={sexo === 'hombre'} onClick={() => setSexo('hombre')}>
                      Hombre
                    </Opcion>
                  </div>
                </fieldset>
                <Campo etiqueta="Edad" unidad="años" valor={edad} onChange={setEdad} min={18} max={99} error={intento ? errores.edad : ''} />
                <Campo etiqueta="Peso" unidad="kg" valor={peso} onChange={setPeso} min={30} max={250} error={intento ? errores.peso : ''} />
                <Campo etiqueta="Talla" unidad="cm" valor={talla} onChange={setTalla} min={120} max={220} error={intento ? errores.talla : ''} />
              </div>
            )}

            {paso === 'actividad' && (
              <div className="flex flex-col gap-5">
                <Titulo>
                  ¿Cuánto te <Resaltada>mueves</Resaltada>?
                </Titulo>
                <p className="text-base text-[var(--text-secondary)]">Ejercicio o caminatas, en una semana normal.</p>
                <div className="flex flex-col gap-3">
                  {ACTIVIDADES.map((a) => (
                    <Opcion key={a.v} activa={actividad === a.v} onClick={() => elegirYAvanzar(() => setActividad(a.v))}>
                      {a.t}
                    </Opcion>
                  ))}
                </div>
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
                  {OBJETIVOS.map((o) => (
                    <Opcion key={o.v} activa={objetivo === o.v} onClick={() => elegirYAvanzar(() => setObjetivo(o.v))}>
                      {o.t}
                    </Opcion>
                  ))}
                </div>
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
                            animate={{ width: `${Math.min(100, REPARTO[comida] * 300)}%` }}
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
                      Cálculo aproximado y orientativo: no reemplaza una consulta con tu profesional de la nutrición.
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
                  {SINTOMAS.map((s) => (
                    <Opcion
                      key={s}
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
                <div className="flex flex-wrap gap-3">
                  {INGREDIENTES_RAPIDOS.map((i) => {
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
                            : 'border-[var(--surface-2)] bg-[var(--surface)] shadow-[var(--shadow-1)]'
                        }`}
                      >
                        {i.etiqueta}
                      </motion.button>
                    );
                  })}
                </div>
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                    Listo en menos de 5 minutos
                  </p>
                  <h1 className="mt-2 text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                    Tu menú de hoy para <Resaltada>{sintomas.join(' y ').toLowerCase()}</Resaltada>
                  </h1>
                </div>
                <div className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4">
                  <p className="text-sm font-semibold">
                    Este menú cubre <Conteo hasta={Math.min(100, Math.round(menu.cobertura * 100))} sufijo="%" /> de lo
                    que necesitas hoy
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round(menu.cobertura * 100))}%` }}
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
                      className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-[var(--shadow-1)]"
                    >
                      <FotoReceta receta={it.receta} className="h-28" conFoto={fotos.includes(it.receta.id)} />
                      <div className="p-3">
                        <h2 className="text-base font-bold leading-snug">{it.receta.nombre}</h2>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {it.receta.min} min · {porcionTexto(it.porcion)}
                        </p>
                        <p className="mt-2 flex flex-wrap gap-1">
                          {it.receta.sintomas.slice(0, 2).map((s) => (
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
                <div className="rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-4 text-sm leading-snug">
                  <b>Este es tu menú de muestra gratis.</b> Con tu plan completo armas toda la semana, filtras por lo que
                  tienes, ves tus compras y cocinas todo en una tarde.
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Orientación nutricional general. No reemplaza a tu médico o nutricionista.
                </p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      {!sinBoton && (
        <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md bg-[var(--bg)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_16px_var(--bg)]">
          <p role="alert" aria-live="polite" className="mb-2 min-h-5 text-center text-sm text-[var(--error)]">
            {avisoVisible}
          </p>
          {paso === 'menu' ? (
            <motion.a
              whileTap={{ scale: 0.97 }}
              href="/paywall"
              className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)]"
            >
              Armar mi semana completa
            </motion.a>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={siguiente}
              className="h-14 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)]"
            >
              {paso === 'consent' && 'Continuar'}
              {paso === 'datos' && 'Siguiente'}
              {paso === 'cuerpo' && 'Siguiente'}
              {paso === 'sintomas' && 'Siguiente'}
              {paso === 'ingredientes' && 'Ver mi primer menú'}
            </motion.button>
          )}
        </footer>
      )}
    </div>
  );
}
