'use client';

import { registrarEvento } from '@/lib/eventos';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Check, Search, Snowflake, Zap } from 'lucide-react';
import { CATEGORIAS, categoriaDe, COMIDAS, esComida, esExpress, opcionPrep, RECETAS, type Categoria, type Comida, type Receta, type Sintoma } from '@/lib/recetas';
import { actualizar, aIso, clave, indiceDia, lunesDe, useApp } from '@/lib/semana';
import { Cabecera, Chip, Esqueleto, Foto, useFotos } from './comunes';
import { HojaReceta } from './HojaReceta';
import { PlanificarPrep } from './PlanificarPrep';

const PAGINA = 24;
const SINTOMAS: Sintoma[] = ['Hinchazón', 'Gases', 'Pesadez', 'Digestión lenta'];

function FiltroFila({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="mt-3" role="group" aria-label={titulo}>
      <p className="px-5 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{titulo}</p>
      <div className="mt-1 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</div>
    </div>
  );
}

export function Recetas() {
  const app = useApp();
  const [abierta, setAbierta] = useState<Receta | null>(null);
  const [comida, setComida] = useState<Comida | null>(null);
  const [sintoma, setSintoma] = useState<Sintoma | null>(null);
  const [express, setExpress] = useState(false);
  const [congelable, setCongelable] = useState(false);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [pagina, setPagina] = useState<{ k: string; n: number }>({ k: '', n: PAGINA });
  const [texto, setTexto] = useState('');
  const [agregada, setAgregada] = useState('');
  const cerrar = useCallback(() => {
    setAbierta(null);
    setAgregada('');
  }, []);

  const fotos = useFotos();
  const lista = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return RECETAS.filter(
      (r) =>
        (!comida || r.comida === comida) &&
        (!sintoma || r.sintomas.includes(sintoma)) &&
        (!categoria || categoriaDe(r) === categoria) &&
        (!express || esExpress(r)) &&
        (!congelable || Boolean(opcionPrep(r))) &&
        (!q || r.nombre.toLowerCase().includes(q) || r.ing.some((i) => i.toLowerCase().includes(q))),
    ).sort((a, b) => Number(fotos.includes(b.id)) - Number(fotos.includes(a.id)));
  }, [comida, sintoma, express, congelable, categoria, texto, fotos]);

  if (!app) return <Esqueleto />;
  const activos = [comida, sintoma, express, congelable, categoria, texto.trim()].filter(Boolean).length;
  const filtroK = [comida, sintoma, express, congelable, categoria, texto].join('|');
  const visibles = pagina.k === filtroK ? pagina.n : PAGINA;

  function limpiar() {
    setComida(null);
    setSintoma(null);
    setExpress(false);
    setCongelable(false);
    setCategoria(null);
    setTexto('');
  }

  const hoy = new Date();
  const semanaKey = aIso(lunesDe(hoy));
  const hoyIdx = indiceDia(hoy);

  function planificar(r: Receta, dias: number[]) {
    registrarEvento('receta_planificada', { dias: dias.length });
    actualizar((e) => {
      const actual = { ...(e.semanas[semanaKey] ?? {}) };
      for (const d of dias) actual[clave(d, r.comida)] = r.id;
      return { ...e, semanas: { ...e.semanas, [semanaKey]: actual } };
    });
    setAgregada(r.id);
  }

  return (
    <>
      <Cabecera
        etiqueta={`${RECETAS.length} recetas`}
        titulo={
          <>
            Elige lo que <span className="text-[var(--accent)]">se te antoje</span>
          </>
        }
      />
      <div className="px-5 pt-4">
        <label htmlFor="buscar" className="sr-only">
          Buscar receta o ingrediente
        </label>
        <div className="relative">
          <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            id="buscar"
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Busca una receta o un ingrediente"
            className="h-14 w-full rounded-[var(--radius-button)] border border-[var(--surface-2)] bg-[var(--surface)] pl-12 pr-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          />
        </div>
      </div>

      <FiltroFila titulo="Tipo de receta">
        <Chip activo={!categoria} onClick={() => setCategoria(null)}>
          Todas
        </Chip>
        {CATEGORIAS.map((c) => (
          <Chip key={c} activo={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
            {c}
          </Chip>
        ))}
      </FiltroFila>
      <FiltroFila titulo="Comida">
        <Chip activo={!comida} onClick={() => setComida(null)}>
          Todas
        </Chip>
        {COMIDAS.map((c) => (
          <Chip key={c} activo={comida === c} onClick={() => setComida(comida === c ? null : c)}>
            {c}
          </Chip>
        ))}
      </FiltroFila>
      <FiltroFila titulo="Tu tiempo en la cocina">
        <Chip activo={express} onClick={() => setExpress(!express)}>
          Listas en 15 min
        </Chip>
        <Chip activo={congelable} onClick={() => setCongelable(!congelable)}>
          Para meal prep
        </Chip>
      </FiltroFila>
      <FiltroFila titulo="Te ayudan con">
        {SINTOMAS.map((s) => (
          <Chip key={s} activo={sintoma === s} onClick={() => setSintoma(sintoma === s ? null : s)}>
            {s}
          </Chip>
        ))}
      </FiltroFila>

      <p className="mt-3 flex items-center justify-between px-5 text-base text-[var(--text-secondary)]" role="status">
        <span>
          {lista.length} {lista.length === 1 ? 'receta' : 'recetas'}
        </span>
        {activos > 0 && (
          <button type="button" onClick={limpiar} className="min-h-11 font-semibold text-[var(--accent)] underline underline-offset-4">
            Quitar filtros
          </button>
        )}
      </p>

      {lista.length === 0 ? (
        <div className="mx-5 mt-2 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 text-center shadow-[var(--shadow-1)]">
          <p className="text-lg font-bold [font-family:var(--font-display)]">Nada con esa mezcla</p>
          <p className="mt-1 text-base text-[var(--text-secondary)]">Prueba con menos filtros o con otro ingrediente.</p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-3 min-h-12 rounded-[var(--radius-button)] border border-[var(--accent)] px-5 text-base font-semibold text-[var(--accent)]"
          >
            Ver todas las recetas
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 px-5">
          {lista.slice(0, visibles).map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setAbierta(r)}
                className="flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
              >
                <Foto receta={r} className="h-28 w-full !rounded-none" sizes="(max-width: 448px) 50vw, 224px" />
                <span className="flex flex-1 flex-col p-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{r.comida}</span>
                  <span className="mt-1 min-h-12 text-base font-bold leading-snug">{r.nombre}</span>
                  <span className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-sm text-[var(--text-secondary)]">
                    {esExpress(r) ? null : <>{r.min} min</>}
                    {esExpress(r) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mustard-soft)] px-2 py-0.5 text-sm font-semibold text-[var(--mustard-ink)]">
                        <Zap size={14} aria-hidden="true" /> {r.min} min
                      </span>
                    )}
                    {opcionPrep(r) ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--sky)] px-2 py-0.5 text-sm font-semibold text-[var(--sky-ink)]">
                        <Snowflake size={14} aria-hidden="true" /> Prep
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {lista.length > visibles && (
        <div className="px-5 pt-4">
          <button
            type="button"
            onClick={() => setPagina({ k: filtroK, n: visibles + PAGINA })}
            className="flex min-h-14 w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--accent)] bg-[var(--surface)] text-base font-bold text-[var(--accent)] [touch-action:manipulation]"
          >
            Ver más recetas ({lista.length - visibles} faltan)
          </button>
        </div>
      )}

      <HojaReceta
        receta={abierta}
        onCerrar={cerrar}
        accion={
          abierta && esComida(abierta) ? (
            agregada === abierta.id ? (
              <p role="status" className="flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--olive-wash)] p-4 text-base font-bold text-[var(--accent)]">
                <Check size={20} aria-hidden="true" /> Listo, ya está en tu semana
              </p>
            ) : (
              <PlanificarPrep
                key={abierta.id}
                receta={abierta}
                diaBase={hoyIdx}
                soloTexto={`Poner en mi ${abierta.comida.toLowerCase()} de hoy`}
                ocupados={new Set()}
                libre
                onElegir={(dias) => planificar(abierta, dias)}
              />
            )
          ) : null
        }
      />
    </>
  );
}
