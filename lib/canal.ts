// De dónde llegó la persona (por ejemplo ?src=ads_meta en el enlace de un anuncio). Se recuerda mientras dure la pestaña y se
// manda a Hotmart al comprar, para que el panel sepa qué canal trae clientas. Es solo el nombre del canal, nada de la persona.

const CLAVE = 'cec-canal-v1';

/** Si la dirección trae ?src=, lo guarda (solo letras, números, guion y guion bajo; máximo 40 caracteres). */
export function guardarCanalDeLaDireccion(): void {
  try {
    const src = new URLSearchParams(window.location.search).get('src');
    const limpio = src?.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
    if (limpio) window.sessionStorage.setItem(CLAVE, limpio);
  } catch {
    /* sin almacenamiento: la compra queda como "organico" */
  }
}

export function canalActual(): string {
  try {
    return window.sessionStorage.getItem(CLAVE) || 'organico';
  } catch {
    return 'organico';
  }
}

/** Agrega el canal al enlace de pago de Hotmart (el enlace ya puede traer parámetros). */
export function enlaceDePago(base: string): string {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}src=${encodeURIComponent(canalActual())}`;
}
