'use client';

import { supabaseNavegador } from '@/lib/supabase/navegador';
import { VERSION_LEGAL } from '@/lib/legal';

export type Finalidad = 'terminos_privacidad' | 'datos_salud' | 'novedades' | 'analitica';

async function huella(correo: string): Promise<string> {
  const bytes = new TextEncoder().encode(correo.trim().toLowerCase());
  const h = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Guarda una decisión de la persona (otorgar o retirar). Cada decisión es una fila nueva; nada se edita. */
export async function registrarConsentimiento(finalidad: Finalidad, otorgado: boolean, origen: 'onboarding' | 'ajustes'): Promise<boolean> {
  const sb = supabaseNavegador();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return false;
  const { error } = await sb.from('consentimientos').insert({
    user_id: user.id,
    correo_hash: await huella(user.email),
    finalidad,
    otorgado,
    version_texto: VERSION_LEGAL,
    origen,
    idioma: 'es',
  });
  return !error;
}

/** Lo vigente por finalidad (la decisión más reciente de cada una). */
export async function leerConsentimientos(): Promise<Partial<Record<Finalidad, boolean>>> {
  const { data } = await supabaseNavegador().from('consentimientos').select('finalidad, otorgado, creado_en').order('creado_en', { ascending: false });
  const r: Partial<Record<Finalidad, boolean>> = {};
  for (const f of (data ?? []) as Array<{ finalidad: Finalidad; otorgado: boolean }>) if (!(f.finalidad in r)) r[f.finalidad] = f.otorgado;
  return r;
}
