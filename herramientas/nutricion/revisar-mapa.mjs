// Uso: node herramientas/nutricion/revisar-mapa.mjs <carpeta-usda>
// Comprueba que cada alimento del mapa exista EXACTO en la tabla USDA y sugiere alternativas si no.
import { leerCSV } from './csv.mjs';
import { MAPA } from './mapa.mjs';

const dir = process.argv[2];
const foods = leerCSV(`${dir}/food.csv`);
const nombres = new Set(foods.map((f) => f.description));
const faltan = [...new Set(MAPA.map((m) => m.usda))].filter((d) => !nombres.has(d));
console.log(`alimentos USDA distintos: ${new Set(MAPA.map((m) => m.usda)).size} · sin coincidencia exacta: ${faltan.length}`);
for (const d of faltan) {
  const clave = d.split(',').slice(0, 2).join(',').split(' ')[0].replace(/[()]/g, '');
  const sug = foods.filter((f) => f.description.toLowerCase().includes(d.split(',')[0].toLowerCase())).slice(0, 6).map((f) => f.description);
  console.log(`\n✗ ${d}\n   sugerencias: ${sug.join(' | ') || '(ninguna: ' + clave + ')'}`);
}
