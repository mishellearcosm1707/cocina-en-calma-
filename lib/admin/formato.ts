const ZONA = 'America/Guayaquil';

/** Importe en unidad menor (centavos) → texto con su moneda. null = no hay dato. */
export function dinero(minor: number | null | undefined, moneda = 'USD'): string {
  if (minor === null || minor === undefined) return 'Sin datos';
  return new Intl.NumberFormat('es', { style: 'currency', currency: moneda, maximumFractionDigits: 2 }).format(minor / 100);
}

export function porcentaje(v: number | null | undefined, decimales = 0): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return 'Sin datos';
  return `${(v * 100).toFixed(decimales)}%`;
}

/** 'YYYY-MM-DD' en la zona horaria del negocio (Ecuador). */
export function diaDe(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: ZONA });
}

export function mesDe(iso: string): string {
  return diaDe(iso).slice(0, 7);
}

export function nombreMes(mes: string): string {
  const [a, m] = mes.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, 15)).toLocaleDateString('es', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

export function fechaHora(iso: string | null | undefined): string {
  if (!iso) return 'Sin datos';
  return new Date(iso).toLocaleString('es', { timeZone: ZONA, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function haceCuanto(iso: string | null | undefined): string {
  if (!iso) return 'Sin datos';
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return `hace ${Math.max(min, 0)} min`;
  if (min < 60 * 48) return `hace ${Math.round(min / 60)} h`;
  return `hace ${Math.round(min / 1440)} días`;
}
