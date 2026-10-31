import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = { title: 'Política de Privacidad — Cocina en Calma' };

// Fuente: docs/legal/politica-de-privacidad.md (BORRADOR: falta correo/dirección y revisión de abogado).
// Se omite el bloque de notas internas (primera cita) y no se publica en producción hasta resolver [PENDIENTE].
export default function Privacidad() {
  const raw = readFileSync(join(process.cwd(), 'docs/legal/politica-de-privacidad.md'), 'utf8');
  const texto = raw.replace(/^>.*\n/gm, '');
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-base leading-relaxed [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:[font-family:var(--font-display)] [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:my-3 [&_table]:my-4 [&_table]:w-full [&_td]:border [&_td]:border-[var(--surface-2)] [&_td]:p-2 [&_th]:border [&_th]:border-[var(--surface-2)] [&_th]:p-2 [&_th]:text-left">
      <a href="/" className="text-sm text-[var(--accent)] underline underline-offset-4">
        ← Volver
      </a>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{texto}</ReactMarkdown>
    </main>
  );
}
