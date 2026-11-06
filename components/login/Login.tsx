'use client';

// PANTALLA DE ACCESO (etapa 4 de la secuencia maestra, doctrina 50 §E + 26): enlace mágico por correo como método
// principal (el comprador de Hotmart entra con el correo de su compra) y Google como alternativa. Sin contraseñas.
// Mientras no haya servicios externos conectados NO se envía ningún correo ni se abre ninguna cuenta: el flujo se
// simula con estado local y la pantalla lo dice (mockup honesto, 50 §C3ter). Anti-enumeración: el mensaje de
// "enviado" es el mismo exista o no el correo.

import { Logo } from '@/components/Logo';
import { supabaseEnlace } from '@/lib/supabase/navegador';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowLeft, ArrowRight, CircleCheck, Loader2, MailCheck } from 'lucide-react';
import { Sello } from '@/components/landing/Sello';

const EASE = [0.16, 1, 0.3, 1] as const;
const ENTRA = { oculto: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const ESPERA = 60;
const CORREO_OK = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

type Estado = 'inicio' | 'enviando' | 'enviado';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState<Estado>('inicio');
  const [error, setError] = useState('');
  const [espera, setEspera] = useState(0);
  const [reenviado, setReenviado] = useState(false);

  useEffect(() => {
    if (espera <= 0) return;
    const t = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [espera]);

  async function enviar() {
    if (estado === 'enviando') return;
    if (!CORREO_OK.test(correo.trim())) {
      setError('Revisa tu correo: parece que le falta algo, por ejemplo tu@correo.com.');
      return;
    }
    setError('');
    setEstado('enviando');
    const { error: falla } = await supabaseEnlace().auth.signInWithOtp({
      email: correo.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/entrar` },
    });
    if (falla) {
      setEstado('inicio');
      setError(
        falla.status === 429
          ? 'Pediste muchos enlaces seguidos. Espera un minuto y vuelve a intentar.'
          : 'No pudimos enviar el enlace ahora. Revisa tu conexión e inténtalo de nuevo.',
      );
      return;
    }
    setEstado('enviado');
    setEspera(ESPERA);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96"
          style={{
            background:
              'radial-gradient(420px 300px at 0% 0%, var(--peach) 0%, transparent 70%), radial-gradient(380px 280px at 100% 10%, var(--mustard-soft) 0%, transparent 68%)',
          }}
        />
        <motion.main
          initial="oculto"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8"
        >
          <motion.div variants={ENTRA} className="flex h-14 items-center justify-between">
            <Link href="/" className="flex min-h-11 items-center gap-2 text-base font-semibold">
              <Logo alto={32} />
              Cocina en Calma
            </Link>
            <Link href="/paywall" className="flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--text-secondary)]">
              <ArrowLeft size={18} aria-hidden="true" /> Volver
            </Link>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            {estado !== 'enviado' ? (
              <motion.section
                key="form"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="mt-6 flex flex-col gap-5"
              >
                <motion.div variants={ENTRA} className="flex items-center justify-between gap-4">
                  <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                    Entra a tu <span className="text-[var(--accent)]">Menú Calma</span>
                  </h1>
                  <Sello tamano={96} giro={10} fuente={12} texto="SIN CONTRASEÑA · UN SOLO USO ·" className="shrink-0" />
                </motion.div>
                <motion.p variants={ENTRA} className="text-base leading-relaxed text-[var(--text-secondary)]">
                  Usa el correo de tu compra en Hotmart. Así guardas tu semana y la ves en cualquier celular.
                </motion.p>

                <motion.form
                  variants={ENTRA}
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    enviar();
                  }}
                  className="flex flex-col gap-3"
                >
                  <label htmlFor="correo" className="text-sm text-[var(--text-secondary)]">
                    Tu correo
                  </label>
                  <input
                    id="correo"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      setError('');
                    }}
                    placeholder="tu@correo.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'error-acceso' : undefined}
                    className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      error ? 'border-[var(--error)]' : 'border-[var(--surface-2)]'
                    }`}
                  />
                  <p className="text-sm text-[var(--text-secondary)]">Te llega un enlace a este correo. Usa el mismo con el que compraste en Hotmart.</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Al entrar aceptas los{' '}
                    <a href="/terminos" className="font-semibold underline underline-offset-4">
                      Términos
                    </a>{' '}
                    y la{' '}
                    <a href="/privacidad" className="font-semibold underline underline-offset-4">
                      Política de privacidad
                    </a>
                    .
                  </p>
                  {error && (
                    <p id="error-acceso" role="alert" className="text-sm text-[var(--error)]">
                      {error}
                    </p>
                  )}
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    aria-busy={estado === 'enviando'}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-base font-bold text-[var(--bg)] shadow-[0_10px_24px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent)] [touch-action:manipulation]"
                  >
                    {estado === 'enviando' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                        Enviando tu enlace…
                      </>
                    ) : (
                      <>
                        Enviarme mi enlace de acceso
                        <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-sm text-[var(--text-secondary)]">Entrar con Google llegará pronto.</p>
                </motion.form>

                <motion.ol variants={ENTRA} className="mt-2 flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
                  {['Escribes tu correo', 'Te llega un enlace', 'Lo tocas y entras a tu semana'].map((t, n) => (
                    <li key={t} className="flex items-center gap-3 text-base">
                      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--olive-wash)] text-sm font-bold text-[var(--accent)]">
                        {n + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </motion.ol>
              </motion.section>
            ) : (
              <motion.section
                key="enviado"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mt-6 flex flex-col gap-5"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 15, delay: 0.1 }}
                  aria-hidden="true"
                  className="flex size-16 items-center justify-center rounded-full bg-[var(--peach)]"
                >
                  <MailCheck size={32} strokeWidth={1.9} color="var(--peach-ink)" />
                </motion.span>
                <h1 className="text-balance text-3xl font-bold leading-tight [font-family:var(--font-display)]">
                  Revisa tu <span className="text-[var(--accent)]">correo</span>
                </h1>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  Si <b className="font-semibold text-[var(--text-primary)]">{correo.trim()}</b> tiene un Menú Calma, te
                  llegará un enlace para entrar. Revisa también tu carpeta de correo no deseado.
                </p>
                <ol className="flex flex-col gap-3 text-base">
                  {['Abre el correo que te enviamos', 'Toca el botón de acceso', 'Listo: entras a tu Menú Calma'].map((t, n) => (
                    <li key={t} className="flex items-center gap-3">
                      <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--olive-wash)] text-sm font-bold text-[var(--accent)]">
                        {n + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  disabled={espera > 0}
                  onClick={() => {
                    setEspera(ESPERA);
                    setReenviado(true);
                    void supabaseEnlace().auth.signInWithOtp({
                      email: correo.trim(),
                      options: { emailRedirectTo: `${window.location.origin}/auth/entrar` },
                    });
                  }}
                  className="min-h-12 self-start rounded-[var(--radius-button)] border border-[var(--accent)] px-5 text-base font-semibold text-[var(--accent)] disabled:border-[var(--surface-2)] disabled:text-[var(--text-secondary)]"
                >
                  {espera > 0 ? `Reenviar en ${espera} s` : 'Reenviar enlace'}
                </button>
                {reenviado && (
                  <p role="status" className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                    <CircleCheck size={18} aria-hidden="true" /> Enlace reenviado
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEstado('inicio');
                    setReenviado(false);
                  }}
                  className="min-h-11 self-start text-base font-semibold text-[var(--text-secondary)] underline underline-offset-4"
                >
                  Usar otro correo
                </button>
              </motion.section>
            )}
          </AnimatePresence>

          <motion.p variants={ENTRA} className="mt-auto pt-8 text-center text-sm text-[var(--text-secondary)]">
            ¿Todavía no tienes tu Menú Calma?{' '}
            <Link href="/onboarding" className="font-semibold text-[var(--accent)] underline underline-offset-4">
              Arma tu menú gratis
            </Link>
          </motion.p>
        </motion.main>
      </div>
    </MotionConfig>
  );
}
