import { useSyncExternalStore } from 'react';
import type { Actividad, Objetivo, Ritmo, Sexo } from './calculos';
import { COMIDAS, RECETAS, type Comida, type Receta, type Sintoma } from './recetas';

// Estado de la app interna. Vive SOLO en el celular (localStorage) hasta que se conecte la base de datos en la etapa de
// servicios externos; la primera vez nace del recorrido de inicio (sessionStorage) o, si no existe, de datos de ejemplo
// realistas (la app nunca se enseña vacía).

export type Nivel = 'ligera' | 'normal' | 'hinchada';

export interface Perfil {
  nombre: string;
  correo: string;
  sexo: Sexo;
  edad: number;
  peso: number;
  talla: number;
  actividad: Actividad;
  objetivo: Objetivo;
  sintomas: Sintoma[];
  ritmo: Ritmo | null;
}

export interface EstadoApp {
  v: 1;
  perfil: Perfil;
  /** Plan por semana (clave = lunes en formato AAAA-MM-DD) → { "dia-comida": idReceta }, dia 0 = lunes. */
  semanas: Record<string, Record<string, string>>;
  chequeos: Record<string, Nivel>;
  comprados: Record<string, boolean>;
}

export const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const TOTAL_ESPACIOS = DIAS.length * COMIDAS.length;

const CLAVE = 'cec-app-v1';
const CLAVE_INICIO = 'cec-onboarding-v1';

// ───────────────────────── fechas ─────────────────────────
export function aIso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}
export function lunesDe(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
export function sumarDias(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}
export function indiceDia(d: Date): number {
  return (d.getDay() + 6) % 7;
}
export function rangoSemana(lunes: Date): string {
  const fin = sumarDias(lunes, 6);
  const f = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });
  return `${f.format(lunes).replace('.', '')} – ${f.format(fin).replace('.', '')}`;
}
export function fechaLarga(d: Date): string {
  const t = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ───────────────────────── recetas ─────────────────────────
export function recetaPorId(id: string | undefined): Receta | undefined {
  return id ? RECETAS.find((r) => r.id === id) : undefined;
}
export function clave(dia: number, comida: Comida): string {
  return `${dia}-${comida}`;
}

/** Plan de una semana ya con las recetas resueltas. */
export function resolverSemana(plan: Record<string, string> | undefined): Map<string, Receta> {
  const m = new Map<string, Receta>();
  if (!plan) return m;
  for (const [k, id] of Object.entries(plan)) {
    const r = recetaPorId(id);
    if (r) m.set(k, r);
  }
  return m;
}
export function contarLlenos(plan: Record<string, string> | undefined): number {
  return resolverSemana(plan).size;
}

/** Receta sugerida para un espacio: rota por el banco priorizando síntoma y el ritmo de la persona. */
/** Recetas que ya tienen foto real (public/recetas): la semana de ejemplo las usa en el día de hoy para que la pantalla principal se vea completa. */
const CON_FOTO = ['d01', 'd02', 'a01', 'a02', 'c01', 'c07', 'm01', 'm02'];

export function sugerir(perfil: Perfil, comida: Comida, dia: number, usados: Set<string>, conFoto = false): Receta {
  const pool = RECETAS.filter((r) => r.comida === comida)
    .map((r) => {
      const sint = r.sintomas.filter((s) => perfil.sintomas.includes(s)).length * 2;
      const ritmo =
        perfil.ritmo === 'express' ? (r.min <= 15 ? 2 : 0) : perfil.ritmo === 'prep' ? (r.congelable_dias ? 2 : 0) : 0;
      return { r, p: sint + ritmo + (usados.has(r.id) ? -3 : 0) + (conFoto && CON_FOTO.includes(r.id) ? 10 : 0) };
    })
    .sort((a, b) => b.p - a.p || a.r.id.localeCompare(b.r.id));
  const mejores = pool.filter((x) => x.p === pool[0].p);
  return mejores[dia % mejores.length].r;
}

/** Completa SOLO los espacios vacíos de la semana, sin repetir tanto una misma receta. */
export function completarSemana(perfil: Perfil, plan: Record<string, string>, diaConFoto = -1): Record<string, string> {
  const nuevo = { ...plan };
  const usados = new Set(Object.values(nuevo));
  for (let d = 0; d < DIAS.length; d++) {
    for (const c of COMIDAS) {
      const k = clave(d, c);
      if (nuevo[k]) continue;
      const r = sugerir(perfil, c, d, usados, d === diaConFoto);
      nuevo[k] = r.id;
      usados.add(r.id);
    }
  }
  return nuevo;
}

// ───────────────────────── lista de compras ─────────────────────────
export type Pasillo = 'Verduras y frutas' | 'Proteínas' | 'Cereales y legumbres' | 'Lácteos y despensa';
export const PASILLOS: Pasillo[] = ['Verduras y frutas', 'Proteínas', 'Cereales y legumbres', 'Lácteos y despensa'];

function pasilloDe(nombre: string): Pasillo {
  const n = nombre.toLowerCase();
  if (/pollo|pavo|pescado|salmón|atún|camarones|huevo|tofu|carne/.test(n)) return 'Proteínas';
  if (/avena|arroz|quinoa|lenteja|garbanzo|pan|tortilla|papa|camote|frijol|pasta|harina/.test(n)) return 'Cereales y legumbres';
  if (/zapallo|zanahoria|espinaca|brócoli|zucchini|pepino|aguacate|banano|plátano|papaya|piña|manzana|limón|tomate|cebolla|lechuga|fruta|jengibre|menta|hinojo|apio|pera|fresa|mango/.test(n))
    return 'Verduras y frutas';
  return 'Lácteos y despensa';
}

/** Quita la cantidad del inicio ("½ taza de avena" → "avena") para sumar el mismo ingrediente de varias recetas. */
function nombreIngrediente(linea: string): string {
  return linea
    .replace(/^[\d½¼¾⅓⅔/.,\s-]+/, '')
    .replace(/^(tazas?|cdas?|cditas?|cdtas?|palmas?|cucharadas?|cucharaditas?|dientes?|unidades?|unidad|pizca|puñado|rebanadas?|latas?|filetes?|hojas?|ramitas?|rodajas?|g|gr|ml)\b\s*/i, '')
    .replace(/^(de|del)\s+/i, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .replace(/,.*$/, '')
    .replace(
      /\b(picad[oa]s?|rallad[oa]s?|cocid[oa]s?|fresc[oa]s?|madur[oa]s?|pequeñ[oa]s?|grandes?|median[oa]s?|naturales?|sin sal|en cubos|en rodajas|en tiras|al gusto)\b/gi,
      '',
    )
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface ItemCompra {
  clave: string;
  nombre: string;
  veces: number;
  pasillo: Pasillo;
}

export function listaCompras(plan: Record<string, string> | undefined): ItemCompra[] {
  const m = new Map<string, ItemCompra>();
  for (const r of resolverSemana(plan).values()) {
    for (const linea of r.ing) {
      const nombre = nombreIngrediente(linea);
      if (!nombre) continue;
      const k = nombre.toLowerCase();
      const previo = m.get(k);
      if (previo) previo.veces += 1;
      else m.set(k, { clave: k, nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), veces: 1, pasillo: pasilloDe(nombre) });
    }
  }
  return [...m.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

// ───────────────────────── almacenamiento ─────────────────────────
const PERFIL_EJEMPLO: Perfil = {
  nombre: 'Laura',
  correo: 'laura@correo.com',
  sexo: 'mujer',
  edad: 34,
  peso: 68,
  talla: 162,
  actividad: 'ligera',
  objetivo: 'bajar',
  sintomas: ['Gases', 'Hinchazón'],
  ritmo: 'diaria',
};

function perfilDelInicio(): Perfil {
  try {
    const g = JSON.parse(window.sessionStorage.getItem(CLAVE_INICIO) ?? '{}') as Partial<{
      nombre: string;
      sexo: Sexo;
      edad: string;
      peso: string;
      talla: string;
      actividad: Actividad;
      objetivo: Objetivo;
      sintomas: Sintoma[];
      ritmo: Ritmo | null;
    }>;
    if (g.edad && g.peso && g.talla && g.actividad && g.objetivo && g.sintomas?.length) {
      return {
        ...PERFIL_EJEMPLO,
        nombre: g.nombre?.trim() || '',
        sexo: g.sexo ?? 'mujer',
        edad: Number(g.edad),
        peso: Number(g.peso),
        talla: Number(g.talla),
        actividad: g.actividad,
        objetivo: g.objetivo,
        sintomas: g.sintomas,
        ritmo: g.ritmo ?? null,
      };
    }
  } catch {
    /* sin recorrido de inicio: se usa el perfil de ejemplo */
  }
  return PERFIL_EJEMPLO;
}

/** Semana de ejemplo: casi llena (faltan 6 espacios) para que se vea la meta; y la semana pasada completa. */
function crearInicial(): EstadoApp {
  const perfil = perfilDelInicio();
  const hoy = new Date();
  const lunes = lunesDe(hoy);
  const hoyIdx = indiceDia(hoy);
  const actual = completarSemana(perfil, {}, hoyIdx);
  // Faltan 6 espacios, nunca los de hoy: la pantalla principal se ve completa.
  const vacios = [6, 5, 4, 3, 2, 1, 0].filter((d) => d !== hoyIdx).flatMap((d) => [`${d}-Cena`, `${d}-Merienda`, `${d}-Almuerzo`, `${d}-Desayuno`]);
  for (const k of vacios.slice(0, 6)) delete actual[k];
  const pasada = completarSemana({ ...perfil, ritmo: 'prep' }, {});
  const chequeos: Record<string, Nivel> = {};
  const niveles: Nivel[] = ['normal', 'ligera', 'ligera', 'hinchada', 'ligera'];
  niveles.forEach((n, i) => {
    chequeos[aIso(sumarDias(hoy, -(niveles.length - i)))] = n;
  });
  return {
    v: 1,
    perfil,
    semanas: { [aIso(lunes)]: actual, [aIso(sumarDias(lunes, -7))]: pasada },
    chequeos,
    comprados: {},
  };
}

let cache: EstadoApp | undefined;
const oyentes = new Set<() => void>();

function cargar(): EstadoApp {
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (raw) {
      const e = JSON.parse(raw) as EstadoApp;
      if (e?.v === 1) return e;
    }
  } catch {
    /* sin almacenamiento o datos dañados: se crea el estado inicial */
  }
  const e = crearInicial();
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(e));
  } catch {
    /* la app funciona igual, solo no recuerda al cerrar */
  }
  return e;
}

function instantanea(): EstadoApp {
  if (!cache) cache = cargar();
  return cache;
}

export function actualizar(fn: (e: EstadoApp) => EstadoApp): void {
  cache = fn(instantanea());
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(cache));
  } catch {
    /* ver arriba */
  }
  oyentes.forEach((o) => o());
}

export function borrarTodo(): void {
  try {
    window.localStorage.removeItem(CLAVE);
    window.sessionStorage.removeItem(CLAVE_INICIO);
  } catch {
    /* nada que borrar */
  }
  cache = undefined;
  oyentes.forEach((o) => o());
}

function suscribir(o: () => void): () => void {
  oyentes.add(o);
  return () => {
    oyentes.delete(o);
  };
}

/** Estado de la app (null mientras se dibuja en el servidor: las pantallas muestran su esqueleto). */
export function useApp(): EstadoApp | null {
  return useSyncExternalStore(suscribir, instantanea, () => null);
}

// ───────────────────────── meal prep ─────────────────────────
export interface TandaPrep {
  receta: Receta;
  /** Días (0 = lunes) en que esa receta aparece en la semana. */
  dias: number[];
  /** Nevera si se come pronto; congelador si hay que guardarla más días. */
  guardar: 'nevera' | 'congelador';
}

/** Recetas de la semana que se pueden cocinar de una vez y guardar, de la que más tarda a la que menos. */
export function tandasPrep(plan: Record<string, string> | undefined): TandaPrep[] {
  const usos = new Map<string, { receta: Receta; dias: number[] }>();
  for (const [k, r] of resolverSemana(plan)) {
    if (!r.congelable_dias) continue;
    const dia = Number(k.split('-')[0]);
    const u = usos.get(r.id) ?? { receta: r, dias: [] };
    u.dias.push(dia);
    usos.set(r.id, u);
  }
  return [...usos.values()]
    .map((u) => {
      const dias = [...u.dias].sort((a, b) => a - b);
      return { ...u, dias, guardar: dias[dias.length - 1] <= 3 ? ('nevera' as const) : ('congelador' as const) };
    })
    .sort((a, b) => b.receta.min - a.receta.min || b.dias.length - a.dias.length)
    .slice(0, 6);
}

/** Arma una semana pensada para cocinar una vez: cada receta guardable se repite en dos días. */
export function armarPrep(perfil: Perfil, plan: Record<string, string>): Record<string, string> {
  const nuevo = { ...plan };
  const puntos = (r: Receta) => r.sintomas.filter((s) => perfil.sintomas.includes(s)).length;
  const reparto: [Comida, number][] = [['Almuerzo', 2], ['Cena', 2], ['Desayuno', 1]];
  for (const [c, n] of reparto) {
    RECETAS.filter((r) => r.comida === c && r.congelable_dias)
      .sort((a, b) => puntos(b) - puntos(a) || a.id.localeCompare(b.id))
      .slice(0, n)
      .forEach((r, i) => {
        nuevo[clave(i, c)] = r.id;
        nuevo[clave(i + 3, c)] = r.id;
      });
  }
  return completarSemana(perfil, nuevo);
}
