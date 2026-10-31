# Método de cálculo y fuentes — Cocina en Calma
Estado: método APROBADO por la nutricionista el 2026-10-31 en lo de energía; factores de proteína y base de composición de alimentos por validar.

## 1. Requerimientos del día (lib/calculos.ts)
| Paso | Regla | Fuente |
|---|---|---|
| Gasto en reposo | Mifflin-St Jeor: 10·peso + 6.25·talla − 5·edad + 5 (hombre) / − 161 (mujer) | Mifflin MD, St Jeor ST et al. *A new predictive equation for resting energy expenditure in healthy individuals.* Am J Clin Nutr 1990;51:241-247 |
| Actividad | ×1.2 sedentaria · ×1.375 ligera · ×1.55 moderada · ×1.725 alta | Factores de actividad habituales (tipo Harris-Benedict). Alternativa: PAL de FAO/OMS/UNU 2001 *Human energy requirements* |
| Objetivo | Mantener ×1.0 · **Bajar ×0.90 (solo en pérdida de peso)** · Subir ×1.10 | Criterio de la nutricionista (2026-10-31); "subir" a confirmar |
| Piso de seguridad | **Nunca menos de 1200 kcal (mujeres) ni 1500 kcal (hombres)**, con cualquier objetivo | Criterio de la nutricionista (2026-10-31) |
| Proteína | g/kg: 0.8 sedentaria · 1.0 ligera · 1.2 moderada · 1.4 alta | RDA 0.8 g/kg: IOM, *Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein and Amino Acids*, National Academies Press, 2005 · FAO/OMS/UNU, *Protein and amino acid requirements in human nutrition*, WHO TRS 935, 2007 (0.83 g/kg) · Thomas, Erdman, Burke. Position of AND, DC y ACSM: Nutrition and athletic performance. J Acad Nutr Diet 2016;116:501-528 (1.2–2.0 g/kg en deportistas). **Escalones por actividad = propuesta a validar** |
| Grasas | 30% de la energía (÷9) | AMDR del IOM 2005: 20–35% |
| Carbohidratos | Lo que resta de energía (÷4) | AMDR del IOM 2005: 45–65% |
| Fibra | 14 g por 1000 kcal | DRI/IOM 2005 |

Ejemplo (mujer, 34 años, 62 kg, 160 cm, actividad ligera, mantener): ≈1770 kcal · 62 g proteína · 59 g grasas · 248 g carbohidratos · 25 g fibra.

## 2. Valor nutricional de las recetas (CALCULADO con tabla, 2026-10-31)
Tabla usada: **USDA FoodData Central, SR Legacy (abril 2018)** — https://fdc.nal.usda.gov (descargada el 2026-10-31, datos por 100 g). 80 alimentos del mapa verificados contra su descripción exacta.
Proceso (reproducible): `node herramientas/nutricion/calcular.mjs <carpeta-usda>`
1. Cada ingrediente de cada receta se asocia a un alimento de la tabla (`herramientas/nutricion/mapa.mjs`).
2. La medida casera (taza, cda, palma, unidad…) se convierte a gramos con equivalencias documentadas en ese mismo archivo (USDA cuando existe; estimación marcada si no).
3. Energía, proteína, carbohidratos, grasas y fibra = valores por 100 g × gramos ÷ 100, sumados por receta. El valor de la primera versión (estimado por IA) queda en `estimado_ia`.
Salidas: `datos/recetas.json` (v0.2), `datos/alimentos-usda.json` (nutrientes por 100 g y código FDC de cada alimento), `datos/nutricion-por-ingrediente.csv` (gramos y aporte de CADA ingrediente, para revisión).
Resultado: promedio por porción 318 kcal (antes, por estimación de IA: 381). Medias: desayuno 295 · almuerzo 459 · merienda 188 · cena 329 kcal.

### Límites y proxies a revisar por la nutricionista
- Sin cocción/absorción de aceite más allá de lo escrito en la receta; pesos de alimentos cocidos tomados de la tabla "cooked".
- Proxies: yuca (la tabla trae solo cruda) · tortilla integral → tortilla de harina · queso fresco → "Cheese, fresh, queso fresco" · caldo de verduras → "Soup, vegetable broth" · yogur griego natural = sin grasa (supuesto) · pescado blanco = tilapia cruda · pavo molido cocido.
- Equivalencias estimadas (no USDA): berenjena mediana 300 g · zapallo 190 g por taza · palma de proteína 100 g (130 g tofu) · camarón mediano 7 g.
- Tablas regionales para contrastar alimentos locales (INCAP, ICBF, BEDCA, tablas nacionales de Ecuador): pendiente, a elección de la nutricionista.
