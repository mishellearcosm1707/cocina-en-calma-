// Lee el texto extraído de la Tabla de Composición de Alimentos de Centroamérica (INCAP/OPS, 2ª ed., 2012)
// y devuelve las filas de la Primera Sección (por 100 g de porción comestible):
// código, nombre, agua %, energía kcal, proteína g, grasa g, carbohidratos g, fibra g.
// El PDF concatena las columnas sin separador (p. ej. "AYOTE…91.00300.600.207.600.500.60…"), así que el reparto
// energía/proteína se resuelve con la regla de Atwater (kcal ≈ 4·P + 4·C + 9·G): se elige el corte más coherente.
import { readFileSync } from 'node:fs';

export function leerINCAP(rutaTxt) {
  const lineas = readFileSync(rutaTxt, 'utf8').split('\n');
  const ini = lineas.findIndex((l) => /^Parte II\.\s+TABLA DE COMPOSICI/.test(l));
  const fin = lineas.findIndex((l, i) => i > ini && /^Parte III\.\s+AP/.test(l));
  const filas = [];
  for (const l of lineas.slice(ini, fin)) {
    const m = l.match(/^(\d{4,5})\s*(\S.*?)(\d{1,3}\.\d{2})(\d.*)$/);
    if (!m) continue;
    const [, codigo, nombreCrudo, agua, resto] = m;
    const r = resto.replace(/\s+/g, '');
    const num = r.match(/^(\d+)(\d+\.\d{2})(\d+\.\d{2})(\d+\.\d{2})(\d+\.\d{2})/);
    if (!num) continue;
    // Resto = energía(entera) + proteína + grasa + carbohidratos + fibra (todos con 2 decimales salvo la energía).
    const cola = r.match(/^(\d+?)((?:\d+\.\d{2}){4})/);
    if (!cola) continue;
    let mejor = null;
    const digitos = r.match(/^\d+/)[0]; // energía + parte entera de la proteína
    const primerDecimal = r.indexOf('.');
    const cabeza = r.slice(0, primerDecimal); // dígitos antes del 1.er decimal = energía + entero de proteína
    for (let k = 1; k <= Math.min(3, cabeza.length - 1); k++) {
      const energia = Number(cabeza.slice(0, cabeza.length - k));
      const enteroProt = cabeza.slice(cabeza.length - k);
      if (k > 1 && enteroProt.startsWith('0')) continue;
      const tail = (enteroProt + r.slice(primerDecimal)).match(/^(\d+\.\d{2})(\d+\.\d{2})(\d+\.\d{2})(\d+\.\d{2})(\d+\.\d{2})?/);
      if (!tail) continue;
      const [prot, gras, carb] = [Number(tail[1]), Number(tail[2]), Number(tail[3])];
      const fibra = Number(tail[4]);
      const atwater = 4 * prot + 9 * gras + 4 * carb;
      const err = Math.abs(energia - atwater) / Math.max(energia, 20);
      if (!mejor || err < mejor.err) mejor = { energia, prot, gras, carb, fibra, err };
    }
    void digitos;
    if (!mejor) continue;
    filas.push({
      codigo,
      nombre: nombreCrudo.replace(/\s+/g, ' ').trim(),
      agua: Number(agua),
      kcal: mejor.energia,
      prot: mejor.prot,
      gras: mejor.gras,
      carb: mejor.carb,
      fibra: mejor.fibra,
      error_atwater: Math.round(mejor.err * 100),
    });
  }
  return filas;
}

if (process.argv[1] && process.argv[1].endsWith('incap.mjs')) {
  const filas = leerINCAP(process.argv[2]);
  const q = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
  console.log(`filas leídas: ${filas.length}`);
  filas
    .filter((f) => !q || q.test(f.nombre))
    .slice(0, 40)
    .forEach((f) => console.log(`${f.codigo} ${f.nombre} | ${f.kcal} kcal | P ${f.prot} G ${f.gras} C ${f.carb} F ${f.fibra} | err ${f.error_atwater}%`));
}
