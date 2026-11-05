import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { diaDe, mesDe } from './formato';

// Todo lo que muestra el panel sale de aquí. Regla: si un dato no existe, la función devuelve null / lista vacía y la
// pantalla dice "Sin datos". Nada se inventa ni se rellena con cifras de ejemplo.

const DIA_MS = 86_400_000;

/** Lee todas las filas de una tabla (PostgREST entrega máximo 1000 por petición). */
async function todas<T>(tabla: string, columnas: string, orden?: string): Promise<T[]> {
  const db = supabaseAdmin();
  const filas: T[] = [];
  for (let desde = 0; ; desde += 1000) {
    let q = db.from(tabla).select(columnas).range(desde, desde + 999);
    if (orden) q = q.order(orden, { ascending: false });
    const { data, error } = await q;
    if (error) throw new Error(`${tabla}: ${error.message}`);
    const lote = (data ?? []) as unknown as T[];
    filas.push(...lote);
    if (lote.length < 1000) return filas;
  }
}

// ───────────────────────── tipos ─────────────────────────
export interface Venta {
  transaccion: string;
  email: string;
  moneda: string | null;
  bruto_minor: number | null;
  fee_hotmart_minor: number | null;
  afiliado_minor: number | null;
  neto_productor_minor: number | null;
  canal: string | null;
  estado: 'aprobada' | 'reembolsada' | 'contracargo' | 'cancelada';
  comprada_en: string;
  cerrada_en: string | null;
}
export interface Acceso {
  id: string;
  email: string;
  nombre: string | null;
  estado: 'activo' | 'reembolsado' | 'cancelado';
  origen: 'hotmart' | 'manual';
  transaccion: string;
  comprado_en: string;
}
interface Evento {
  evento: string;
  user_id: string | null;
  sesion: string | null;
  props: { paso?: string };
  creado_en: string;
}
export interface Costos {
  impuestoPct: number | null;
  infraMensual: number | null;
  emailMensual: number | null;
}
export interface Gasto {
  id: string;
  canal: string;
  monto_minor: number;
  moneda: string;
  desde: string;
  hasta: string;
  nota: string | null;
}

// ───────────────────────── ventas y ganancia ─────────────────────────
export async function cargarVentas(): Promise<Venta[]> {
  return todas<Venta>(
    'ventas',
    'transaccion, email, moneda, bruto_minor, fee_hotmart_minor, afiliado_minor, neto_productor_minor, canal, estado, comprada_en, cerrada_en',
    'comprada_en',
  );
}

/** Moneda principal (la de más ventas) y si hay ventas en otras monedas que NO se suman. */
export function monedaPrincipal(ventas: Venta[]): { moneda: string | null; otras: string[] } {
  const cuenta = new Map<string, number>();
  for (const v of ventas) if (v.moneda) cuenta.set(v.moneda, (cuenta.get(v.moneda) ?? 0) + 1);
  const orden = [...cuenta.entries()].sort((a, b) => b[1] - a[1]);
  return { moneda: orden[0]?.[0] ?? null, otras: orden.slice(1).map(([m]) => m) };
}

export interface MesVentas {
  mes: string;
  compras: number;
  reembolsos: number;
  ingresos: number;
  fee: number;
  afiliados: number;
}

/** Resumen por mes, solo de la moneda indicada. Ingresos = compras que siguen vigentes (sin reembolso ni contracargo). */
export function ventasPorMes(ventas: Venta[], moneda: string): MesVentas[] {
  const m = new Map<string, MesVentas>();
  for (const v of ventas) {
    if (v.moneda !== moneda) continue;
    const mes = mesDe(v.comprada_en);
    const fila = m.get(mes) ?? { mes, compras: 0, reembolsos: 0, ingresos: 0, fee: 0, afiliados: 0 };
    fila.compras += 1;
    if (v.estado === 'reembolsada' || v.estado === 'contracargo') fila.reembolsos += 1;
    if (v.estado === 'aprobada') {
      fila.ingresos += v.bruto_minor ?? 0;
      fila.fee += v.fee_hotmart_minor ?? 0;
      fila.afiliados += v.afiliado_minor ?? 0;
    }
    m.set(mes, fila);
  }
  return [...m.values()].sort((a, b) => a.mes.localeCompare(b.mes));
}

export interface Ganancia {
  mes: string;
  ingresos: number;
  fee: number;
  afiliados: number;
  impuestos: number | null;
  infra: number | null;
  email: number | null;
  /** Ganancia limpia; null si no hay ingresos que calcular. */
  ganancia: number | null;
  margen: number | null;
  /** true solo si cada componente es dato real (Hotmart informó las comisiones y la dueña registró sus costos). */
  real: boolean;
  supuestos: string[];
}

export function gananciaPorMes(ventas: Venta[], moneda: string, costos: Costos): Ganancia[] {
  return ventasPorMes(ventas, moneda).map((m) => {
    const delMes = ventas.filter((v) => v.moneda === moneda && v.estado === 'aprobada' && mesDe(v.comprada_en) === m.mes);
    const supuestos: string[] = [];
    if (delMes.some((v) => v.fee_hotmart_minor === null)) supuestos.push('La comisión de Hotmart de alguna venta no llegó en el aviso');
    if (delMes.some((v) => v.bruto_minor === null)) supuestos.push('El importe de alguna venta no llegó en el aviso');
    if (costos.impuestoPct === null) supuestos.push('No registraste el porcentaje de impuestos');
    if (costos.infraMensual === null) supuestos.push('No registraste el costo mensual de la infraestructura');
    if (costos.emailMensual === null) supuestos.push('No registraste el costo mensual de correos');
    const impuestos = costos.impuestoPct === null ? null : Math.round((m.ingresos * costos.impuestoPct) / 100);
    const infra = costos.infraMensual === null ? null : Math.round(costos.infraMensual * 100);
    const email = costos.emailMensual === null ? null : Math.round(costos.emailMensual * 100);
    const ganancia = m.ingresos > 0 || m.compras > 0 ? m.ingresos - m.fee - m.afiliados - (impuestos ?? 0) - (infra ?? 0) - (email ?? 0) : null;
    return {
      mes: m.mes,
      ingresos: m.ingresos,
      fee: m.fee,
      afiliados: m.afiliados,
      impuestos,
      infra,
      email,
      ganancia,
      margen: ganancia !== null && m.ingresos > 0 ? ganancia / m.ingresos : null,
      real: supuestos.length === 0,
      supuestos,
    };
  });
}

// ───────────────────────── costos y gasto de anuncios ─────────────────────────
export async function cargarCostos(): Promise<Costos> {
  const filas = await todas<{ clave: string; valor: number }>('costos_config', 'clave, valor');
  const v = (k: string) => {
    const f = filas.find((x) => x.clave === k);
    return f ? Number(f.valor) : null;
  };
  return { impuestoPct: v('impuesto_pct'), infraMensual: v('infra_mensual'), emailMensual: v('email_mensual') };
}

export async function cargarGastos(): Promise<Gasto[]> {
  return todas<Gasto>('gasto_adquisicion', 'id, canal, monto_minor, moneda, desde, hasta, nota', 'desde');
}

// ───────────────────────── usuarios ─────────────────────────
export async function cargarAccesos(): Promise<Acceso[]> {
  return todas<Acceso>('accesos', 'id, email, nombre, estado, origen, transaccion, comprado_en', 'comprado_en');
}

export interface CuentaAuth {
  id: string;
  email: string;
  creada: string;
  ultimaEntrada: string | null;
}

export async function cargarCuentas(): Promise<CuentaAuth[]> {
  const db = supabaseAdmin();
  const cuentas: CuentaAuth[] = [];
  for (let pagina = 1; ; pagina++) {
    const { data, error } = await db.auth.admin.listUsers({ page: pagina, perPage: 1000 });
    if (error) throw new Error(`usuarias: ${error.message}`);
    for (const u of data.users) cuentas.push({ id: u.id, email: u.email ?? '', creada: u.created_at, ultimaEntrada: u.last_sign_in_at ?? null });
    if (data.users.length < 1000) return cuentas;
  }
}

// ───────────────────────── uso: eventos, activación, retención, embudo ─────────────────────────
async function cargarEventos(): Promise<Evento[]> {
  return todas<Evento>('event_log', 'evento, user_id, sesion, props, creado_en', 'creado_en');
}

export interface Uso {
  conEventos: boolean;
  activos7: number;
  activos30: number;
  activacion: { pct: number | null; n: number };
  retencion: { d1: { pct: number | null; n: number }; d7: { pct: number | null; n: number }; d30: { pct: number | null; n: number } };
  acciones: Array<{ nombre: string; semana: number; mes: number }>;
  embudo: Array<{ clave: string; etiqueta: string; personas: number }>;
}

const ACCIONES: Array<[string, string]> = [
  ['chequeo_registrado', 'Chequeos del día'],
  ['receta_planificada', 'Recetas puestas en la semana'],
  ['semana_completada', 'Semanas completadas con "por mí"'],
  ['prep_armado', 'Semanas de meal prep armadas'],
];

export const PASOS_EMBUDO: Array<[string, string]> = [
  ['gancho', 'Empieza el recorrido'],
  ['sintomas', 'Cuenta sus síntomas'],
  ['tiempo', 'Dice cuánto tiempo tiene'],
  ['consent', 'Acepta el aviso de salud'],
  ['filtro', 'Pasa el filtro de seguridad'],
  ['datos', 'Pone sus datos'],
  ['actividad', 'Dice su actividad'],
  ['objetivo', 'Elige su objetivo'],
  ['cuerpo', 'Cuerpo y metas'],
  ['nombre', 'Pone su nombre'],
  ['ingredientes', 'Elige sus ingredientes'],
  ['menu', 'Ve su primer menú'],
];

export async function calcularUso(): Promise<Uso> {
  const ev = await cargarEventos();
  const ahora = Date.now();
  const hoy = diaDe(new Date().toISOString());

  // Días con sesión por persona con cuenta
  const dias = new Map<string, Set<string>>();
  for (const e of ev) {
    if (e.evento !== 'sesion_iniciada' || !e.user_id) continue;
    const s = dias.get(e.user_id) ?? new Set<string>();
    s.add(diaDe(e.creado_en));
    dias.set(e.user_id, s);
  }
  const activosEn = (d: number) => new Set(ev.filter((e) => e.evento === 'sesion_iniciada' && e.user_id && ahora - new Date(e.creado_en).getTime() <= d * DIA_MS).map((e) => e.user_id)).size;

  const sumarDias = (dia: string, n: number) => new Date(new Date(`${dia}T12:00:00Z`).getTime() + n * DIA_MS).toISOString().slice(0, 10);

  // Retención: de las personas cuyo primer día ya tiene N días, ¿cuántas volvieron justo el día N?
  const retencion = (n: number) => {
    let base = 0;
    let volvieron = 0;
    for (const s of dias.values()) {
      const primero = [...s].sort()[0];
      if (sumarDias(primero, n) > hoy) continue;
      base += 1;
      if (s.has(sumarDias(primero, n))) volvieron += 1;
    }
    return { pct: base ? volvieron / base : null, n: base };
  };

  // Activación: de quienes ya entraron, ¿cuántas hicieron una acción de valor el mismo día de su primera sesión?
  const accionesValor = new Set(['chequeo_registrado', 'receta_planificada', 'semana_completada', 'prep_armado']);
  let baseAct = 0;
  let activadas = 0;
  for (const [uid, s] of dias) {
    const primero = [...s].sort()[0];
    baseAct += 1;
    if (ev.some((e) => e.user_id === uid && accionesValor.has(e.evento) && diaDe(e.creado_en) === primero)) activadas += 1;
  }

  const contar = (nombre: string, d: number) => ev.filter((e) => e.evento === nombre && ahora - new Date(e.creado_en).getTime() <= d * DIA_MS).length;

  return {
    conEventos: ev.length > 0,
    activos7: activosEn(7),
    activos30: activosEn(30),
    activacion: { pct: baseAct ? activadas / baseAct : null, n: baseAct },
    retencion: { d1: retencion(1), d7: retencion(7), d30: retencion(30) },
    acciones: ACCIONES.map(([clave, nombre]) => ({ nombre, semana: contar(clave, 7), mes: contar(clave, 30) })),
    embudo: embudo(ev),
  };
}

/** Embudo del recorrido de inicio: personas (navegadores distintos) que llegaron a cada paso. */
function embudo(ev: Evento[]): Uso['embudo'] {
  const porPaso = new Map<string, Set<string>>();
  for (const e of ev) {
    if (e.evento !== 'onboarding_paso_visto' || !e.sesion || !e.props?.paso) continue;
    const s = porPaso.get(e.props.paso) ?? new Set<string>();
    s.add(e.sesion);
    porPaso.set(e.props.paso, s);
  }
  const pasos = PASOS_EMBUDO.map(([clave, etiqueta]) => ({ clave, etiqueta, personas: porPaso.get(clave)?.size ?? 0 }));
  const sesionesDe = (evento: string) => new Set(ev.filter((e) => e.evento === evento && e.sesion).map((e) => e.sesion)).size;
  return [
    ...pasos,
    { clave: 'paywall_visto', etiqueta: 'Ve la pantalla de planes', personas: sesionesDe('paywall_visto') },
    { clave: 'checkout_iniciado', etiqueta: 'Toca "Desbloquear" (va a Hotmart)', personas: sesionesDe('checkout_iniciado') },
  ];
}

// ───────────────────────── negocio: LTV, CAC, canales ─────────────────────────
export interface Canal {
  canal: string;
  compras: number;
  neto: number;
  ltv: number | null;
  gasto: number | null;
  cac: number | null;
  ratio: number | null;
}

/** Pago único: el valor de un cliente es lo que le queda a la dueña de su compra (bruto − Hotmart − afiliado). */
export function porCanal(ventas: Venta[], gastos: Gasto[], moneda: string): Canal[] {
  const m = new Map<string, { compras: number; neto: number; conImporte: number }>();
  for (const v of ventas) {
    if (v.moneda !== moneda || v.estado !== 'aprobada') continue;
    const canal = v.canal ?? 'sin canal';
    const f = m.get(canal) ?? { compras: 0, neto: 0, conImporte: 0 };
    f.compras += 1;
    if (v.bruto_minor !== null) {
      f.neto += v.bruto_minor - (v.fee_hotmart_minor ?? 0) - (v.afiliado_minor ?? 0);
      f.conImporte += 1;
    }
    m.set(canal, f);
  }
  const gastoDe = (canal: string) => {
    const g = gastos.filter((x) => x.moneda === moneda && x.canal.toLowerCase() === canal.toLowerCase());
    return g.length ? g.reduce((s, x) => s + x.monto_minor, 0) : null;
  };
  return [...m.entries()]
    .map(([canal, f]) => {
      const ltv = f.conImporte ? f.neto / f.conImporte : null;
      const gasto = gastoDe(canal);
      const cac = gasto !== null && f.compras ? gasto / f.compras : null;
      return { canal, compras: f.compras, neto: f.neto, ltv, gasto, cac, ratio: ltv !== null && cac ? ltv / cac : null };
    })
    .sort((a, b) => b.compras - a.compras);
}

// ───────────────────────── salud ─────────────────────────
export interface Salud {
  ultimoAviso: string | null;
  avisos24h: Record<string, number>;
  avisos7d: Record<string, number>;
  errores: Array<{ mensaje: string; pantalla: string | null; veces: number; ultima: string }>;
  errores24h: number;
}

export async function calcularSalud(): Promise<Salud> {
  const [eventos, log, errores] = await Promise.all([
    todas<{ recibido_en: string }>('eventos_hotmart', 'recibido_en', 'recibido_en'),
    todas<{ resultado: string; creado_en: string }>('webhook_log', 'resultado, creado_en', 'creado_en'),
    todas<{ mensaje: string; pantalla: string | null; creado_en: string }>('error_log', 'mensaje, pantalla, creado_en', 'creado_en'),
  ]);
  const ahora = Date.now();
  const contar = (horas: number) => {
    const r: Record<string, number> = {};
    for (const l of log) if (ahora - new Date(l.creado_en).getTime() <= horas * 3_600_000) r[l.resultado] = (r[l.resultado] ?? 0) + 1;
    return r;
  };
  const grupos = new Map<string, { mensaje: string; pantalla: string | null; veces: number; ultima: string }>();
  for (const e of errores) {
    if (ahora - new Date(e.creado_en).getTime() > 7 * DIA_MS) continue;
    const k = `${e.mensaje}|${e.pantalla}`;
    const g = grupos.get(k) ?? { mensaje: e.mensaje, pantalla: e.pantalla, veces: 0, ultima: e.creado_en };
    g.veces += 1;
    if (e.creado_en > g.ultima) g.ultima = e.creado_en;
    grupos.set(k, g);
  }
  const ultimoLog = log[0]?.creado_en ?? eventos[0]?.recibido_en ?? null;
  return {
    ultimoAviso: ultimoLog,
    avisos24h: contar(24),
    avisos7d: contar(24 * 7),
    errores: [...grupos.values()].sort((a, b) => b.veces - a.veces).slice(0, 10),
    errores24h: errores.filter((e) => ahora - new Date(e.creado_en).getTime() <= DIA_MS).length,
  };
}

// ───────────────────────── avisos para la dueña ─────────────────────────
export interface AvisoDueña {
  nivel: 'alto' | 'medio';
  titulo: string;
  que: string;
  porque: string;
  hacer: string;
}

export function calcularAvisos(args: { ventas: Venta[]; moneda: string | null; ganancias: Ganancia[]; canales: Canal[]; salud: Salud; costos: Costos }): AvisoDueña[] {
  const { ventas, moneda, ganancias, canales, salud, costos } = args;
  const a: AvisoDueña[] = [];

  const fallos = (salud.avisos24h['error'] ?? 0) + (salud.avisos24h['no_autorizado'] ?? 0);
  if (fallos > 0) {
    a.push({
      nivel: 'alto',
      titulo: 'Hotmart no está entregando bien los avisos de compra',
      que: `En las últimas 24 horas hubo ${fallos} aviso${fallos === 1 ? '' : 's'} rechazado${fallos === 1 ? '' : 's'} o con error.`,
      porque: 'Alguien podría haber pagado y no recibir su acceso (o recibirlo sin pagar).',
      hacer: 'Revisa en Hotmart que la contraseña del aviso (hottok) sea la misma que pusiste en Vercel, y mira la sección Salud.',
    });
  }
  if (moneda) {
    const actual = ganancias[ganancias.length - 1];
    if (actual && actual.ganancia !== null && actual.ganancia <= 0 && actual.ingresos > 0) {
      a.push({
        nivel: 'alto',
        titulo: 'Este mes estás perdiendo dinero',
        que: 'Lo que cobraste no alcanza para cubrir los costos que registraste.',
        porque: 'Vender más no arregla esto si cada venta deja poco.',
        hacer: 'Revisa tus costos en Ajustes y el precio antes de invertir en publicidad.',
      });
    }
    const compras = ventas.filter((v) => v.moneda === moneda && Date.now() - new Date(v.comprada_en).getTime() <= 30 * DIA_MS);
    const reembolsos = compras.filter((v) => v.estado === 'reembolsada' || v.estado === 'contracargo').length;
    if (compras.length >= 5 && reembolsos / compras.length > 0.1) {
      a.push({
        nivel: 'medio',
        titulo: 'Hay muchos reembolsos',
        que: `${reembolsos} de ${compras.length} compras de los últimos 30 días se reembolsaron.`,
        porque: 'Algo de lo que prometes no coincide con lo que la gente recibe.',
        hacer: 'Mira los motivos de reembolso en Hotmart y ajusta la promesa de la página de ventas o la app.',
      });
    }
  }
  for (const c of canales) {
    if (c.ratio !== null && c.ratio < 1) {
      a.push({
        nivel: 'alto',
        titulo: `El canal "${c.canal}" te cuesta más de lo que deja`,
        que: 'Cada cliente de ese canal cuesta más de lo que te deja su compra.',
        porque: 'Mientras sigas gastando ahí, cada venta te empobrece.',
        hacer: 'Pausa el gasto en ese canal o cambia el anuncio, y mira la sección Negocio.',
      });
    }
  }
  if (salud.errores24h >= 5) {
    a.push({
      nivel: 'medio',
      titulo: 'La app tuvo varios errores hoy',
      que: `${salud.errores24h} errores en las últimas 24 horas.`,
      porque: 'Hay personas que se están topando con pantallas rotas.',
      hacer: 'Mira el error más repetido en la sección Salud.',
    });
  }
  if (moneda && (costos.impuestoPct === null || costos.infraMensual === null || costos.emailMensual === null)) {
    a.push({
      nivel: 'medio',
      titulo: 'Tu ganancia todavía es una estimación',
      que: 'Faltan costos por registrar (impuestos, infraestructura o correos).',
      porque: 'Sin ellos, la ganancia que ves es más alta que la real.',
      hacer: 'Regístralos en Ajustes. Toma 2 minutos.',
    });
  }
  return a;
}

// ───────────────────────── auditoría ─────────────────────────
export interface RegistroAdmin {
  accion: string;
  objetivo: string | null;
  creado_en: string;
}

export async function cargarAuditoria(limite = 20): Promise<RegistroAdmin[]> {
  const { data, error } = await supabaseAdmin().from('admin_log').select('accion, objetivo, creado_en').order('creado_en', { ascending: false }).limit(limite);
  if (error) throw new Error(`auditoría: ${error.message}`);
  return (data ?? []) as RegistroAdmin[];
}

/** Cuántas cuentas se crearon en los últimos N días. */
export function cuentasNuevas(cuentas: CuentaAuth[], dias: number): number {
  const ahora = Date.now();
  return cuentas.filter((c) => ahora - new Date(c.creada).getTime() <= dias * DIA_MS).length;
}
