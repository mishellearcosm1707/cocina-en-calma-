'use client';

import dynamic from 'next/dynamic';

// El recorrido lee su progreso de sessionStorage al nacer, así que se dibuja solo en el navegador.
const Flow = dynamic(() => import('./Flow').then((m) => m.Flow), { ssr: false });

export function FlowCliente({ fotos }: { fotos: string[] }) {
  return <Flow fotos={fotos} />;
}
