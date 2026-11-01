'use client';

import { useState } from 'react';
import { ChefHat, Refrigerator, Snowflake } from 'lucide-react';
import { opcionPrep, type Receta } from '@/lib/recetas';
import { DIAS, DIAS_CORTOS } from '@/lib/semana';

/** Días que se recomiendan para repetir la receta: repartidos dentro del tiempo que aguanta guardada. */
function sugeridos(base: number, comidas: number, ventana: number): number[] {
  const hasta = Math.min(6, base + ventana - 1);
  const dias = Array.from({ length: hasta - base + 1 }, (_, i) => base + i);
  if (dias.length <= comidas) return dias;
  return Array.from({ length: comidas }, (_, i) => dias[Math.round((i * (dias.length - 1)) / (comidas - 1))]);
}

/**
 * Al elegir una receta: ¿solo ese día o cocinarla una vez y repetirla (meal prep)?
 * La recomendación sale de cuántas porciones rinde y cuánto aguanta guardada.
 */
export function PlanificarPrep({
  receta,
  diaBase,
  soloTexto,
  ocupados,
  libre = false,
  onElegir,
}: {
  receta: Receta;
  diaBase: number;
  soloTexto: string;
  /** Días de la semana que ya tienen otra receta en esa comida (se reemplazan). */
  ocupados: Set<number>;
  /** Sin día de partida fijo: se puede elegir cualquier día de la semana. */
  libre?: boolean;
  onElegir: (dias: number[]) => void;
}) {
  const op = opcionPrep(receta);
  const [dias, setDias] = useState<number[]>(() => (op ? sugeridos(diaBase, op.comidas, op.ventana) : [diaBase]));
  const rinde = receta.porciones ?? 1;
  const primero = libre ? Math.min(...dias, diaBase) : diaBase;

  function alternar(d: number) {
    if (!libre && d === diaBase) return;
    setDias((a) => (a.includes(d) ? a.filter((x) => x !== d) : [...a, d].sort((x, y) => x - y)));
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => onElegir([diaBase])}
        className="flex min-h-14 w-full items-center justify-center rounded-[var(--radius-button)] border border-[var(--accent)] bg-[var(--surface)] px-4 text-base font-bold text-[var(--accent)] [touch-action:manipulation]"
      >
        {soloTexto}
      </button>

      {op ? (
        <div className="rounded-[var(--radius-card)] bg-[var(--olive-wash)] p-4">
          <p className="flex items-center gap-2 text-lg font-bold [font-family:var(--font-display)]">
            <ChefHat size={20} color="var(--accent)" aria-hidden="true" /> Hazla con meal prep
          </p>
          <p className="mt-1 text-base text-[var(--text-secondary)]">
            Rinde {rinde} {rinde === 1 ? 'porción' : 'porciones'}. Cocínala una vez y cómela hasta {op.comidas} veces
            {op.duplicar ? ` (duplica las cantidades para que alcance)` : ''}.
          </p>
          <p
            className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
              op.guardar === 'nevera' ? 'bg-[var(--mustard-soft)] text-[var(--mustard-ink)]' : 'bg-[var(--sky)] text-[var(--sky-ink)]'
            }`}
          >
            {op.guardar === 'nevera' ? (
              <>
                <Refrigerator size={16} aria-hidden="true" /> Aguanta {receta.nevera_dias} días en la nevera
              </>
            ) : (
              <>
                <Snowflake size={16} aria-hidden="true" /> Congélala: dura {receta.congelable_dias} días
              </>
            )}
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--text-secondary)]">¿Qué días la comes?</p>
          <div role="group" aria-label="Días en que la comes" className="mt-2 grid grid-cols-7 gap-1">
            {DIAS_CORTOS.map((l, d) => {
              const activo = dias.includes(d);
              const fuera = libre
                ? op.guardar === 'nevera' && !activo && (d > primero + op.ventana - 1 || d < Math.max(...dias) - op.ventana + 1)
                : d < diaBase || (op.guardar === 'nevera' && d > diaBase + op.ventana - 1);
              return (
                <button
                  key={d}
                  type="button"
                  disabled={fuera}
                  aria-pressed={activo}
                  aria-label={DIAS[d]}
                  onClick={() => alternar(d)}
                  className={`flex min-h-11 flex-col items-center justify-center rounded-full border text-base font-bold [touch-action:manipulation] ${
                    activo
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
                      : 'border-[var(--surface-2)] bg-[var(--surface)] text-[var(--text-primary)]'
                  } disabled:opacity-35`}
                >
                  {l}
                </button>
              );
            })}
          </div>
          {dias.some((d) => d !== diaBase && ocupados.has(d)) && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Reemplaza lo que ya tenías en los días que elijas.</p>
          )}
          <button
            type="button"
            disabled={dias.length < 2}
            onClick={() => onElegir(dias)}
            className="mt-3 flex min-h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-base font-bold text-[var(--bg)] shadow-[var(--shadow-2)] disabled:bg-[var(--surface-2)] disabled:text-[var(--text-secondary)] disabled:shadow-none [touch-action:manipulation]"
          >
            {dias.length < 2 ? 'Elige al menos otro día' : `Planificar ${dias.length} comidas`}
          </button>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">Esta receta se come mejor recién hecha, por eso no la recomendamos para meal prep.</p>
      )}
    </div>
  );
}
