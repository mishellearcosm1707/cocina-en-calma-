'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { Award, CalendarCheck, Check, ChefHat, FileText, Flame, Frown, HeartPulse, Leaf, Lock, LogOut, Meh, ShieldCheck, Smile, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import { calcularRequerimientos, etiquetaPerfil, type Actividad, type Objetivo } from '@/lib/calculos';
import { actualizar, aIso, borrarTodo, contarLlenos, DIAS_CORTOS, lunesDe, sumarDias, tandasPrep, TOTAL_ESPACIOS, useApp, type EstadoApp, type Nivel, type Perfil } from '@/lib/semana';
import { Chip, Esqueleto } from './comunes';

const ACTIVIDADES: { v: Actividad; t: string }[] = [
  { v: 'sedentaria', t: 'Casi nada' },
  { v: 'ligera', t: 'Ligera' },
  { v: 'moderada', t: 'Moderada' },
  { v: 'alta', t: 'Alta' },
];
const OBJETIVOS: { v: Objetivo; t: string }[] = [
  { v: 'mantener', t: 'Mantener' },
  { v: 'bajar', t: 'Bajar con calma' },
  { v: 'subir', t: 'Subir con calma' },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const CARAS: Record<Nivel, { icono: LucideIcon; fondo: string; tinta: string; t: string }> = {
  ligera: { icono: Smile, fondo: 'var(--olive-wash)', tinta: 'var(--accent)', t: 'Ligera' },
  normal: { icono: Meh, fondo: 'var(--mustard-soft)', tinta: 'var(--mustard-ink)', t: 'Normal' },
  hinchada: { icono: Frown, fondo: 'var(--peach)', tinta: 'var(--peach-ink)', t: 'Hinchada' },
};

export function Yo() {
  const app = useApp();
  if (!app) return <Esqueleto />;
  return <Contenido perfil={app.perfil} app={app} />;
}

function Contenido({ perfil, app }: { perfil: Perfil; app: EstadoApp }) {
  const [peso, setPeso] = useState(String(perfil.peso));
  const [actividad, setActividad] = useState<Actividad>(perfil.actividad);
  const [objetivo, setObjetivo] = useState<Objetivo>(perfil.objetivo);
  const [guardado, setGuardado] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const pesoOk = +peso >= 30 && +peso <= 250;
  const cambio = +peso !== perfil.peso || actividad !== perfil.actividad || objetivo !== perfil.objetivo;
  const req = calcularRequerimientos({ ...perfil, peso: pesoOk ? +peso : perfil.peso, actividad, objetivo });

  const hoy = new Date();
  const lunes = lunesDe(hoy);
  const semana = Array.from({ length: 7 }, (_, i) => {
    const iso = aIso(sumarDias(lunes, i));
    return { iso, nivel: app.chequeos[iso] as Nivel | undefined, hoy: iso === aIso(hoy) };
  });
  const total = semana.filter((d) => d.nivel).length;
  const ligeras = semana.filter((d) => d.nivel === 'ligera').length;
  let racha = 0;
  for (let i = app.chequeos[aIso(hoy)] ? 0 : 1; app.chequeos[aIso(sumarDias(hoy, -i))]; i++) racha++;
  const plan = app.semanas[aIso(lunes)];
  const llenos = contarLlenos(plan);
  const tandas = tandasPrep(plan).length;
  const logros: { t: string; ok: boolean; icono: LucideIcon; fondo: string; tinta: string }[] = [
    { t: 'Primer chequeo', ok: Object.keys(app.chequeos).length > 0, icono: HeartPulse, fondo: 'var(--peach)', tinta: 'var(--peach-ink)' },
    { t: '3 días seguidos', ok: racha >= 3, icono: Flame, fondo: 'var(--mustard-soft)', tinta: 'var(--mustard-ink)' },
    { t: 'Semana completa', ok: llenos >= TOTAL_ESPACIOS, icono: CalendarCheck, fondo: 'var(--olive-wash)', tinta: 'var(--accent)' },
    { t: 'Meal prep armado', ok: tandas >= 3, icono: Sparkles, fondo: 'var(--sky)', tinta: 'var(--sky-ink)' },
  ];

  function guardar() {
    if (!pesoOk) return;
    actualizar((e) => ({ ...e, perfil: { ...e.perfil, peso: +peso, actividad, objetivo } }));
    setGuardado(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        aria-label="Tu perfil"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative mx-5 mt-6 overflow-hidden rounded-[var(--radius-card)] p-5 text-[var(--bg)] shadow-[var(--shadow-2)]"
        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #6f8a3a 55%, var(--mustard) 130%)' }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 text-white/15"
          animate={{ rotate: [0, 8, 0, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf size={150} strokeWidth={1.2} />
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-4 left-24 text-white/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf size={80} strokeWidth={1.2} />
        </motion.span>
        <div className="relative flex items-center gap-4">
          <motion.span
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] text-3xl font-bold text-[var(--accent)] [font-family:var(--font-display)]"
            animate={{ boxShadow: ['0 0 0 0 rgb(255 255 255 / 0.5)', '0 0 0 14px rgb(255 255 255 / 0)'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          >
            {(perfil.nombre || 'T').charAt(0).toUpperCase()}
          </motion.span>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-on-dark)]">Tu perfil</p>
            <h1 className="truncate text-2xl font-bold leading-tight [font-family:var(--font-display)]">{perfil.nombre || 'Tu espacio'}</h1>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-sm font-semibold">
              <ChefHat size={14} aria-hidden="true" /> {etiquetaPerfil(perfil.ritmo)}
            </p>
          </div>
        </div>
        <dl className="relative mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { n: String(racha), t: racha === 1 ? 'día de chequeo' : 'días de chequeo', I: Flame },
            { n: `${llenos}/${TOTAL_ESPACIOS}`, t: 'comidas elegidas', I: CalendarCheck },
            { n: String(tandas), t: tandas === 1 ? 'receta de prep' : 'recetas de prep', I: ChefHat },
          ].map(({ n, t, I }) => (
            <div key={t} className="rounded-[var(--radius-button)] bg-white/15 p-2">
              <I size={18} aria-hidden="true" className="mx-auto" />
              <dd className="text-xl font-bold tabular-nums [font-family:var(--font-display)]">{n}</dd>
              <dt className="text-sm leading-tight">{t}</dt>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        aria-label="Cómo te has sentido"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45, ease: EASE }}
        className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold [font-family:var(--font-display)]">
          <HeartPulse size={20} color="var(--accent-2)" aria-hidden="true" /> Cómo te has sentido
        </h2>
        <ul className="mt-3 grid grid-cols-7 gap-1 text-center">
          {semana.map((d, i) => {
            const cara = d.nivel ? CARAS[d.nivel] : null;
            const Icono = cara?.icono;
            return (
              <motion.li
                key={d.iso}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.05, type: 'spring', stiffness: 300, damping: 18 }}
              >
                <span
                  className={`mx-auto flex size-10 items-center justify-center rounded-full ${d.hoy ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]' : ''}`}
                  style={{ background: cara?.fondo ?? 'var(--surface-2)', color: cara?.tinta }}
                >
                  {Icono && cara ? <Icono size={22} strokeWidth={1.9} aria-label={cara.t} /> : <span className="text-sm text-[var(--text-secondary)]">–</span>}
                </span>
                <span className="mt-1 block text-sm font-semibold text-[var(--text-secondary)]">{DIAS_CORTOS[i]}</span>
              </motion.li>
            );
          })}
        </ul>
        <p className="mt-3 text-base text-[var(--text-secondary)]">
          {total === 0 ? (
            'Anota cómo te sientes en Hoy y aquí verás tu patrón.'
          ) : (
            <>
              Esta semana te sentiste <b className="text-[var(--text-primary)]">ligera {ligeras} {ligeras === 1 ? 'día' : 'días'}</b> de {total}.
            </>
          )}
        </p>
      </motion.section>

      <section aria-label="Tus logros" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <h2 className="flex items-center gap-2 text-lg font-bold [font-family:var(--font-display)]">
          <Award size={20} color="var(--mustard-ink)" aria-hidden="true" /> Tus logros
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {logros.map((l) => {
            const Icono = l.icono;
            return (
              <li
                key={l.t}
                className={`flex items-center gap-3 rounded-[var(--radius-button)] p-3 ${l.ok ? '' : 'opacity-70'}`}
                style={{ background: l.ok ? l.fondo : 'var(--surface-2)' }}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]">
                  {l.ok ? <Icono size={20} color={l.tinta} aria-hidden="true" /> : <Lock size={18} color="var(--text-secondary)" aria-hidden="true" />}
                </span>
                <span className="min-w-0 text-base font-semibold leading-snug">{l.t}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Lo que necesita tu cuerpo" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">Lo que necesita tu cuerpo al día</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          {[
            ['Energía', `${req.kcal.toLocaleString('es')} kcal`, 'var(--olive-wash)', 'var(--accent)'],
            ['Proteína', `${req.proteina} g`, 'var(--peach)', 'var(--peach-ink)'],
            ['Carbohidratos', `${req.carbohidratos} g`, 'var(--mustard-soft)', 'var(--mustard-ink)'],
            ['Grasas', `${req.grasas} g`, 'var(--sky)', 'var(--sky-ink)'],
            ['Fibra', `${req.fibra} g`, 'var(--olive-wash)', 'var(--accent)'],
          ].map(([k, v, fondo, tinta]) => (
            <div key={k} className="rounded-[var(--radius-button)] p-3" style={{ background: fondo }}>
              <dt className="text-sm font-semibold" style={{ color: tinta }}>{k}</dt>
              <dd className="text-xl font-bold tabular-nums [font-family:var(--font-display)]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Calculado con la fórmula de Mifflin-St Jeor. Es aproximado y orientativo: no reemplaza una consulta con tu profesional de la nutrición.
        </p>
      </section>

      <section aria-label="Tus datos" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">Tus datos</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {perfil.sexo === 'mujer' ? 'Mujer' : 'Hombre'} · {perfil.edad} años · {perfil.talla} cm
        </p>
        <label htmlFor="peso" className="mt-4 block text-sm text-[var(--text-secondary)]">
          Peso (kg)
        </label>
        <input
          id="peso"
          inputMode="decimal"
          type="number"
          min={30}
          max={250}
          value={peso}
          onChange={(e) => {
            setPeso(e.target.value);
            setGuardado(false);
          }}
          aria-invalid={!pesoOk}
          className={`mt-1 h-14 w-full rounded-[var(--radius-button)] border bg-[var(--bg)] px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            pesoOk ? 'border-[var(--surface-2)]' : 'border-[var(--error)]'
          }`}
        />
        {!pesoOk && <p className="mt-1 text-sm text-[var(--error)]">Escribe un peso entre 30 y 250 kg</p>}
        <p className="mt-4 text-sm text-[var(--text-secondary)]">Actividad física</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ACTIVIDADES.map((a) => (
            <Chip
              key={a.v}
              activo={actividad === a.v}
              onClick={() => {
                setActividad(a.v);
                setGuardado(false);
              }}
            >
              {a.t}
            </Chip>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">Qué buscas con tu peso</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {OBJETIVOS.map((o) => (
            <Chip
              key={o.v}
              activo={objetivo === o.v}
              onClick={() => {
                setObjetivo(o.v);
                setGuardado(false);
              }}
            >
              {o.t}
            </Chip>
          ))}
        </div>
        <button
          type="button"
          onClick={guardar}
          disabled={!cambio || !pesoOk}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          {guardado ? (
            <>
              <Check size={20} aria-hidden="true" /> Guardado
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </section>

      <section aria-label="Tu cuenta" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--peach-wash)] p-4">
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">Tu cuenta</h2>
        <p className="mt-1 text-base">{perfil.correo}</p>
        <p className="mt-3 flex items-start gap-2 text-base text-[var(--text-secondary)]">
          <ShieldCheck size={20} color="var(--accent)" aria-hidden="true" className="mt-0.5 shrink-0" />
          Tu plan: pago único de $14.99 con Garantía Calma de 7 días por Hotmart.
        </p>
        <Link
          href="/login"
          className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--text-tertiary)] bg-[var(--surface)] px-4 text-base font-semibold [touch-action:manipulation]"
        >
          <LogOut size={20} aria-hidden="true" /> Cerrar sesión
        </Link>
      </section>

      <section aria-label="Privacidad" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">Tus datos de salud</h2>
        <p className="mt-1 text-base text-[var(--text-secondary)]">
          Por ahora se guardan solo en este celular. Puedes borrarlos cuando quieras.
        </p>
        <div className="mt-3 flex flex-col">
          <Link href="/privacidad" className="flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--accent)]">
            <FileText size={20} aria-hidden="true" /> Política de privacidad
          </Link>
          <Link href="/aviso-salud" className="flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--accent)]">
            <FileText size={20} aria-hidden="true" /> Aviso de salud
          </Link>
        </div>
        {!confirmar ? (
          <button
            type="button"
            onClick={() => setConfirmar(true)}
            className="mt-2 flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--error)]"
          >
            <Trash2 size={20} aria-hidden="true" /> Borrar mis datos de este celular
          </button>
        ) : (
          <div role="alert" className="mt-3 rounded-[var(--radius-button)] bg-[var(--peach)] p-3">
            <p className="text-base font-semibold text-[var(--peach-ink)]">
              Se borra tu semana, tus chequeos y tus datos. No se puede deshacer.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  borrarTodo();
                  setConfirmar(false);
                }}
                className="min-h-12 flex-1 rounded-[var(--radius-button)] bg-[var(--error)] px-4 text-base font-bold text-[var(--bg)]"
              >
                Sí, borrar
              </button>
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                className="min-h-12 flex-1 rounded-[var(--radius-button)] border border-[var(--text-tertiary)] bg-[var(--surface)] px-4 text-base font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
