'use client';

// Onboarding de Cocina en Calma (etapa 2 de la secuencia maestra).
// Spec: pantalla = una misión por paso · objeto principal = la pregunta/resultado · acento SOLO en la acción
// y la palabra clave · estados: vacío (CTA deshabilitado), error de campo, éxito (menú), offline no aplica
// (todo se calcula en el dispositivo). Los datos de salud NO se guardan: viven solo en memoria mientras dura
// el recorrido (el registro de consentimiento con servidor llega con la etapa de servicios).

import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import {
  calcularRequerimientos,
  generarMenu,
  INGREDIENTES_RAPIDOS,
  type Actividad,
  type Datos,
  type Objetivo,
  type Sexo,
} from '@/lib/calculos';
import type { Sintoma } from '@/lib/recetas';
import { FotoReceta } from './FotoReceta';

type Paso = 'consent' | 'datos' | 'cuerpo' | 'sintomas' | 'ingredientes' | 'menu';
const PASOS: Paso[] = ['consent', 'datos', 'cuerpo', 'sintomas', 'ingredientes', 'menu'];

const SINTOMAS: Sintoma[] = ['Hinchazón', 'Gases', 'Pesadez', 'Digestión lenta'];
const ACTIVIDADES: { v: Actividad; t: string }[] = [
  { v: 'sedentaria', t: 'Casi nada (sentada la mayor parte del día)' },
  { v: 'ligera', t: 'Ligera (1–3 días por semana)' },
  { v: 'moderada', t: 'Moderada (3–5 días por semana)' },
  { v: 'alta', t: 'Alta (6–7 días por semana)' },
];
const OBJETIVOS: { v: Objetivo; t: string }[] = [
  { v: 'mantener', t: 'Mantener mi peso' },
  { v: 'bajar', t: 'Bajar de peso con calma' },
  { v: 'subir', t: 'Subir de peso con calma' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Resaltada({ children }: { children: ReactNode }) {
  return <span className="text-[var(--accent)]">{children}</span>;
}

function Casilla({
  marcada,
  onChange,
  children,
  obligatoria,
}: {
  marcada: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  obligatoria?: boolean;
}) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <input
        type="checkbox"
        checked={marcada}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-[var(--text-tertiary)] bg-[var(--bg)] peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent)]"
      >
        {marcada && <Check size={16} strokeWidth={3} color="var(--bg)" />}
      </span>
      <span className="text-sm leading-snug text-[var(--text-primary)]">
        {children}
        {obligatoria && <span className="ml-1 text-xs text-[var(--text-secondary)]">(obligatoria)</span>}
      </span>
    </label>
  );
}

function Opcion({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={activa}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-[var(--radius-button)] border px-4 text-left text-base font-semibold transition-colors duration-200 ${
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
        className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-base text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          error ? 'border-[var(--accent-2)]' : 'border-[var(--surface-2)]'
        }`}
      />
      {error && <p className="mt-1 text-sm text-[var(--accent-2)]">{error}</p>}
    </div>
  );
}

export function Flow({ fotos = [] }: { fotos?: string[] }) {
  const reducir = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const paso = PASOS[idx];

  const [c, setC] = useState({ terminos: false, salud: false, novedades: false, analitica: false });
  const [sexo, setSexo] = useState<Sexo>('mujer');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [actividad, setActividad] = useState<Actividad>('ligera');
  const [objetivo, setObjetivo] = useState<Objetivo>('mantener');
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
    if (!datosOk) return null;
    const d: Datos = { sexo, edad: +edad, peso: +peso, talla: +talla, actividad, objetivo };
    return calcularRequerimientos(d);
  }, [datosOk, sexo, edad, peso, talla, actividad, objetivo]);
  const menu = useMemo(
    () => (req ? generarMenu(sintomas, ingredientes, req.kcal) : null),
    [req, sintomas, ingredientes],
  );

  const puedeSeguir: Record<Paso, boolean> = {
    consent: c.terminos && c.salud,
    datos: true, // se valida al tocar (muestra los errores)
    cuerpo: true,
    sintomas: sintomas.length > 0,
    ingredientes: ingredientes.length >= 3,
    menu: true,
  };

  function ir(delta: number) {
    setDir(delta);
    setIdx((i) => Math.min(PASOS.length - 1, Math.max(0, i + delta)));
  }

  function siguiente() {
    if (paso === 'datos') {
      setIntento(true);
      if (!datosOk) return;
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

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Barra de progreso + atrás (goal gradient: arranca en 6%, nunca en 0) */}
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
        <span className="w-10 text-right text-xs tabular-nums text-[var(--text-secondary)]">
          {Math.round(progreso)}%
        </span>
      </header>

      <main className="flex-1 overflow-x-hidden px-5 pb-32 pt-4">
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
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  Antes de empezar, cuídate tú y <Resaltada>cuidamos tus datos</Resaltada>
                </h1>
                <p className="text-base text-[var(--text-secondary)]">
                  Para calcular lo que necesita tu cuerpo te pedimos datos de salud. Son sensibles, por eso te los pedimos
                  con tu permiso.
                </p>
                <div className="mt-2 flex flex-col gap-3">
                  <Casilla marcada={c.terminos} onChange={(v) => setC({ ...c, terminos: v })} obligatoria>
                    Acepto los{' '}
                    <a href="/aviso-salud" className="font-semibold underline underline-offset-4">
                      términos de uso
                    </a>{' '}
                    y la{' '}
                    <a href="/privacidad" className="font-semibold underline underline-offset-4">
                      política de privacidad
                    </a>
                    . Confirmo que tengo 18 años o más.
                  </Casilla>
                  <Casilla marcada={c.salud} onChange={(v) => setC({ ...c, salud: v })} obligatoria>
                    Autorizo de forma expresa el tratamiento de mis datos de salud (sexo, edad, peso, talla, actividad
                    física y síntomas digestivos) para calcular mis requerimientos y sugerirme menús. Sé que son datos
                    sensibles, que se guardan en servidores de proveedores en el extranjero y que puedo retirar esta
                    autorización cuando quiera.
                  </Casilla>
                  <Casilla marcada={c.novedades} onChange={(v) => setC({ ...c, novedades: v })}>
                    Quiero recibir novedades y recetas por correo.
                  </Casilla>
                  <Casilla marcada={c.analitica} onChange={(v) => setC({ ...c, analitica: v })}>
                    Acepto que midan cómo uso la app para mejorarla.
                  </Casilla>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Cocina en Calma ofrece orientación nutricional general: no diagnostica ni trata enfermedades y no
                  reemplaza a tu médico o nutricionista.
                </p>
              </div>
            )}

            {paso === 'datos' && (
              <div className="flex flex-col gap-5">
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  ¡Hola! Empecemos por <Resaltada>ti</Resaltada>
                </h1>
                <p className="text-base text-[var(--text-secondary)]">
                  Con 6 datos calculamos cuánto necesita tu cuerpo. Es rápido.
                </p>
                <fieldset>
                  <legend className="mb-2 text-sm text-[var(--text-secondary)]">Sexo (para la fórmula)</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <Opcion activa={sexo === 'mujer'} onClick={() => setSexo('mujer')}>
                      Mujer
                    </Opcion>
                    <Opcion activa={sexo === 'hombre'} onClick={() => setSexo('hombre')}>
                      Hombre
                    </Opcion>
                  </div>
                </fieldset>
                <div className="grid grid-cols-3 gap-3">
                  <Campo etiqueta="Edad" unidad="años" valor={edad} onChange={setEdad} min={18} max={99} error={intento ? errores.edad : ''} />
                  <Campo etiqueta="Peso" unidad="kg" valor={peso} onChange={setPeso} min={30} max={250} error={intento ? errores.peso : ''} />
                  <Campo etiqueta="Talla" unidad="cm" valor={talla} onChange={setTalla} min={120} max={220} error={intento ? errores.talla : ''} />
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm text-[var(--text-secondary)]">Actividad física</legend>
                  <div className="flex flex-col gap-3">
                    {ACTIVIDADES.map((a) => (
                      <Opcion key={a.v} activa={actividad === a.v} onClick={() => setActividad(a.v)}>
                        {a.t}
                      </Opcion>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-2 text-sm text-[var(--text-secondary)]">Objetivo</legend>
                  <div className="flex flex-col gap-3">
                    {OBJETIVOS.map((o) => (
                      <Opcion key={o.v} activa={objetivo === o.v} onClick={() => setObjetivo(o.v)}>
                        {o.t}
                      </Opcion>
                    ))}
                  </div>
                </fieldset>
                <div className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug">
                  <b>¿Para qué te pedimos esto?</b> Para que tus menús cubran lo que tu cuerpo necesita. Es un cálculo
                  aproximado: te orienta y no reemplaza una consulta con un profesional de la nutrición. No uses la app
                  para decidir tu alimentación si estás embarazada o en lactancia, tienes diabetes, enfermedad renal o
                  hepática, o has tenido un trastorno de la conducta alimentaria.
                </div>
              </div>
            )}

            {paso === 'cuerpo' && req && (
              <div className="flex flex-col gap-5">
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  Esto necesita tu <Resaltada>cuerpo</Resaltada>
                </h1>
                <p className="text-base text-[var(--text-secondary)]">
                  Por día, según tus datos. La app hace las cuentas; tú solo eliges qué comer.
                </p>
                <div className="rounded-[var(--radius-card)] border border-[var(--surface-2)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Tu meta de cada día</p>
                  <p className="mt-2 text-4xl font-bold [font-family:var(--font-display)]">
                    100% <span className="text-base font-normal text-[var(--text-secondary)]">cubierto con tus comidas</span>
                  </p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: reducir ? 0 : 0.8, ease: EASE }}
                    />
                  </div>
                  <details className="mt-4">
                    <summary className="min-h-11 cursor-pointer py-2 text-base font-semibold text-[var(--accent)]">
                      Ver detalle técnico
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
                  </details>
                </div>
                <div className="rounded-[var(--radius-card)] bg-[var(--chip-bg)] p-4 text-sm leading-snug">
                  <b>Cómo lo usamos:</b> cada receta que eliges suma a tu día. Verás una barra de cuánto llevas cubierto,
                  no un contador de calorías.
                </div>
              </div>
            )}

            {paso === 'sintomas' && (
              <div className="flex flex-col gap-5">
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  ¿Cómo te sientes <Resaltada>hoy</Resaltada>?
                </h1>
                <p className="text-base text-[var(--text-secondary)]">
                  Cuéntanos sin pena. Elige todo lo que aplique: aquí no hay juicios, solo comida rica que te cuida.
                </p>
                <div className="flex flex-col gap-3">
                  {SINTOMAS.map((s) => (
                    <Opcion key={s} activa={sintomas.includes(s)} onClick={() => setSintomas(toggle(sintomas, s))}>
                      {s}
                    </Opcion>
                  ))}
                </div>
              </div>
            )}

            {paso === 'ingredientes' && (
              <div className="flex flex-col gap-5">
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  ¡Casi listo! Marca <Resaltada>3</Resaltada> que tengas en casa
                </h1>
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
                        onClick={() => setIngredientes(toggle(ingredientes, i.etiqueta))}
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
                    Cubre {Math.min(100, Math.round(menu.cobertura * 100))}% de lo que necesitas hoy
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round(menu.cobertura * 100))}%` }}
                      transition={{ duration: reducir ? 0 : 0.8, ease: EASE }}
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
                          {it.receta.min} min · porción ×{it.porcion}
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
                  tienes, ves las compras y la guía de meal prep.
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Orientación nutricional general. No reemplaza a tu médico o nutricionista.
                </p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* CTA fijo abajo con safe-area */}
      <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md bg-[var(--bg)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_16px_var(--bg)]">
        {paso === 'menu' ? (
          <a
            href="/paywall"
            className="flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)]"
          >
            Armar mi semana completa
          </a>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={siguiente}
            disabled={!puedeSeguir[paso]}
            className="h-14 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)] transition-opacity duration-200 disabled:opacity-60"
          >
            {paso === 'consent' && 'Continuar'}
            {paso === 'datos' && 'Calcular lo que necesito'}
            {paso === 'cuerpo' && 'Siguiente'}
            {paso === 'sintomas' && 'Siguiente'}
            {paso === 'ingredientes' && 'Ver mi primer menú'}
          </motion.button>
        )}
      </footer>
    </div>
  );
}
