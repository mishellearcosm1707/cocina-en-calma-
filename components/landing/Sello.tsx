'use client';

// Dispositivo firma de Cocina en Calma: sello circular con texto en el borde y escudo al centro, ligeramente
// girado. Se repite en la garantía de la landing y en la pantalla de planes (una firma de serie, no un adorno suelto).

import { useId } from 'react';

export function Sello({
  texto = 'GARANTÍA CALMA · 7 DÍAS · SIN PREGUNTAS ·',
  tamano = 112,
  giro = -8,
  fuente = 9,
  className = '',
}: {
  texto?: string;
  tamano?: number;
  giro?: number;
  fuente?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      width={tamano}
      height={tamano}
      className={className}
      style={{ transform: `rotate(${giro}deg)` }}
    >
      <defs>
        <path id={id} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="var(--accent)" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="var(--accent-on-dark)" strokeWidth="1.2" strokeDasharray="2 3" />
      <text fill="var(--bg)" fontSize={fuente} fontWeight="700" style={{ fontFamily: 'var(--font-body)' }}>
        <textPath href={`#${id}`} startOffset="0" textLength="272" lengthAdjust="spacing">
          {texto}
        </textPath>
      </text>
      <g
        transform="translate(44 44)"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 2 L30 7 V17 C30 25 24 30 16 33 C8 30 2 25 2 17 V7 Z" />
        <path d="M10 17 l4 4 8 -8" />
      </g>
    </svg>
  );
}
