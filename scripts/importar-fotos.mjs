// Uso: node scripts/importar-fotos.mjs "C:\ruta\a\la\carpeta"
// Toma las fotos con nombre de receta (ej. "a05. Wraps de pollo.png" o "d03.jpg"), y para cada una crea en public/recetas:
//   <id>.jpg   → 640 px de ancho (tarjetas y hoja de receta)
//   <id>-s.jpg → 240 px de ancho (miniaturas de 56-96 px, también en pantallas 2x)
// Sin argumentos: genera la miniatura de las fotos que ya están en public/recetas.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const raiz = process.cwd();
const salida = join(raiz, 'public/recetas');
const ids = new Set(JSON.parse(readFileSync(join(raiz, 'datos/recetas.json'), 'utf8')).recetas.map((r) => r.id));
const carpeta = process.argv[2];

async function crear(origen, id) {
  const base = sharp(origen).rotate();
  await base.clone().resize({ width: 640, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(join(salida, `${id}.tmp.jpg`));
  await base.clone().resize({ width: 240, withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toFile(join(salida, `${id}-s.jpg`));
  const { renameSync } = await import('node:fs');
  renameSync(join(salida, `${id}.tmp.jpg`), join(salida, `${id}.jpg`));
}

let n = 0;
if (carpeta) {
  for (const f of readdirSync(carpeta)) {
    const m = /^([a-z]{1,2})\.?(\d{2})/i.exec(f);
    if (!m) continue;
    const id = m[1].toLowerCase() + m[2];
    if (!ids.has(id)) {
      console.log('sin receta para', f);
      continue;
    }
    await crear(join(carpeta, f), id);
    n++;
  }
} else {
  for (const f of readdirSync(salida)) {
    const m = /^([a-z]{1,2}\d{2})\.jpg$/.exec(f);
    if (!m || existsSync(join(salida, `${m[1]}-s.jpg`))) continue;
    const bytes = readFileSync(join(salida, f));
    await crear(bytes, m[1]);
    n++;
  }
}
const total = readdirSync(salida).filter((f) => f.endsWith('.jpg') && !f.endsWith('-s.jpg')).length;
console.log(`${n} fotos procesadas · ${total} recetas con foto · ${Math.round(readdirSync(salida).reduce((s, f) => s + statSync(join(salida, f)).size, 0) / 1024)} KB en total`);
