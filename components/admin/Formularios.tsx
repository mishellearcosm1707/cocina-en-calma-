'use client';

import { useActionState, useState, type ReactNode } from 'react';
import { agregarGasto, agregarUsuario, generarEnlace, guardarCostos, type Resultado } from '@/app/admin/acciones';

const campo =
  'h-12 w-full rounded-[var(--radius-button)] border border-[var(--surface-2)] bg-[var(--bg)] px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';
const boton =
  'flex min-h-12 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-5 text-base font-bold text-[var(--bg)] transition-transform duration-150 active:scale-[0.97] disabled:opacity-60 [touch-action:manipulation]';

function Etiqueta({ id, children }: { id: string; children: ReactNode }) {
  return (
    <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
      {children}
    </label>
  );
}

function Mensaje({ r }: { r: Resultado | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`text-base font-semibold ${r.ok ? 'text-[var(--accent)]' : 'text-[var(--error)]'}`}>
      {r.mensaje}
    </p>
  );
}

export function FormAgregarUsuario() {
  const [r, accion, pendiente] = useActionState(agregarUsuario, null);
  return (
    <form action={accion} className="flex flex-col gap-3">
      <div>
        <Etiqueta id="nu-email">Correo</Etiqueta>
        <input id="nu-email" name="email" type="email" required autoComplete="off" placeholder="nombre@correo.com" className={campo} />
      </div>
      <div>
        <Etiqueta id="nu-nombre">Nombre (opcional)</Etiqueta>
        <input id="nu-nombre" name="nombre" type="text" maxLength={80} autoComplete="off" className={campo} />
      </div>
      <button type="submit" disabled={pendiente} className={boton}>
        {pendiente ? 'Guardando…' : 'Dar acceso'}
      </button>
      <Mensaje r={r} />
    </form>
  );
}

export function FormEnlace({ email }: { email: string }) {
  const [r, accion, pendiente] = useActionState(generarEnlace, null);
  const [copiado, setCopiado] = useState(false);
  return (
    <form action={accion} className="flex flex-col gap-2">
      <input type="hidden" name="email" value={email} />
      <button type="submit" disabled={pendiente} className="min-h-11 self-start text-base font-semibold text-[var(--accent)] underline underline-offset-4">
        {pendiente ? 'Creando…' : 'Crear enlace de entrada'}
      </button>
      {r && !r.ok && <Mensaje r={r} />}
      {r?.ok && r.enlace && (
        <div className="rounded-[var(--radius-button)] bg-[var(--mustard-soft)] p-3 text-[var(--mustard-ink)]">
          <p className="text-sm font-semibold">{r.mensaje}</p>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(r.enlace ?? '');
              setCopiado(true);
            }}
            className="mt-2 min-h-11 rounded-[var(--radius-button)] bg-[var(--surface)] px-4 text-base font-bold"
          >
            {copiado ? 'Copiado' : 'Copiar enlace'}
          </button>
        </div>
      )}
    </form>
  );
}

export function FormCostos({ actual }: { actual: { impuestoPct: number | null; infraMensual: number | null; emailMensual: number | null } }) {
  const [r, accion, pendiente] = useActionState(guardarCostos, null);
  return (
    <form action={accion} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <Etiqueta id="c-imp">Impuestos (% de lo cobrado)</Etiqueta>
        <input id="c-imp" name="impuesto_pct" inputMode="decimal" defaultValue={actual.impuestoPct ?? ''} placeholder="Ej. 15" className={campo} />
      </div>
      <div>
        <Etiqueta id="c-inf">Infraestructura al mes (USD)</Etiqueta>
        <input id="c-inf" name="infra_mensual" inputMode="decimal" defaultValue={actual.infraMensual ?? ''} placeholder="Ej. 20" className={campo} />
      </div>
      <div>
        <Etiqueta id="c-em">Correos al mes (USD)</Etiqueta>
        <input id="c-em" name="email_mensual" inputMode="decimal" defaultValue={actual.emailMensual ?? ''} placeholder="Ej. 0" className={campo} />
      </div>
      <div className="sm:col-span-3">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? 'Guardando…' : 'Guardar costos'}
        </button>
        <div className="mt-2">
          <Mensaje r={r} />
        </div>
      </div>
    </form>
  );
}

export function FormGasto() {
  const [r, accion, pendiente] = useActionState(agregarGasto, null);
  return (
    <form action={accion} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <Etiqueta id="g-canal">Canal</Etiqueta>
        <input id="g-canal" name="canal" required maxLength={40} placeholder="ads_meta, afiliados, organico…" className={campo} />
      </div>
      <div>
        <Etiqueta id="g-monto">Monto gastado (USD)</Etiqueta>
        <input id="g-monto" name="monto" required inputMode="decimal" placeholder="Ej. 50" className={campo} />
      </div>
      <div>
        <Etiqueta id="g-desde">Desde</Etiqueta>
        <input id="g-desde" name="desde" type="date" required className={campo} />
      </div>
      <div>
        <Etiqueta id="g-hasta">Hasta</Etiqueta>
        <input id="g-hasta" name="hasta" type="date" required className={campo} />
      </div>
      <div className="sm:col-span-2">
        <Etiqueta id="g-nota">Nota (opcional)</Etiqueta>
        <input id="g-nota" name="nota" maxLength={120} className={campo} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? 'Guardando…' : 'Registrar gasto'}
        </button>
        <div className="mt-2">
          <Mensaje r={r} />
        </div>
      </div>
    </form>
  );
}
