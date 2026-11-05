import crypto from 'node:crypto';

/** Compara el hottok recibido con el esperado en tiempo constante (se comparan hashes para no filtrar la longitud). */
export function hottokValido(recibido: string | null | undefined, esperado: string | undefined): boolean {
  if (!recibido || !esperado) return false;
  const a = crypto.createHash('sha256').update(recibido).digest();
  const b = crypto.createHash('sha256').update(esperado).digest();
  return crypto.timingSafeEqual(a, b);
}

export type EstadoAcceso = 'activo' | 'reembolsado' | 'cancelado';

/** Qué le pasa al acceso según el evento de Hotmart (pago único). Eventos que no cambian el acceso → null. */
export function estadoDeEvento(evento: string | undefined): EstadoAcceso | null {
  switch (evento) {
    case 'PURCHASE_APPROVED':
    case 'PURCHASE_COMPLETE':
      return 'activo';
    case 'PURCHASE_REFUNDED':
    case 'PURCHASE_CHARGEBACK':
      return 'reembolsado';
    case 'PURCHASE_CANCELED':
    case 'PURCHASE_CANCELLED':
      return 'cancelado';
    default:
      return null;
  }
}

export interface EventoHotmart {
  event?: string;
  hottok?: string;
  data?: {
    buyer?: { email?: string };
    product?: { id?: number | string };
    purchase?: { transaction?: string };
  };
}

export function extraer(e: EventoHotmart) {
  return {
    evento: e.event,
    email: e.data?.buyer?.email?.trim().toLowerCase(),
    transaccion: e.data?.purchase?.transaction,
    productoId: e.data?.product?.id === undefined ? undefined : String(e.data.product.id),
  };
}
