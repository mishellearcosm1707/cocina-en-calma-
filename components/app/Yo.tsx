'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, FileText, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import { calcularRequerimientos, type Actividad, type Objetivo } from '@/lib/calculos';
import { actualizar, borrarTodo, useApp, type Perfil } from '@/lib/semana';
import { Cabecera, Chip, Esqueleto } from './comunes';

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

export function Yo() {
  const app = useApp();
  if (!app) return <Esqueleto />;
  return <Contenido perfil={app.perfil} />;
}

function Contenido({ perfil }: { perfil: Perfil }) {
  const [peso, setPeso] = useState(String(perfil.peso));
  const [actividad, setActividad] = useState<Actividad>(perfil.actividad);
  const [objetivo, setObjetivo] = useState<Objetivo>(perfil.objetivo);
  const [guardado, setGuardado] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const pesoOk = +peso >= 30 && +peso <= 250;
  const cambio = +peso !== perfil.peso || actividad !== perfil.actividad || objetivo !== perfil.objetivo;
  const req = calcularRequerimientos({ ...perfil, peso: pesoOk ? +peso : perfil.peso, actividad, objetivo });

  function guardar() {
    if (!pesoOk) return;
    actualizar((e) => ({ ...e, perfil: { ...e.perfil, peso: +peso, actividad, objetivo } }));
    setGuardado(true);
  }

  return (
    <>
      <Cabecera
        etiqueta="Yo"
        titulo={
          <>
            {perfil.nombre ? `${perfil.nombre}, ` : ''}
            tus <span className="text-[var(--accent)]">números</span>
          </>
        }
      />

      <section aria-label="Lo que necesita tu cuerpo" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]">
        <h2 className="text-lg font-bold [font-family:var(--font-display)]">Lo que necesita tu cuerpo al día</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          {[
            ['Energía', `${req.kcal.toLocaleString('es')} kcal`],
            ['Proteína', `${req.proteina} g`],
            ['Carbohidratos', `${req.carbohidratos} g`],
            ['Grasas', `${req.grasas} g`],
            ['Fibra', `${req.fibra} g`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[var(--radius-button)] bg-[var(--olive-wash)] p-3">
              <dt className="text-sm text-[var(--text-secondary)]">{k}</dt>
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
    </>
  );
}
