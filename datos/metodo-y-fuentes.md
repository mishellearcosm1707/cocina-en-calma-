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

## 2. Valor nutricional de las recetas (PENDIENTE)
Hoy las kcal y macros de `datos/recetas.json` son ESTIMACIONES hechas con IA. Plan: calcularlos ingrediente por ingrediente con una tabla de composición de alimentos y pasar las medidas caseras (taza, cucharada, palma) a gramos con equivalencias documentadas.
Fuentes candidatas (la nutricionista elige la principal):
- USDA FoodData Central (SR Legacy / Foundation Foods): la más completa y consultable; datos por 100 g. https://fdc.nal.usda.gov
- Tablas regionales: INCAP (Centroamérica), ICBF (Colombia), BEDCA (España), tablas nacionales de Ecuador, FAO/INFOODS (bases regionales). Se usan para contrastar los alimentos locales (yuca, zapallo, plátano verde, etc.).
Regla: cada ingrediente lleva su fuente, código y fecha de consulta; si falta un dato, se escribe NO ENCONTRADO.
