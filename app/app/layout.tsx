import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppShell } from '@/components/app/AppShell';

export const metadata: Metadata = {
  title: 'Mi Menú Calma — Cocina en Calma',
  robots: { index: false },
};

// Fotos reales disponibles (public/recetas/<id>.jpg): así no se piden archivos que no existen.
export default function LayoutApp({ children }: { children: ReactNode }) {
  const fotos = readdirSync(join(process.cwd(), 'public/recetas'))
    .filter((f) => f.endsWith('.jpg') && !f.endsWith('-s.jpg'))
    .map((f) => f.replace('.jpg', ''));
  // La guía en PDF vive en un bucket privado; /app/guia pide un enlace temporal solo a quien tiene acceso activo.
  const guia = '/app/guia';
  return (
    <AppShell fotos={fotos} guia={guia}>
      {children}
    </AppShell>
  );
}
