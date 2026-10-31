import { readFileSync } from 'node:fs';

/** Lector CSV mínimo (campos entre comillas, comillas dobles escapadas). Devuelve filas como objetos. */
export function leerCSV(ruta) {
  const t = readFileSync(ruta, 'utf8');
  const filas = [];
  let campo = '';
  let fila = [];
  let q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          campo += '"';
          i++;
        } else q = false;
      } else campo += c;
    } else if (c === '"') q = true;
    else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo.replace(/\r$/, ''));
      filas.push(fila);
      fila = [];
      campo = '';
    } else campo += c;
  }
  if (campo || fila.length) {
    fila.push(campo);
    filas.push(fila);
  }
  const cab = filas.shift();
  return filas.filter((f) => f.length === cab.length).map((f) => Object.fromEntries(cab.map((k, i) => [k, f[i]])));
}
