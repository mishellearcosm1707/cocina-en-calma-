import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata = { title: 'No encontramos esa página — Cocina en Calma', robots: { index: false } };

export default function NoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 bg-[var(--bg)] px-5 text-center text-[var(--text-primary)] [font-family:var(--font-body)]">
      <Logo alto={64} />
      <h1 className="text-3xl font-bold [font-family:var(--font-display)]">No encontramos esa página</h1>
      <p className="text-base text-[var(--text-secondary)]">Puede que el enlace esté mal escrito o que ya no exista.</p>
      <Link href="/" className="flex min-h-14 items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] px-6 text-base font-bold text-[var(--bg)]">
        Volver al inicio
      </Link>
    </main>
  );
}
