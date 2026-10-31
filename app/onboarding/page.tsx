import type { Metadata } from 'next';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { FlowCliente } from '@/components/onboarding/FlowCliente';

export const metadata: Metadata = {
  title: 'Tu primer menú — Cocina en Calma',
  description: 'Cuéntanos cómo te sientes y qué tienes en casa: armamos tu menú de hoy.',
};

// Fotos reales disponibles (public/recetas/<id>.jpg): así no se piden archivos que no existen.
export default function Onboarding() {
  const fotos = readdirSync(join(process.cwd(), 'public/recetas'))
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => f.replace('.jpg', ''));
  return <FlowCliente fotos={fotos} />;
}
