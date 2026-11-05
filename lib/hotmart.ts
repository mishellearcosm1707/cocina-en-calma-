import crypto from 'node:crypto';

/** Compara el hottok recibido con el esperado en tiempo constante (se comparan hashes para no filtrar la longitud). */
export function hottokValido(recibido: string | null | undefined, esperado: string | undefined): boolean {
  if (!recibido || !esperado) return false;
  const a = crypto.createHash('sha256').update(recibido).digest();
  const b = crypto.createHash('sha256').update(esperado).digest();
  return crypto.timingSafeEqual(a, b);
}

export type EstadoAcceso = 'activo' | 'reembolsado' | 'cancelado';
export type EstadoVenta = 'aprobada' | 'reembolsada' | 'contracargo' | 'cancelada';

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

export function estadoDeVenta(evento: string | undefined): EstadoVenta | null {
  switch (evento) {
    case 'PURCHASE_APPROVED':
    case 'PURCHASE_COMPLETE':
      return 'aprobada';
    case 'PURCHASE_REFUNDED':
      return 'reembolsada';
    case 'PURCHASE_CHARGEBACK':
      return 'contracargo';
    case 'PURCHASE_CANCELED':
    case 'PURCHASE_CANCELLED':
      return 'cancelada';
    default:
      return null;
  }
}

interface Importe {
  value?: number | string;
  currency_value?: string;
  currency_code?: string;
}

export interface EventoHotmart {
  event?: string;
  hottok?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    product?: { id?: number | string };
    purchase?: {
      transaction?: string;
      approved_date?: number;
      order_date?: number;
      price?: Importe;
      origin?: { src?: string; sck?: string };
    };
    commissions?: Array<Importe & { source?: string }>;
  };
}

/** Importe a unidad menor entera (centavos). Si Hotmart no lo informó → null (nunca se inventa). */
function aMinor(v: number | string | undefined): number | null {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? Math.round(n * 100) : null;
}

export function extraer(e: EventoHotmart) {
  const compra = e.data?.purchase;
  const comision = (fuente: string) => e.data?.commissions?.find((c) => c.source === fuente);
  const fecha = compra?.approved_date ?? compra?.order_date;
  return {
    evento: e.event,
    email: e.data?.buyer?.email?.trim().toLowerCase(),
    nombre: e.data?.buyer?.name?.trim() || undefined,
    transaccion: compra?.transaction,
    productoId: e.data?.product?.id === undefined ? undefined : String(e.data.product.id),
    moneda: compra?.price?.currency_value ?? compra?.price?.currency_code ?? undefined,
    bruto: aMinor(compra?.price?.value),
    feeHotmart: aMinor(comision('MARKETPLACE')?.value),
    afiliado: aMinor(comision('AFFILIATE')?.value),
    netoProductor: aMinor(comision('PRODUCER')?.value),
    canal: compra?.origin?.src?.trim() || compra?.origin?.sck?.trim() || undefined,
    fechaCompra: typeof fecha === 'number' ? new Date(fecha).toISOString() : undefined,
  };
}
