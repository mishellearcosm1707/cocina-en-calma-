'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, FileText, Trash2, UserX } from 'lucide-react';
import { leerConsentimientos, registrarConsentimiento, type Finalidad } from '@/lib/consentimiento';
import { CORREO_LEGAL } from '@/lib/legal';
import { cerrarSesion, useApp, borrarTodo } from '@/lib/semana';
import { supabaseNavegador } from '@/lib/supabase/navegador';

const PERMISOS: Array<[Finalidad, string, string]> = [
  ['novedades', 'Novedades y recetas por correo', 'Te escribimos de vez en cuando. Puedes apagarlo cuando quieras.'],
  ['analitica', 'Ayudar a mejorar la app (medir mi uso)', 'Cuenta qué partes usas, sin correo ni respuestas de salud.'],
];

/** Todo lo que la ley pide poder hacer con tus datos, en un solo lugar: ver permisos, descargarlos, borrarlos y eliminar la cuenta. */
export function Privacidad() {
  const app = useApp();
  const [permisos, setPermisos] = useState<Partial<Record<Finalidad, boolean>>>({});
  const [confirmar, setConfirmar] = useState<'datos' | 'cuenta' | null>(null);
  const [error, setError] = useState('');
  const [trabajando, setTrabajando] = useState(false);

  useEffect(() => {
    let vivo = true;
    void leerConsentimientos().then((p) => vivo && setPermisos(p));
    return () => {
      vivo = false;
    };
  }, []);

  async function cambiar(f: Finalidad, valor: boolean) {
    setPermisos((p) => ({ ...p, [f]: valor }));
    const ok = await registrarConsentimiento(f, valor, 'ajustes');
    if (!ok) {
      setPermisos((p) => ({ ...p, [f]: !valor }));
      setError('No pudimos guardar el cambio. Inténtalo de nuevo.');
    } else setError('');
  }

  async function descargar() {
    const sb = supabaseNavegador();
    const {
      data: { user },
    } = await sb.auth.getUser();
    const { data: consentimientos } = await sb.from('consentimientos').select('finalidad, otorgado, version_texto, origen, creado_en').order('creado_en');
    const contenido = {
      generado_en: new Date().toISOString(),
      cuenta: { correo: user?.email ?? null, creada: user?.created_at ?? null },
      perfil_y_datos_de_salud: app?.perfil ?? null,
      semanas: app?.semanas ?? null,
      chequeos: app?.chequeos ?? null,
      permisos: consentimientos ?? [],
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(contenido, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mis-datos-cocina-en-calma.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function eliminarCuenta() {
    setTrabajando(true);
    setError('');
    const r = await fetch('/api/cuenta', { method: 'DELETE' }).catch(() => null);
    if (!r || !r.ok) {
      setTrabajando(false);
      setError(r?.status === 409 ? 'Esta cuenta es la de administración y no se puede eliminar desde aquí.' : 'No pudimos eliminar la cuenta. Inténtalo de nuevo o escríbenos.');
      return;
    }
    await cerrarSesion();
    window.location.assign('/');
  }

  const enlace = 'flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--accent)]';

  return (
    <section aria-label="Privacidad" className="mx-5 mt-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
      <h2 className="text-lg font-bold [font-family:var(--font-display)]">Tu privacidad</h2>
      <p className="mt-1 text-base text-[var(--text-secondary)]">Tus datos de salud son tuyos: los usamos solo para armar tus menús y no los vendemos.</p>

      <ul className="mt-3 flex flex-col gap-3">
        {PERMISOS.map(([f, titulo, nota]) => (
          <li key={f}>
            <label className="flex min-h-12 cursor-pointer items-start gap-3">
              <input type="checkbox" checked={Boolean(permisos[f])} onChange={(e) => void cambiar(f, e.target.checked)} className="mt-1 size-6 shrink-0 accent-[var(--accent)]" />
              <span>
                <span className="block text-base font-semibold">{titulo}</span>
                <span className="block text-sm text-[var(--text-secondary)]">{nota}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-col">
        <button type="button" onClick={() => void descargar()} className={enlace}>
          <Download size={20} aria-hidden="true" /> Descargar mis datos
        </button>
        <Link href="/privacidad" className={enlace}>
          <FileText size={20} aria-hidden="true" /> Política de privacidad
        </Link>
        <Link href="/terminos" className={enlace}>
          <FileText size={20} aria-hidden="true" /> Términos de servicio
        </Link>
        <Link href="/reembolsos" className={enlace}>
          <FileText size={20} aria-hidden="true" /> Garantía y reembolsos
        </Link>
        <Link href="/aviso-salud" className={enlace}>
          <FileText size={20} aria-hidden="true" /> Aviso de salud
        </Link>
        <a href={`mailto:${CORREO_LEGAL}`} className={enlace}>
          <FileText size={20} aria-hidden="true" /> Contacto: {CORREO_LEGAL}
        </a>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-base font-semibold text-[var(--error)]">
          {error}
        </p>
      )}

      {confirmar === null ? (
        <div className="mt-2 flex flex-col">
          <button type="button" onClick={() => setConfirmar('datos')} className="flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--error)]">
            <Trash2 size={20} aria-hidden="true" /> Borrar mis datos y empezar de nuevo
          </button>
          <button type="button" onClick={() => setConfirmar('cuenta')} className="flex min-h-12 items-center gap-2 text-base font-semibold text-[var(--error)]">
            <UserX size={20} aria-hidden="true" /> Eliminar mi cuenta
          </button>
        </div>
      ) : (
        <div role="alert" className="mt-3 rounded-[var(--radius-button)] bg-[var(--peach)] p-3">
          <p className="text-base font-semibold text-[var(--peach-ink)]">
            {confirmar === 'datos'
              ? 'Se borran tu semana, tus chequeos y tus datos de salud, y vuelves a las preguntas de inicio. No se puede deshacer.'
              : 'Se elimina tu cuenta y todos tus datos de salud. Se conserva solo el registro de tu compra, que la ley nos pide guardar. No se puede deshacer.'}
          </p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              disabled={trabajando}
              onClick={() => (confirmar === 'datos' ? borrarTodo() : void eliminarCuenta())}
              className="min-h-12 flex-1 rounded-[var(--radius-button)] bg-[var(--error)] px-4 text-base font-bold text-[var(--bg)] disabled:opacity-60"
            >
              {trabajando ? 'Eliminando…' : confirmar === 'datos' ? 'Sí, borrar' : 'Sí, eliminar mi cuenta'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmar(null)}
              className="min-h-12 flex-1 rounded-[var(--radius-button)] border border-[var(--text-tertiary)] bg-[var(--surface)] px-4 text-base font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
