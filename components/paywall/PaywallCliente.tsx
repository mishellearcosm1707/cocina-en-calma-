'use client';

import dynamic from 'next/dynamic';

// La pantalla lee el progreso de sessionStorage al nacer, así que se dibuja solo en el navegador.
const Paywall = dynamic(() => import('./Paywall').then((m) => m.Paywall), { ssr: false });

export function PaywallCliente({ fotos }: { fotos: string[] }) {
  return <Paywall fotos={fotos} />;
}
