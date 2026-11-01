import Image from 'next/image';

/** Logo de Cocina en Calma (public/logo.png, fondo transparente). `alto` en píxeles; el ancho sigue la proporción 640:595. */
export function Logo({ alto = 32, className = '', prioridad = false }: { alto?: number; className?: string; prioridad?: boolean }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={Math.round((alto * 640) / 595)}
      height={alto}
      priority={prioridad}
      className={`shrink-0 ${className}`}
      style={{ height: alto, width: 'auto' }}
    />
  );
}
