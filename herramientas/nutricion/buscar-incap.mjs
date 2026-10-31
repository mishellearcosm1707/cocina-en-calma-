// Uso: node herramientas/nutricion/buscar-incap.mjs <tca.txt> "<regex>" ["<regex>" ...]
// Muestra hasta 5 filas de la tabla INCAP por consulta (código, nombre, kcal, P, G, C, fibra, error Atwater).
import { leerINCAP } from './incap.mjs';

const [txt, ...consultas] = process.argv.slice(2);
const filas = leerINCAP(txt);
for (const q of consultas) {
  const re = new RegExp(q, 'i');
  const hits = filas.filter((f) => re.test(f.nombre)).slice(0, 5);
  console.log(`\n== ${q}${hits.length ? '' : '  (sin resultados)'}`);
  hits.forEach((f) =>
    console.log(`  ${f.codigo} ${f.nombre.slice(0, 70)} | ${f.kcal} kcal P${f.prot} G${f.gras} C${f.carb} F${f.fibra} e${f.error_atwater}%`),
  );
}
