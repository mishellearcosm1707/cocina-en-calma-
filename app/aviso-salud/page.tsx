import Link from 'next/link';
import { CORREO_LEGAL } from '@/lib/legal';

export const metadata = { title: 'Aviso de salud — Cocina en Calma' };

export default function AvisoSalud() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-base leading-relaxed">
      <Link href="/" className="text-sm text-[var(--accent)] underline underline-offset-4">
        ← Volver
      </Link>
      <h1 className="mb-1 mt-4 text-3xl font-bold [font-family:var(--font-display)]">Aviso de salud</h1>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">Versión 1.0 · Última actualización: 6 de noviembre de 2026</p>
      <p className="my-3">
        Cocina en Calma ofrece <b>orientación nutricional general</b>. No es un servicio médico, no diagnostica ni trata enfermedades y no
        reemplaza a tu médico o nutricionista. Las calorías y los nutrientes son <b>estimaciones orientativas</b>, calculadas con fórmulas
        conocidas. La app no usa inteligencia artificial para decidir sobre tu salud.
      </p>
      <p className="my-3">
        <b>Tú decides</b> cómo usar esta información y eres responsable de consultar a un profesional si tienes una condición de salud,
        tomas medicamentos o notas síntomas que te preocupan. Si una receta te cae mal, deja de usarla y consulta a tu profesional.
      </p>
      <p className="my-3">
        No uses esta app para decidir tu alimentación si estás <b>embarazada o en lactancia</b>, tienes <b>diabetes</b>, enfermedad{' '}
        <b>renal o hepática</b>, <b>alergias graves</b>, o has tenido un <b>trastorno de la conducta alimentaria</b>. En esos casos consulta
        primero a tu profesional de salud.
      </p>
      <p className="my-3">Cocina en Calma es solo para personas mayores de 18 años.</p>
      <p className="my-3">
        Más información: <Link href="/privacidad" className="text-[var(--accent)] underline underline-offset-4">Política de privacidad</Link> ·{' '}
        <Link href="/terminos" className="text-[var(--accent)] underline underline-offset-4">Términos de servicio</Link> · Contacto: {CORREO_LEGAL}
      </p>
    </main>
  );
}
