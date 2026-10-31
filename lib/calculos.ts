import { COMIDAS, RECETAS, type Comida, type Receta, type Sintoma } from './recetas';

// Fórmula de referencia: Mifflin-St Jeor × factor de actividad. Cálculo APROXIMADO y orientativo.
// Pendiente de validación de la nutricionista del proyecto (ver ESTADO.md → Decisiones de producto).

export type Sexo = 'mujer' | 'hombre';
export type Actividad = 'sedentaria' | 'ligera' | 'moderada' | 'alta';
export type Objetivo = 'mantener' | 'bajar' | 'subir';

export interface Datos {
  sexo: Sexo;
  edad: number;
  peso: number; // kg
  talla: number; // cm
  actividad: Actividad;
  objetivo: Objetivo;
}

export interface Requerimientos {
  kcal: number;
  proteina: number;
  carbohidratos: number;
  grasas: number;
  fibra: number;
}

const FACTOR: Record<Actividad, number> = { sedentaria: 1.2, ligera: 1.375, moderada: 1.55, alta: 1.725 };
const AJUSTE: Record<Objetivo, number> = { mantener: 1, bajar: 0.9, subir: 1.1 };
const PISO_KCAL: Record<Sexo, number> = { mujer: 1200, hombre: 1500 };

export function calcularRequerimientos(d: Datos): Requerimientos {
  const base = 10 * d.peso + 6.25 * d.talla - 5 * d.edad + (d.sexo === 'hombre' ? 5 : -161);
  const kcal = Math.max(PISO_KCAL[d.sexo], Math.round((base * FACTOR[d.actividad] * AJUSTE[d.objetivo]) / 10) * 10);
  const proteina = Math.round(d.peso * 1.2);
  const grasas = Math.round((kcal * 0.3) / 9);
  const carbohidratos = Math.max(0, Math.round((kcal - proteina * 4 - grasas * 9) / 4));
  const fibra = Math.round((kcal / 1000) * 14);
  return { kcal, proteina, carbohidratos, grasas, fibra };
}

/** Qué ingredientes del selector rápido reconoce cada receta (por palabra clave en sus ingredientes). */
export const INGREDIENTES_RAPIDOS: { etiqueta: string; clave: RegExp }[] = [
  { etiqueta: 'Pechuga de pollo', clave: /pollo/i },
  { etiqueta: 'Huevos', clave: /huevo/i },
  { etiqueta: 'Arroz integral', clave: /arroz/i },
  { etiqueta: 'Avena', clave: /avena/i },
  { etiqueta: 'Zapallo', clave: /zapallo/i },
  { etiqueta: 'Zanahoria', clave: /zanahoria/i },
  { etiqueta: 'Papa', clave: /papa\b/i },
  { etiqueta: 'Camote', clave: /camote/i },
  { etiqueta: 'Banano', clave: /banano|plátano/i },
  { etiqueta: 'Yogur griego', clave: /yogur/i },
  { etiqueta: 'Kéfir', clave: /kéfir/i },
  { etiqueta: 'Lenteja', clave: /lenteja/i },
  { etiqueta: 'Garbanzo', clave: /garbanzo/i },
  { etiqueta: 'Frijol', clave: /frijol/i },
  { etiqueta: 'Quinoa', clave: /quinoa/i },
  { etiqueta: 'Espinaca', clave: /espinaca/i },
  { etiqueta: 'Brócoli', clave: /brócoli/i },
  { etiqueta: 'Zucchini', clave: /zucchini/i },
  { etiqueta: 'Pepino', clave: /pepino/i },
  { etiqueta: 'Aguacate', clave: /aguacate/i },
  { etiqueta: 'Pescado blanco', clave: /pescado/i },
  { etiqueta: 'Atún en agua', clave: /atún/i },
  { etiqueta: 'Tofu', clave: /tofu/i },
  { etiqueta: 'Papaya', clave: /papaya/i },
];

export interface ItemMenu {
  receta: Receta;
  /** Multiplicador de porción (0.75–1.5, en pasos de 0.25) para acercarse al requerimiento del día. */
  porcion: number;
  /** Ingredientes elegidos por la usuaria que esta receta usa. */
  coincidencias: string[];
}

export interface MenuDia {
  items: ItemMenu[];
  cobertura: number; // 0–1 (puede pasar de 1 si la receta es muy calórica)
  faltantes: string[];
}

const REPARTO: Record<Comida, number> = { Desayuno: 0.25, Almuerzo: 0.33, Merienda: 0.12, Cena: 0.3 };

/** Elige 1 receta por comida: prioriza síntoma + ingredientes que la usuaria tiene, y ajusta la porción. */
export function generarMenu(sintomas: Sintoma[], ingredientes: string[], kcalObjetivo: number): MenuDia {
  const elegidos = INGREDIENTES_RAPIDOS.filter((i) => ingredientes.includes(i.etiqueta));
  const items: ItemMenu[] = COMIDAS.map((comida) => {
    const candidatas = RECETAS.filter((r) => r.comida === comida).map((r) => {
      const texto = r.ing.join(' ');
      const coincidencias = elegidos.filter((i) => i.clave.test(texto)).map((i) => i.etiqueta);
      const puntaje =
        r.sintomas.filter((s) => sintomas.includes(s)).length * 2 +
        coincidencias.length * 3 +
        (r.min <= 15 ? 0.5 : 0);
      return { r, coincidencias, puntaje };
    });
    candidatas.sort((a, b) => b.puntaje - a.puntaje || a.r.id.localeCompare(b.r.id));
    const mejor = candidatas[0];
    const meta = kcalObjetivo * REPARTO[comida];
    const crudo = meta / mejor.r.kcal;
    const porcion = Math.min(1.5, Math.max(0.75, Math.round(crudo * 4) / 4));
    return { receta: mejor.r, porcion, coincidencias: mejor.coincidencias };
  });
  const total = items.reduce((s, i) => s + i.receta.kcal * i.porcion, 0);
  const usados = new Set(items.flatMap((i) => i.coincidencias));
  return {
    items,
    cobertura: total / kcalObjetivo,
    faltantes: elegidos.map((i) => i.etiqueta).filter((e) => !usados.has(e)),
  };
}
