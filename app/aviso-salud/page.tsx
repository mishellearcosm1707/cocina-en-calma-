export const metadata = { title: 'Aviso de salud — Cocina en Calma' };

// Texto de docs/legal/consentimiento-y-deslinde.md §B. BORRADOR pendiente de revisión de abogado.
export default function AvisoSalud() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-base leading-relaxed">
      <a href="/" className="text-sm text-[var(--accent)] underline underline-offset-4">
        ← Volver
      </a>
      <h1 className="mb-4 mt-4 text-3xl font-bold [font-family:var(--font-display)]">Aviso de salud</h1>
      <p className="my-3">
        Cocina en Calma ofrece orientación nutricional general. No diagnostica ni trata enfermedades y no reemplaza a tu
        médico o nutricionista.
      </p>
      <p className="my-3">
        No uses esta app para decidir tu alimentación si estás embarazada o en lactancia, tienes diabetes, enfermedad renal
        o hepática, alergias graves, o has tenido un trastorno de la conducta alimentaria. En esos casos consulta primero a
        tu profesional de salud.
      </p>
      <p className="my-3">Cocina en Calma es solo para personas mayores de 18 años.</p>
    </main>
  );
}
