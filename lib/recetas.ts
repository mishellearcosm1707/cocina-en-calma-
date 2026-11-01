import banco from '@/datos/recetas.json';

export type Comida = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
export type Sintoma = 'Hinchazón' | 'Gases' | 'Pesadez' | 'Digestión lenta';

export interface Receta {
  id: string;
  nombre: string;
  comida: Comida;
  min: number;
  sintomas: Sintoma[];
  tags: string[];
  kcal: number;
  prot: number;
  carb: number;
  gras: number;
  fibra: number;
  porque: string;
  ing: string[];
  pasos: string[];
  congelable_dias?: number;
  /** Días que aguanta en la nevera ya cocinada (sin esto, no se recomienda para meal prep). */
  nevera_dias?: number;
  /** Cuántas porciones salen de cocinarla una vez (si falta, 1). */
  porciones?: number;
  /** Tiempo completo cuando incluye reposo o refrigeración (ej. "10 min + refrigeración"). */
  tiempo_texto?: string;
  categoria?: Categoria;
  /** De dónde salen los valores nutricionales (las recetas de los recetarios LIVIANA traen los suyos). */
  fuente?: string;
}

export type Categoria = 'Menú base' | 'Air Fryer' | 'En familia' | 'Snacks' | 'Postres' | 'Aderezos y salsas';
export const CATEGORIAS: Categoria[] = ['Menú base', 'Air Fryer', 'En familia', 'Snacks', 'Postres', 'Aderezos y salsas'];

// Banco en BORRADOR (valores estimados, pendiente de validación de la nutricionista): datos/recetas.json
export const RECETAS = banco.recetas as Receta[];

export const COMIDAS: Comida[] = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

/** Emoji de apoyo mientras una receta no tiene foto real en public/recetas/<id>.jpg */
export function emojiDe(r: Receta): string {
  const n = r.nombre.toLowerCase();
  const mapa: [RegExp, string][] = [
    [/sopa|crema|curry/, '🍲'],
    [/pescado|salmón|atún/, '🐟'],
    [/camarones/, '🍤'],
    [/tacos|wrap/, '🌮'],
    [/smoothie|batido|kéfir/, '🥤'],
    [/muffins|galletas|bolitas/, '🧁'],
    [/tortitas|panqueques|crepas/, '🥞'],
    [/omelette|frittata|huevo/, '🍳'],
    [/pollo|pavo/, '🍗'],
    [/ensalada|bowl/, '🥗'],
    [/avena|pudín|yogur/, '🥣'],
    [/manzana|pera|papaya|fresas|kiwi/, '🍎'],
  ];
  return mapa.find(([re]) => re.test(n))?.[1] ?? '🍽️';
}

export const categoriaDe = (r: Receta): Categoria => r.categoria ?? 'Menú base';

/** Se puede poner en un espacio de la semana (los aderezos acompañan, no son una comida). */
export const esComida = (r: Receta) => categoriaDe(r) !== 'Aderezos y salsas';
/** Entra en las sugerencias automáticas (los postres solo si la persona los elige). */
export const esSugerible = (r: Receta) => esComida(r) && categoriaDe(r) !== 'Postres';
/** "Listas en 15 min": sin reposo ni refrigeración de por medio. */
export const esExpress = (r: Receta) => r.min <= 15 && !r.tiempo_texto?.includes('+');

export interface OpcionPrep {
  /** Cuántas comidas conviene sacar de cocinarla una vez. */
  comidas: number;
  /** Cuántos días seguidos aguanta en la nevera (con el congelador no hay límite en la semana). */
  ventana: number;
  guardar: 'nevera' | 'congelador';
  /** Si una sola tanda no alcanza para tantas comidas. */
  duplicar: boolean;
}

/** Recomendación de meal prep al elegir la receta; null si no se guarda bien. */
export function opcionPrep(r: Receta): OpcionPrep | null {
  const rinde = r.porciones ?? 1;
  if (r.congelable_dias) {
    const comidas = Math.min(4, Math.max(2, rinde > 1 ? rinde : 3));
    return { comidas, ventana: 7, guardar: 'congelador', duplicar: rinde < comidas };
  }
  if ((r.nevera_dias ?? 0) >= 2) {
    const ventana = r.nevera_dias ?? 3;
    const comidas = Math.min(ventana, Math.max(2, rinde));
    return { comidas, ventana, guardar: 'nevera', duplicar: rinde < comidas };
  }
  return null;
}
