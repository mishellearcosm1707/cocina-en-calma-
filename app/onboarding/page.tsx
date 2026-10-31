// Marcador de la ETAPA 2 (onboarding). La ruta existe para que el CTA de la landing no lleve a una
// página muerta; el onboarding real se construye en la siguiente etapa (ver ESTADO.md).

export default function OnboardingPendiente() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">Próxima etapa</p>
      <h1 className="text-3xl font-bold leading-tight [font-family:var(--font-display)]">Aquí empezará tu <span className="text-[var(--accent)]">menú de hoy</span></h1>
      <p className="text-base text-[var(--text-secondary)]">
        El onboarding (tus datos, cómo te sientes y 3 ingredientes) es la siguiente pantalla que construimos.
      </p>
      <a href="/" className="text-base font-semibold text-[var(--accent)] underline underline-offset-4">
        Volver al inicio
      </a>
    </main>
  );
}
