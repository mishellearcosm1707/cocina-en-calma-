// Convierte la línea de una receta ("1½ taza de arroz integral cocido", "Jugo de 1 limón", "Sal y pimienta") en los
// artículos que se ponen en la lista de compras ("Arroz integral", "Limón", "Sal y pimienta"). Sin dependencias: se puede probar sola.

const UNIDADES =
  /^(tazas?|cdas?|cditas?|cdtas?|palmas?|cucharadas?|cucharaditas?|dientes?|unidades?|unidad|pizcas?|puñados?|rebanadas?|latas?|filetes?|hojas?|ramitas?|rodajas?|ramas?|láminas?|tiras?|sobres?|g|gr|ml)\b\s*/i;
const SOBRAS = /\b(picad[oa]s?|rallad[oa]s?|cocid[oa]s?|fresc[oa]s?|madur[oa]s?|pequeñ[oa]s?|grandes?|median[oa]s?|naturales?|sin sal|en cubos|en rodajas|en tiras|en trozos|en láminas|en gajos|en polvo molido|al gusto|opcional)\b/gi;

function limpiarParte(parte: string): string {
  let t = parte
    .replace(/^[\d½¼¾⅓⅔/.,\s-]+/, '')
    .replace(/^y\s+[½¼¾⅓⅔]\s*/i, '')
    .replace(UNIDADES, '')
    .replace(/^(de|del)\s+/i, '')
    .replace(/^(un|una)\s+(toque|pizca|chorrito|puñado|poco)\s+(de\s+)?/i, '')
    .replace(/^(jugo|ralladura|cáscara)\s+de\s+[\d½¼¾⅓⅔/.\s]*/i, '')
    .replace(/^(un|una|unos|unas)\s+/i, '')
    .replace(SOBRAS, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  t = t.replace(/\s+(de|y|o)$/i, '').trim();
  return t;
}

/** Sal y pimienta son de despensa: todas las variantes cuentan como un solo artículo. */
function esSal(t: string): boolean {
  return /^(sal|pimienta)(\s+(marina|y|negra|molida)\b.*)?$/i.test(t) || /^sal y /i.test(t);
}

export function nombresIngrediente(linea: string): string[] {
  const base = linea
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/,.*$/, '')
    .replace(/\s+y\s+(hech[oa]|escurrid[oa]s?|desmenuzad[oa]s?|picad[oa]s?|rallad[oa]s?|cocid[oa]s?)\b.*$/i, '')
    .replace(/^(jugo|ralladura)\s+y\s+(ralladura|jugo)\s+de\s+/i, 'jugo de ')
    .replace(/\s*\+\s*/g, ' y ');
  const salida: string[] = [];
  for (const parte of base.split(/\s+y\s+/i)) {
    const t = limpiarParte(parte);
    if (t.length < 3) continue;
    const nombre = esSal(t) ? 'Sal y pimienta' : t.charAt(0).toUpperCase() + t.slice(1);
    if (!salida.includes(nombre)) salida.push(nombre);
  }
  return salida;
}

/** Clave para juntar "huevo" y "huevos", "manzana" y "manzanas" en un solo renglón de la lista. */
export function claveIngrediente(nombre: string): string {
  return nombre
    .toLowerCase()
    .split(' ')
    .map((p, i, a) => (i === 0 && a.length === 1 && p.length > 4 && p.endsWith('s') && !p.endsWith('ss') ? p.slice(0, -1) : p))
    .join(' ');
}
