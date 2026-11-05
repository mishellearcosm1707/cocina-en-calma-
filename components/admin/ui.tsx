import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Hourglass, Lightbulb } from 'lucide-react';
import type { AvisoDueña } from '@/lib/admin/datos';

// Piezas del panel: un dato héroe + una frase que lo interpreta. Si no hay dato, dice "Sin datos" y por qué.

export function Pagina({ titulo, bajada, children }: { titulo: string; bajada?: string; children: ReactNode }) {
  return (
    <section className="escalon flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold leading-tight [font-family:var(--font-display)]">{titulo}</h1>
        {bajada && <p className="mt-1 text-base text-[var(--text-secondary)]">{bajada}</p>}
      </header>
      {children}
    </section>
  );
}

export function Tarjeta({
  titulo,
  valor,
  insight,
  tono = 'neutro',
  children,
}: {
  titulo: string;
  /** null = no hay dato todavía */
  valor: string | null;
  insight?: string;
  tono?: 'neutro' | 'bien' | 'alerta';
  children?: ReactNode;
}) {
  const color = tono === 'bien' ? 'var(--accent)' : tono === 'alerta' ? 'var(--error)' : 'var(--text-primary)';
  return (
    <article className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{titulo}</h2>
      {valor === null ? (
        <p className="mt-2 text-2xl font-bold text-[var(--text-secondary)] [font-family:var(--font-display)]">Sin datos</p>
      ) : (
        <p className="mt-2 text-3xl font-bold tabular-nums [font-family:var(--font-display)]" style={{ color }}>
          {valor}
        </p>
      )}
      {insight && <p className="mt-1 text-base leading-snug text-[var(--text-secondary)]">{insight}</p>}
      {children}
    </article>
  );
}

/** Dato héroe: la cifra que más importa, ancha, con fondo propio. */
export function Heroe({ titulo, valor, insight, tono = 'neutro' }: { titulo: string; valor: string | null; insight?: string; tono?: 'neutro' | 'bien' | 'alerta' }) {
  const color = tono === 'bien' ? 'var(--accent)' : tono === 'alerta' ? 'var(--error)' : 'var(--text-primary)';
  return (
    <article className="rounded-[var(--radius-card)] bg-[linear-gradient(135deg,var(--olive-wash),var(--surface))] p-5 shadow-[var(--shadow-2)]">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{titulo}</h2>
      {valor === null ? (
        <p className="mt-2 text-3xl font-bold text-[var(--text-secondary)] [font-family:var(--font-display)]">Sin datos todavía</p>
      ) : (
        <p className="mt-2 text-5xl font-bold tabular-nums leading-none [font-family:var(--font-display)]" style={{ color }}>
          {valor}
        </p>
      )}
      {insight && <p className="mt-3 text-lg leading-snug text-[var(--text-secondary)]">{insight}</p>}
    </article>
  );
}

export function Rejilla({ children }: { children: ReactNode }) {
  return <div className="escalon grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function Rejilla3({ children }: { children: ReactNode }) {
  return <div className="escalon grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>;
}

export function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <h2 className="text-lg font-bold [font-family:var(--font-display)]">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function VacioInfo({ children }: { children: ReactNode }) {
  return <p className="rounded-[var(--radius-button)] bg-[var(--surface-2)] p-3 text-base text-[var(--text-secondary)]">{children}</p>;
}

/** Barras simples (máximo dato, mínima tinta): valor sobre cada barra, sin rejilla ni ejes. */
export function Barras({ datos, formato }: { datos: Array<{ etiqueta: string; valor: number }>; formato: (n: number) => string }) {
  if (!datos.length) return null;
  const max = Math.max(...datos.map((d) => d.valor), 1);
  const ancho = 100 / datos.length;
  return (
    <svg viewBox="0 0 100 52" role="img" aria-label="Gráfico de barras" className="w-full">
      {datos.map((d, i) => {
        const alto = (d.valor / max) * 30;
        const x = i * ancho + ancho * 0.18;
        const w = ancho * 0.64;
        return (
          <g key={d.etiqueta}>
            <rect x={x} y={38 - alto} width={w} height={Math.max(alto, 0.6)} rx={1.2} fill="var(--accent)" />
            <text x={x + w / 2} y={38 - alto - 2} textAnchor="middle" fontSize="3.4" fill="var(--text-primary)">
              {formato(d.valor)}
            </text>
            <text x={x + w / 2} y={44} textAnchor="middle" fontSize="3.4" fill="var(--text-secondary)">
              {d.etiqueta}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Barras horizontales para el embudo: ancho proporcional al primer paso. */
export function Embudo({ pasos }: { pasos: Array<{ etiqueta: string; personas: number }> }) {
  const base = Math.max(pasos[0]?.personas ?? 0, 1);
  return (
    <ol className="flex flex-col gap-2">
      {pasos.map((p, i) => {
        const ant = i > 0 ? pasos[i - 1].personas : null;
        const caida = ant && ant > 0 ? Math.round((1 - p.personas / ant) * 100) : null;
        return (
          <li key={p.etiqueta}>
            <div className="flex items-baseline justify-between gap-3 text-base">
              <span>{p.etiqueta}</span>
              <span className="tabular-nums font-semibold">
                {p.personas}
                {caida !== null && caida > 0 && <span className="ml-2 text-sm font-normal text-[var(--error)]">−{caida}%</span>}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(p.personas / base) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Avisos({ avisos, hayDatos }: { avisos: AvisoDueña[]; hayDatos: boolean }) {
  if (!avisos.length && !hayDatos) {
    return (
      <p role="status" className="flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-4 text-lg font-bold text-[var(--text-secondary)]">
        <Hourglass size={24} aria-hidden="true" className="mt-0.5 shrink-0" />
        <span>
          Aún no hay ventas ni avisos
          <span className="mt-1 block text-base font-normal">Cuando lleguen las primeras compras, aquí verás qué necesita tu atención.</span>
        </span>
      </p>
    );
  }
  if (!avisos.length) {
    return (
      <p role="status" className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4 text-lg font-bold text-[var(--accent)]">
        <CheckCircle2 size={24} aria-hidden="true" className="shrink-0" />
        Todo en orden este mes
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3" aria-label="Avisos para ti">
      {avisos.map((a) => (
        <li
          key={a.titulo}
          className="rounded-[var(--radius-card)] p-4"
          style={{ background: a.nivel === 'alto' ? 'var(--peach)' : 'var(--mustard-soft)', color: a.nivel === 'alto' ? 'var(--peach-ink)' : 'var(--mustard-ink)' }}
        >
          <p className="flex items-start gap-2 text-lg font-bold leading-snug">
            {a.nivel === 'alto' ? <AlertTriangle size={22} aria-hidden="true" className="mt-0.5 shrink-0" /> : <Lightbulb size={22} aria-hidden="true" className="mt-0.5 shrink-0" />}
            {a.titulo}
          </p>
          <p className="mt-1 text-base"><b>Qué pasó:</b> {a.que}</p>
          <p className="text-base"><b>Por qué importa:</b> {a.porque}</p>
          <p className="text-base"><b>Qué hacer:</b> {a.hacer}</p>
        </li>
      ))}
    </ul>
  );
}

export function Tabla({ columnas, filas }: { columnas: string[]; filas: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-base">
        <thead>
          <tr className="border-b border-[var(--surface-2)] text-sm uppercase tracking-wider text-[var(--text-secondary)]">
            {columnas.map((c) => (
              <th key={c} scope="col" className="px-2 py-2 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className="border-b border-[var(--surface-2)] last:border-0">
              {f.map((c, j) => (
                <td key={j} className="px-2 py-2 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
