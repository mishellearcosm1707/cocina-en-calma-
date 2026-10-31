'use client';

import { useState } from 'react';
import { emojiDe, type Comida, type Receta } from '@/lib/recetas';

// Fondo de apoyo por comida, derivado de los tokens (sin hex). Se muestra solo mientras la receta
// no tiene su foto real en public/recetas/<id>.jpg (ver docs/fotos/guia-de-fotos.md).
const FONDO: Record<Comida, string> = {
  Desayuno: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-2) 22%, var(--surface)), var(--surface-2))',
  Almuerzo: 'linear-gradient(135deg, color-mix(in oklab, var(--accent) 22%, var(--surface)), var(--surface-2))',
  Merienda: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-2) 32%, var(--surface)), var(--surface-2))',
  Cena: 'linear-gradient(135deg, color-mix(in oklab, var(--accent) 34%, var(--surface)), var(--surface-2))',
};

export function FotoReceta({
  receta,
  className = '',
  conFoto = false,
}: {
  receta: Receta;
  className?: string;
  conFoto?: boolean;
}) {
  const [falla, setFalla] = useState(false);
  const sinFoto = !conFoto || falla;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: FONDO[receta.comida] }}
    >
      {!sinFoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/recetas/${receta.id}.jpg`}
          alt={receta.nombre}
          loading="lazy"
          onError={() => setFalla(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {sinFoto && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl">
          {emojiDe(receta)}
        </span>
      )}
      <span className="absolute left-2 top-2 rounded-full bg-[var(--surface)] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
        {receta.comida}
      </span>
    </div>
  );
}
