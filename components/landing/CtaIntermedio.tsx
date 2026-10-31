'use client';

// Botón principal repetido a lo largo del scroll (tras el mecanismo y tras la garantía): quien ya está listo
// avanza sin buscar. Mismo verbo y mismo destino que el hero (CTA consistente). Microcopy pegado al botón:
// reduce el riesgo sin nombrar miedos (52 §4).

import { motion } from 'motion/react';
import { CtaButton, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';

export function CtaIntermedio({
  href,
  label,
  microcopy,
  elevacion = 'base',
}: {
  href: string;
  label: string;
  microcopy: string;
  elevacion?: 'base' | 'elevada';
}) {
  const { contenedor, item } = useReveal();
  return (
    <SectionShell elevacion={elevacion} compacta ariaLabel="Empieza gratis">
      <motion.div
        variants={contenedor}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto flex max-w-[420px] flex-col items-center text-center"
      >
        <motion.div variants={item} className="w-full">
          <CtaButton href={href}>{label}</CtaButton>
        </motion.div>
        <motion.p variants={item} className="mt-3 text-[13px] text-[var(--text-secondary)]">
          {microcopy}
        </motion.p>
      </motion.div>
    </SectionShell>
  );
}
