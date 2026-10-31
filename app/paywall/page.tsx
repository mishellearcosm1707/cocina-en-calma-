import type { Metadata } from 'next';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PaywallCliente } from '@/components/paywall/PaywallCliente';

export const metadata: Metadata = {
  title: 'Tu semana completa — Cocina en Calma',
  description: 'Desbloquea tu semana completa de menús, meal prep y lista de compras con un solo pago de $14.99.',
};

// Fotos reales disponibles (public/recetas/<id>.jpg), igual que en el recorrido de inicio.
export default function Paywall() {
  const fotos = readdirSync(join(process.cwd(), 'public/recetas'))
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => f.replace('.jpg', ''));
  return <PaywallCliente fotos={fotos} />;
}
