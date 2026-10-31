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

## 2. Valor nutricional de las recetas (CALCULADO con tablas, 2026-10-31)
**Fuente principal: INCAP/OPS, Tabla de Composición de Alimentos de Centroamérica**, 2.ª ed. (3.ª reimpresión, 2012; Menchú y Méndez), Primera Sección, valores por 100 g de porción comestible. **Respaldo: USDA FoodData Central, SR Legacy (abril 2018)**, solo para los alimentos que el INCAP no trae.
Proceso (reproducible): `node herramientas/nutricion/calcular.mjs <carpeta-usda> <texto-incap.txt>`
1. Cada ingrediente se asocia a un alimento de la tabla INCAP (código) o, si no existe, de la USDA (`herramientas/nutricion/mapa.mjs`).
2. La medida casera (taza, cda, palma, unidad…) se convierte a gramos con equivalencias documentadas en ese archivo.
3. Energía, proteína, carbohidratos, grasas y fibra = valor por 100 g × gramos ÷ 100, sumado por receta. Los valores de la primera versión (estimados por IA) quedan en `estimado_ia`.
Salidas: `datos/recetas.json` (v0.3), `datos/alimentos.json` (alimento, fuente y código usados), `datos/nutricion-por-ingrediente.csv` (fuente, código, gramos y aporte de CADA ingrediente, para revisión).
Resultado: 200 de 283 ingredientes salieron de la tabla INCAP y 83 de la USDA. Promedio por porción: 315 kcal (la estimación inicial de IA era 381). Medias: desayuno 297 · almuerzo 456 · merienda 184 · cena 324 kcal.
Diferencias INCAP vs USDA en el mismo alimento (kcal/100 g): atún en agua 128 vs 86 · queso blanco fresco semidescremado 173 vs queso fresco 299 · zapallo 30 vs 20 (cocido) · camote cocido 76 vs 90 · camarón cocido 99 vs 119.

### Cómo se leyó la tabla INCAP
El PDF concatena las columnas sin separador; `herramientas/nutricion/incap.mjs` las separa y resuelve la unión energía/proteína con la regla de Atwater (kcal ≈ 4·P + 4·C + 9·G). Se leyeron 1.392 alimentos y los usados se revisaron a mano. La columna de fibra de dos filas mal leídas (>40 g) se descarta.

### Límites y proxies a revisar por la nutricionista
- El INCAP no trae (se usa USDA): tofu, kéfir, yogur griego, pavo molido, quinoa, hummus, hinojo, arándanos, dátil medjool, chía, linaza, aceite de oliva, leche de almendras, cúrcuma, pimienta, palomitas sin sal, lenteja y garbanzo cocidos, frijol negro cocido, arroz integral cocido, fideo integral cocido, filete de atún fresco.
- Valores crudos usados para recetas cocidas (INCAP solo trae la forma cruda): yuca raíz, zapallo/ayote amarillo, zucchini, repollo, huevo (también para huevo cocido). Efecto pequeño salvo en la yuca.
- Supuestos: queso fresco = queso blanco fresco de leche semidescremada · pescado blanco = tilapia cruda · tortilla integral = tortilla de harina · yogur griego sin grasa.
- Equivalencias estimadas (no tabuladas): berenjena mediana 300 g · zapallo 190 g por taza · palma de proteína 100 g (130 g de tofu) · camarón mediano 7 g.
- La tabla INCAP no se redistribuye: se citan sus códigos y se usan los valores para calcular. El PDF consultado es una copia alojada por la UNAM (portalacademico.cch.unam.mx); la edición oficial se obtiene en INCAP (www.incap.int).
