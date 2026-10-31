// Calcula el valor nutricional de cada receta ingrediente por ingrediente.
// Fuente principal: INCAP/OPS (Tabla de Composición de Alimentos de Centroamérica, 2ª ed. 2012). Respaldo: USDA FoodData Central SR Legacy.
// Uso: node herramientas/nutricion/calcular.mjs <carpeta-usda> <texto-incap.txt>
// Salidas: datos/alimentos.json · datos/recetas.json (kcal/macros recalculados) · datos/nutricion-por-ingrediente.csv
import { readFileSync, writeFileSync } from 'node:fs';
import { leerCSV } from './csv.mjs';
import { leerINCAP } from './incap.mjs';
import { MAPA } from './mapa.mjs';

const [dirUSDA, txtINCAP] = process.argv.slice(2);
const FUENTES = {
  INCAP: 'INCAP/OPS, Tabla de Composición de Alimentos de Centroamérica, 2.ª ed. (3.ª reimpresión, 2012), Primera Sección, por 100 g de porción comestible',
  USDA: 'USDA FoodData Central, SR Legacy (abril 2018) — https://fdc.nal.usda.gov',
};
const NUTR = { 1008: 'kcal', 2047: 'kcal_atwater_g', 2048: 'kcal_atwater_e', 1003: 'prot', 1004: 'gras', 1005: 'carb', 1079: 'fibra' };

// 1) USDA (respaldo y contraste)
const foods = leerCSV(`${dirUSDA}/food.csv`);
const idPorDescripcion = new Map(foods.map((f) => [f.description, f.fdc_id]));
const idsUSDA = new Map([...new Set(MAPA.map((m) => m.usda))].map((d) => [idPorDescripcion.get(d), d]));
const valoresUSDA = new Map([...idsUSDA.keys()].map((id) => [id, {}]));
for (const r of leerCSV(`${dirUSDA}/food_nutrient.csv`)) {
  if (idsUSDA.has(r.fdc_id) && NUTR[r.nutrient_id]) valoresUSDA.get(r.fdc_id)[NUTR[r.nutrient_id]] = parseFloat(r.amount);
}
const usda = {};
for (const [id, desc] of idsUSDA) {
  const v = valoresUSDA.get(id);
  usda[desc] = {
    fuente: 'USDA',
    codigo: Number(id),
    nombre: desc,
    por_100g: { kcal: v.kcal ?? v.kcal_atwater_g ?? v.kcal_atwater_e ?? 0, prot: v.prot ?? 0, carb: v.carb ?? 0, gras: v.gras ?? 0, fibra: v.fibra ?? 0 },
  };
}

// 2) INCAP
const incapFilas = new Map(leerINCAP(txtINCAP).map((f) => [f.codigo, f]));
const incap = {};
for (const m of MAPA.filter((x) => x.incap)) {
  const f = incapFilas.get(m.incap);
  if (!f) throw new Error(`INCAP: no encuentro el código ${m.incap}`);
  incap[m.incap] = {
    fuente: 'INCAP',
    codigo: m.incap,
    nombre: f.nombre,
    por_100g: { kcal: f.kcal, prot: f.prot, carb: f.carb, gras: f.gras, fibra: f.fibra > 40 ? 0 : f.fibra },
  };
}

function alimentoDe(regla) {
  return regla.incap ? incap[regla.incap] : usda[regla.usda];
}

// 3) Medidas caseras → gramos
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

// 4) Recetas
const rutaRecetas = new URL('../../datos/recetas.json', import.meta.url);
const banco = JSON.parse(readFileSync(rutaRecetas, 'utf8'));
const filas = ['receta,ingrediente,fuente,codigo,alimento,gramos,kcal,prot_g,carb_g,gras_g,fibra_g,nota'];
const problemas = [];
const resumen = [];
const usoFuente = { INCAP: 0, USDA: 0 };

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
      problemas.push(`${r.id}: «${ing}» → sin equivalencia en gramos para la medida «${u}»`);
      continue;
    }
    const gramos = Math.round(q * gPorMedida * 10) / 10;
    const al = alimentoDe(regla);
    const n = al.por_100g;
    const f = gramos / 100;
    const aporte = { kcal: n.kcal * f, prot: n.prot * f, carb: n.carb * f, gras: n.gras * f, fibra: n.fibra * f };
    for (const k of Object.keys(tot)) tot[k] += aporte[k];
    usoFuente[al.fuente]++;
    detalle.push({ texto: ing, fuente: al.fuente, codigo: al.codigo, alimento: al.nombre, gramos });
    filas.push(
      [r.id, ing, al.fuente, al.codigo, al.nombre, gramos, ...['kcal', 'prot', 'carb', 'gras', 'fibra'].map((k) => aporte[k].toFixed(1)), regla.nota ?? '']
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

banco.version = '0.3-borrador';
banco.fecha = new Date().toISOString().slice(0, 10);
banco.estado =
  'BORRADOR. Kcal y macros por porción CALCULADOS ingrediente por ingrediente con la tabla INCAP/OPS de Centroamérica (fuente principal) y USDA FoodData Central (respaldo cuando el INCAP no trae el alimento), con equivalencias de medidas caseras documentadas en herramientas/nutricion/mapa.mjs. Pendiente de validación por la nutricionista (ver datos/metodo-y-fuentes.md). Los valores de la primera versión (estimados por IA) se conservan en `estimado_ia`.';
banco.fuente_nutricion = FUENTES;
writeFileSync(rutaRecetas, JSON.stringify(banco, null, 2) + '\n');
writeFileSync(
  new URL('../../datos/alimentos.json', import.meta.url),
  JSON.stringify({ fuentes: FUENTES, alimentos: [...Object.values(incap), ...Object.values(usda)] }, null, 2) + '\n',
);
writeFileSync(new URL('../../datos/nutricion-por-ingrediente.csv', import.meta.url), '﻿' + filas.join('\r\n'));

// 5) Contraste INCAP vs USDA en los alimentos que tienen ambos
const contraste = [];
for (const m of MAPA.filter((x) => x.incap)) {
  const a = incap[m.incap].por_100g.kcal;
  const b = usda[m.usda].por_100g.kcal;
  contraste.push({ n: incap[m.incap].nombre.slice(0, 44), a, b, d: b ? Math.round(((a - b) / b) * 100) : 0 });
}
console.log(resumen.join('\n'));
console.log(`\nIngredientes calculados con INCAP: ${usoFuente.INCAP} · con USDA: ${usoFuente.USDA}`);
console.log('Mayores diferencias INCAP vs USDA (kcal/100 g):');
contraste
  .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
  .slice(0, 10)
  .forEach((c) => console.log(`  ${c.n.padEnd(46)} INCAP ${String(c.a).padStart(4)} · USDA ${String(c.b).padStart(4)} (${c.d > 0 ? '+' : ''}${c.d}%)`));
console.log(problemas.length ? `\nPROBLEMAS (${problemas.length}):\n${problemas.join('\n')}` : '\nSin problemas de mapeo.');
