'use client';

// DESVIACIÓN DOCUMENTADA del kit (ver ESTADO.md): variante de §6 OFERTA para PAGO ÚNICO.
// El kit trae Oferta con dos planes (anual/mensual) + trial; la decisión del usuario
// (2026-10-31, FICHA-MERCADO §1) es un solo pago sin suscripción ni trial. Se conserva todo
// lo demás de Oferta: hairline degradada en la card, checkmarks custom, precio con unidad
// y ancla al lado (nunca desnudo), CTA vivo y reveal una sola vez.

import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { CheckCustom, CtaButton, Hairline, Kicker, SectionShell, useReveal, VIEWPORT_ONCE } from './ui';
import { MarkedCopy, warnCopy, warnRango } from './MarkedCopy';

export interface OfertaUnicaProps {
  kicker?: string;
  /** Copy MARCADO del título (máx 8 palabras). */
  tituloMarked: string;
  plan: {
    nombre: string;
    /** "$14.99" */
    precio: string;
    /** "pago único" */
    sufijo: string;
    /** Unidad chica junto al precio ("menos de $0.05 al día si la usas un año"). */
    descomposicionDia: string;
    /** Ancla externa conocida ("Una sola consulta con nutricionista cuesta más"). */
    ancla: string;
    /** 4-6 features en lenguaje de RESULTADO, máx 12 palabras c/u. */
    features: string[];
    ctaLabel: string;
    ctaHref: string;
    /** Pegado al botón: reduce riesgo sin nombrar miedos (52 §4). */
    microcopyCta: string;
  };
  id?: string;
}

/** El precio cuenta de $0.00 a su valor al entrar en pantalla (conteo animado del número héroe). */
function PrecioConteo({ precio }: { precio: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: '-10%' });
  const reducir = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    const valor = parseFloat(precio.replace(/[^0-9.]/g, ''));
    if (!el || !visto || reducir || Number.isNaN(valor)) return;
    const simbolo = precio.replace(/[0-9.,]/g, '');
    const ctl = animate(0, valor, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = simbolo + v.toFixed(2);
      },
    });
    return () => ctl.stop();
  }, [visto, reducir, precio]);
  return <span ref={ref}>{precio}</span>;
}

export function OfertaUnica({ kicker = 'LA OFERTA', tituloMarked, plan, id = 'oferta' }: OfertaUnicaProps) {
  warnCopy('Oferta → título', tituloMarked, 8);
  warnRango('Oferta → features', plan.features.length, 4, 6);
  plan.features.forEach((f, i) => warnCopy(`Oferta → feature ${i + 1}`, f, 12));
  const { contenedor, item } = useReveal();

  return (
    <SectionShell id={id} elevacion="base" ariaLabel="Precio" className="bg-[var(--peach-wash)]">
      <motion.div variants={contenedor} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
        <motion.div variants={item} className="mx-auto max-w-[620px] text-center">
          <Kicker>{kicker}</Kicker>
          <h2 className="text-balance text-[30px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)] md:text-[40px]">
            <MarkedCopy text={tituloMarked} />
          </h2>
        </motion.div>

        <motion.div variants={item} className="mx-auto mt-10 max-w-md">
          <Hairline emphasis surface="surface" className="shadow-[0_12px_36px_color-mix(in_oklab,var(--accent)_16%,transparent)]">
            <div className="rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent)_5%,transparent)] p-6 md:p-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">{plan.nombre}</h3>
                <span className="rounded-full bg-[var(--mustard)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-primary)]">
                  {plan.sufijo}
                </span>
              </div>
              <div className="mt-4">
                <p className="flex items-baseline gap-2">
                  <span className="text-[36px] font-bold leading-none tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
                    <PrecioConteo precio={plan.precio} />
                  </span>
                  <span className="text-[15px] font-semibold text-[var(--accent)]">{plan.sufijo}</span>
                </p>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{plan.descomposicionDia}</p>
                <p className="mt-2 text-[14px] text-[var(--text-secondary)]">{plan.ancla}</p>
              </div>
              <ul className="mt-5 flex flex-col gap-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
                    <CheckCustom />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CtaButton href={plan.ctaHref} fullMobile>
                  {plan.ctaLabel}
                </CtaButton>
                <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">{plan.microcopyCta}</p>
              </div>
            </div>
          </Hairline>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
