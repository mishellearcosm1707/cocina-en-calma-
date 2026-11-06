// Registro de uso ANÓNIMO para el panel de la dueña: sin correo, sin nombre y sin respuestas de salud.
// Solo cuenta cosas como "alguien llegó al paso 5". Se envía a /api/eventos, que solo acepta una lista cerrada de eventos.

const CLAVE_SESION = 'cec-sesion-v1'; // en sessionStorage: se borra al cerrar la pestaña, no sigue a la persona entre visitas

/** Identificador aleatorio de ESTA visita (no identifica a la persona ni dura más que la pestaña). */
function sesion(): string | undefined {
  try {
    let s = window.sessionStorage.getItem(CLAVE_SESION);
    if (!s) {
      s = crypto.randomUUID();
      window.sessionStorage.setItem(CLAVE_SESION, s);
    }
    return s;
  } catch {
    return undefined;
  }
}

function enviar(cuerpo: Record<string, unknown>) {
  try {
    void fetch('/api/eventos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...cuerpo, sesion: sesion() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* el registro nunca debe romper la app */
  }
}

export function registrarEvento(evento: string, props?: Record<string, string | number>) {
  enviar({ tipo: 'evento', evento, props });
}

export function registrarError(mensaje: string, pantalla: string) {
  enviar({ tipo: 'error', mensaje, pantalla });
}

/** Ejecuta `fn` como máximo una vez por día en este navegador (por ejemplo "sesión iniciada"). */
export function unaVezPorDia(clave: string, fn: () => void) {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const k = `cec-dia-${clave}`;
    if (window.localStorage.getItem(k) === hoy) return;
    window.localStorage.setItem(k, hoy);
  } catch {
    return;
  }
  fn();
}
