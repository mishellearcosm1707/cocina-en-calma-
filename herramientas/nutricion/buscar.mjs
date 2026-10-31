// Uso: node herramientas/nutricion/buscar.mjs <carpeta-usda> "<regex>" [...otras regex]
// Lista las descripciones de la tabla USDA que coinciden (máx. 14 por búsqueda).
import { leerCSV } from './csv.mjs';

const [dir, ...consultas] = process.argv.slice(2);
const foods = leerCSV(`${dir}/food.csv`);
for (const q of consultas) {
  const re = new RegExp(q, 'i');
  console.log(`\n== ${q}`);
  foods
    .filter((f) => re.test(f.description))
    .slice(0, 14)
    .forEach((f) => console.log(`${f.fdc_id}  ${f.description}`));
}
