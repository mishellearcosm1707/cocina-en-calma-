// Calcula el valor nutricional de cada receta ingrediente por ingrediente con la tabla USDA FoodData Central (SR Legacy).
// Uso: node herramientas/nutricion/calcular.mjs <carpeta-usda>
// Salidas: datos/alimentos-usda.json · datos/recetas.json (kcal/macros recalculados) · datos/nutricion-por-ingrediente.csv
import { readFileSync, writeFileSync } from 'node:fs';
import { leerCSV } from './csv.mjs';
import { MAPA } from './mapa.mjs';

const dir = process.argv[2];
const FUENTE = 'USDA FoodData Central, SR Legacy (abril 2018) — https://fdc.nal.usda.gov';
const NUTR = { 1008: 'kcal', 2047: 'kcal_atwater_g', 2048: 'kcal_atwater_e', 1003: 'prot', 1004: 'gras', 1005: 'carb', 1079: 'fibra' };

// 1) Alimentos usados y sus nutrientes por 100 g
const foods = leerCSV(`${dir}/food.csv`);
const porDescripcion = new Map(foods.map((f) => [f.description, f.fdc_id]));
const usados = [...new Set(MAPA.map((m) => m.usda))];
const ids = new Map(usados.map((d) => [porDescripcion.get(d), d]));
const valores = new Map([...ids.keys()].map((id) => [id, {}]));
for (const r of leerCSV(`${dir}/food_nutrient.csv`)) {
  if (ids.has(r.fdc_id) && NUTR[r.nutrient_id]) valores.get(r.fdc_id)[NUTR[r.nutrient_id]] = parseFloat(r.amount);
}
const tabla = {};
for (const [id, desc] of ids) {
  const v = valores.get(id);
  tabla[desc] = {
    fdc_id: Number(id),
    por_100g: {
      kcal: v.kcal ?? v.kcal_atwater_g ?? v.kcal_atwater_e ?? 0,
      prot: v.prot ?? 0,
      carb: v.carb ?? 0,
      gras: v.gras ?? 0,
      fibra: v.fibra ?? 0,
    },
  };
}

// 2) Medidas caseras → gramos
const FRAC = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };
function cantidad(txt) {
  const m = txt.match(/^(\d+)?\s*([¼½¾⅓⅔])?/);
  const n = (m?.[1] ? Number(m[1]) : 0) + (m?.[2] ? FRAC[m[2]] : 0);
  return n > 0 ? n : null;
}
function medida(txt) {
  const t = txt.toLowerCase();
  if (/^jugo de/.test(t)) return { q: cantidad(t.replace(/^jugo de\s*/, '')) ?? 1, u: 'jugo' };
  if (/^unas gotas/.test(t)) return { q: 1, u: 'gotas' };
  const q = cantidad(t) ?? 1;
  const resto = t.replace(/^(\d+)?\s*([¼½¾⅓⅔])?\s*(de\s+)?/, '');
  if (/^tazas?\b/.test(resto)) return { q, u: 'taza' };
  if (/^cdas?\b/.test(resto)) return { q, u: 'cda' };
  if (/^cdta\b/.test(resto)) return { q, u: 'cdta' };
  if (/^pizca\b/.test(resto)) return { q, u: 'pizca' };
  if (/^palma/.test(resto) || /\(1 palma\)/.test(t)) return { q: /^palma/.test(resto) ? q : 1, u: 'palma' };
  if (/^filete/.test(resto)) return { q, u: 'filete' };
  if (/^lata/.test(resto)) return { q, u: 'lata' };
  if (/^rebanada/.test(resto)) return { q, u: 'rebanada' };
  if (/^ramita/.test(resto)) return { q, u: 'ramita' };
  if (/^hojas?/.test(resto)) return { q, u: 'hoja' };
  if (/^mitades?/.test(resto)) return { q, u: 'mitad' };
  return { q, u: 'unidad' };
}

// 3) Recetas
const rutaRecetas = new URL('../../datos/recetas.json', import.meta.url);
const banco = JSON.parse(readFileSync(rutaRecetas, 'utf8'));
const filas = ['receta,ingrediente,alimento_usda,fdc_id,gramos,kcal,prot_g,carb_g,gras_g,fibra_g,nota'];
const problemas = [];
const resumen = [];

for (const r of banco.recetas) {
  const tot = { kcal: 0, prot: 0, carb: 0, gras: 0, fibra: 0 };
  const detalle = [];
  for (const ing of r.ing) {
    const regla = MAPA.find((m) => m.clave.test(ing.toLowerCase()));
    if (!regla) {
      problemas.push(`${r.id}: sin alimento para «${ing}»`);
      continue;
    }
    const { q, u } = medida(ing);
    const gPorMedida = regla.g[u] ?? (u === 'unidad' ? undefined : regla.g.unidad);
    if (gPorMedida === undefined) {
      problemas.push(`${r.id}: «${ing}» → sin equivalencia en gramos para la medida «${u}» de ${regla.usda}`);
      continue;
    }
    const gramos = Math.round(q * gPorMedida * 10) / 10;
    const n = tabla[regla.usda].por_100g;
    const f = gramos / 100;
    const aporte = { kcal: n.kcal * f, prot: n.prot * f, carb: n.carb * f, gras: n.gras * f, fibra: n.fibra * f };
    for (const k of Object.keys(tot)) tot[k] += aporte[k];
    detalle.push({ texto: ing, alimento: regla.usda, fdc_id: tabla[regla.usda].fdc_id, gramos });
    filas.push(
      [r.id, ing, regla.usda, tabla[regla.usda].fdc_id, gramos, ...['kcal', 'prot', 'carb', 'gras', 'fibra'].map((k) => aporte[k].toFixed(1)), regla.nota ?? '']
        .map((x) => `"${String(x).replace(/"/g, '""')}"`)
        .join(','),
    );
  }
  if (!r.estimado_ia) r.estimado_ia = { kcal: r.kcal, prot: r.prot, carb: r.carb, gras: r.gras, fibra: r.fibra };
  const antes = r.estimado_ia;
  r.kcal = Math.round(tot.kcal / 5) * 5;
  r.prot = Math.round(tot.prot);
  r.carb = Math.round(tot.carb);
  r.gras = Math.round(tot.gras);
  r.fibra = Math.round(tot.fibra);
  r.ingredientes_g = detalle;
  resumen.push(`${r.id.padEnd(4)} ${String(antes.kcal).padStart(4)} → ${String(r.kcal).padStart(4)} kcal  (${r.nombre})`);
}

banco.version = '0.2-borrador';
banco.fecha = new Date().toISOString().slice(0, 10);
banco.estado =
  'BORRADOR. Kcal y macros por porción CALCULADOS ingrediente por ingrediente con la tabla USDA FoodData Central (SR Legacy 2018-04) y equivalencias de medidas caseras documentadas en herramientas/nutricion/mapa.mjs. Pendiente de validación por la nutricionista (ver datos/metodo-y-fuentes.md). Los valores de la primera versión (estimados por IA) se conservan en `estimado_ia`.';
banco.fuente_nutricion = FUENTE;
writeFileSync(rutaRecetas, JSON.stringify(banco, null, 2) + '\n');
writeFileSync(new URL('../../datos/alimentos-usda.json', import.meta.url), JSON.stringify({ fuente: FUENTE, alimentos: tabla }, null, 2) + '\n');
writeFileSync(new URL('../../datos/nutricion-por-ingrediente.csv', import.meta.url), '﻿' + filas.join('\r\n'));

console.log(resumen.join('\n'));
console.log(problemas.length ? `\nPROBLEMAS (${problemas.length}):\n${problemas.join('\n')}` : '\nSin problemas de mapeo.');
