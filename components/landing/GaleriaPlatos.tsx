'use client';

// Franja de platos de la propia app: da vida y color con comida real (imágenes ilustrativas, se avisa en el pie).

import { motion } from 'motion/react';
import { Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

const PLATOS: { src: string; nombre: string; giro: string; fondo: string }[] = [
  { src: '/recetas/d01.jpg', nombre: 'Avena nocturna con papaya', giro: '-2deg', fondo: 'var(--peach)' },
  { src: '/recetas/c07.jpg', nombre: 'Crema de zucchini con huevo', giro: '1.5deg', fondo: 'var(--mustard-soft)' },
  { src: '/recetas/a02.jpg', nombre: 'Bowl de quinoa y pollo', giro: '-1deg', fondo: 'var(--sky)' },
  { src: '/recetas/m01.jpg', nombre: 'Kéfir con piña y menta', giro: '2deg', fondo: 'var(--olive-wash)' },
];

export function GaleriaPlatos({ tituloMarked, kicker }: { tituloMarked?: string; kicker: string }) {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell elevacion="base" ariaLabel="Platos del menú" className="bg-[var(--peach-wash)]">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[680px] text-center">
          <Kicker>{kicker}</Kicker>
          {tituloMarked && (
            <h2 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[34px]">
              {tituloMarked}
            </h2>
          )}
        </motion.div>
        <ul className="mx-auto mt-8 grid max-w-[900px] grid-cols-2 gap-4 md:grid-cols-4">
          {PLATOS.map((p) => (
            <motion.li
              key={p.src}
              variants={item}
              className="rounded-[var(--radius-card)] p-2 shadow-[var(--shadow-1)]"
              style={{ background: p.fondo, transform: `rotate(${p.giro})` }}
            >
              <img src={p.src} alt={p.nombre} loading="lazy" className="aspect-square w-full rounded-[calc(var(--radius-card)-6px)] object-cover" />
              <p className="px-1 pb-1 pt-2 text-center text-[13px] font-semibold leading-tight text-[var(--text-primary)]">{p.nombre}</p>
            </motion.li>
          ))}
        </ul>
        <p className="mt-6 text-center text-[13px] text-[var(--text-secondary)]">Imágenes ilustrativas de los platos</p>
      </motion.div>
    </SectionShell>
  );
}
