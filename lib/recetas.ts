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
}

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
