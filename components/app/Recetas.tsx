'use client';

import { useCallback, useMemo, useState } from 'react';
import { Check, Plus, Search, Snowflake, Zap } from 'lucide-react';
import { COMIDAS, RECETAS, type Comida, type Receta, type Sintoma } from '@/lib/recetas';
import { actualizar, aIso, clave, indiceDia, lunesDe, useApp } from '@/lib/semana';
import { Cabecera, Chip, Esqueleto, Foto, useFotos } from './comunes';
import { HojaReceta } from './HojaReceta';

const SINTOMAS: Sintoma[] = ['Hinchazón', 'Gases', 'Pesadez', 'Digestión lenta'];

export function Recetas() {
  const app = useApp();
  const [abierta, setAbierta] = useState<Receta | null>(null);
  const [comida, setComida] = useState<Comida | null>(null);
  const [sintoma, setSintoma] = useState<Sintoma | null>(null);
  const [express, setExpress] = useState(false);
  const [congelable, setCongelable] = useState(false);
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
        (!express || r.min <= 15) &&
        (!congelable || Boolean(r.congelable_dias)) &&
        (!q || r.nombre.toLowerCase().includes(q) || r.ing.some((i) => i.toLowerCase().includes(q))),
    ).sort((a, b) => Number(fotos.includes(b.id)) - Number(fotos.includes(a.id)));
  }, [comida, sintoma, express, congelable, texto, fotos]);

  if (!app) return <Esqueleto />;
  const activos = [comida, sintoma, express, congelable, texto.trim()].filter(Boolean).length;

  function limpiar() {
    setComida(null);
    setSintoma(null);
    setExpress(false);
    setCongelable(false);
    setTexto('');
  }

  function agregarAHoy(r: Receta) {
    const hoy = new Date();
    const semana = aIso(lunesDe(hoy));
    actualizar((e) => ({
      ...e,
      semanas: { ...e.semanas, [semana]: { ...(e.semanas[semana] ?? {}), [clave(indiceDia(hoy), r.comida)]: r.id } },
    }));
    setAgregada(r.id);
  }

  return (
    <>
      <Cabecera
        etiqueta={`${RECETAS.length} recetas antiinflamatorias`}
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

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filtrar por comida">
        <Chip activo={!comida} onClick={() => setComida(null)}>
          Todas
        </Chip>
        {COMIDAS.map((c) => (
          <Chip key={c} activo={comida === c} onClick={() => setComida(comida === c ? null : c)}>
            {c}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Más filtros">
        <Chip activo={express} onClick={() => setExpress(!express)}>
          Express
        </Chip>
        <Chip activo={congelable} onClick={() => setCongelable(!congelable)}>
          Congelable
        </Chip>
        {SINTOMAS.map((s) => (
          <Chip key={s} activo={sintoma === s} onClick={() => setSintoma(sintoma === s ? null : s)}>
            {s}
          </Chip>
        ))}
      </div>

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
          {lista.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setAbierta(r)}
                className="flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
              >
                <Foto receta={r} className="h-28 w-full !rounded-none" />
                <span className="flex flex-1 flex-col p-3">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{r.comida}</span>
                  <span className="mt-1 min-h-12 text-base font-bold leading-snug">{r.nombre}</span>
                  <span className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-sm text-[var(--text-secondary)]">
                    {r.min} min
                    {r.min <= 15 && <Zap size={16} aria-label="Express" color="var(--mustard-ink)" />}
                    {r.congelable_dias ? <Snowflake size={16} aria-label="Congelable" color="var(--sky-ink)" /> : null}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <HojaReceta
        receta={abierta}
        onCerrar={cerrar}
        accion={
          abierta && (
            <button
              type="button"
              onClick={() => agregarAHoy(abierta)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)] [touch-action:manipulation]"
            >
              {agregada === abierta.id ? (
                <>
                  <Check size={20} aria-hidden="true" /> Agregada a tu {abierta.comida.toLowerCase()} de hoy
                </>
              ) : (
                <>
                  <Plus size={20} aria-hidden="true" /> Poner en mi {abierta.comida.toLowerCase()} de hoy
                </>
              )}
            </button>
          )
        }
      />
    </>
  );
}
