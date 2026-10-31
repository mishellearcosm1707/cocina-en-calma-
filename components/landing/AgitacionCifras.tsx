'use client';

// DESVIACIÓN DOCUMENTADA del kit (ver ESTADO.md): variante de §3 AGITACIÓN en mini-tarjetas con ícono y cifra,
// para que se ESCANEE (la guía de conversión pide cifras destacadas y no prosa). Conserva el fondo elevado y el
// "flush" con §2 (un solo movimiento visual). Solo cifras reales: las de decisiones salen del estudio del
// usuario (3-4 comidas al día) y su multiplicación (×365); no se inventa ningún monto de dinero ni de horas.

import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { IconChip, SectionShell, useReveal, VIEWPORT_ONCE, type TonoColor } from './ui';

import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

const COLORES: { tono: TonoColor; fondo: string }[] = [
  { tono: 'peach', fondo: 'var(--peach-wash)' },
  { tono: 'mustard', fondo: 'color-mix(in oklab, var(--mustard-soft) 45%, var(--surface))' },
  { tono: 'sky', fondo: 'color-mix(in oklab, var(--sky) 45%, var(--surface))' },
];

export interface CifraAgitacion {
  icon: LucideIcon;
  /** El dato héroe (display grande): "3 a 4", "+1.000". */
  cifra: string;
  /** 1 línea de contexto, máx 12 palabras. */
  textoMarked: string;
}

export interface AgitacionCifrasProps {
  /** Copy MARCADO del título (máx 8 palabras). */
  tituloMarked: string;
  /** 3 tarjetas. */
  cifras: CifraAgitacion[];
  id?: string;
}

export function AgitacionCifras({ tituloMarked, cifras, id }: AgitacionCifrasProps) {
  warnCopy('Agitación → título', tituloMarked, 8);
  warnRango('Agitación → cifras', cifras.length, 2, 4);
  cifras.forEach((c, i) => warnCopy(`Agitación → cifra ${i + 1}`, c.textoMarked, 12));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="elevada" flush="top" ariaLabel="El costo de seguir igual">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.h2
          variants={item}
          className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[34px]"
        >
          <MarkedCopy text={tituloMarked} />
        </motion.h2>
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {cifras.map((c, i) => (
            <motion.li
              key={i}
              variants={item}
              className="flex items-center gap-4 rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-1)] md:flex-col md:items-start"
              style={{ background: COLORES[i % COLORES.length].fondo }}
            >
              <IconChip icon={c.icon} tone={COLORES[i % COLORES.length].tono} />
              <div>
                <p className="text-[32px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                  {c.cifra}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-[var(--text-secondary)]">
                  <MarkedCopy text={c.textoMarked} />
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </SectionShell>
  );
}
