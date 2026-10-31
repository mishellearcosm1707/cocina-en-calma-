// Marcador de la ETAPA 3 (pantalla de planes). Existe para que el botón del primer menú no lleve a una página
// muerta; la pantalla real se construye en la siguiente etapa (ver ESTADO.md).

export default function PaywallPendiente() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Próxima etapa</p>
      <h1 className="text-3xl font-bold leading-tight [font-family:var(--font-display)]">
        Aquí verás tu <span className="text-[var(--accent)]">plan completo</span>
      </h1>
      <p className="text-base text-[var(--text-secondary)]">
        La pantalla de planes y el pago único de $14.99 son la siguiente pantalla que construimos.
      </p>
      <a href="/onboarding" className="text-base font-semibold text-[var(--accent)] underline underline-offset-4">
        Volver a mi menú
      </a>
    </main>
  );
}
