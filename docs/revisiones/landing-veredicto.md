# VEREDICTO revisor-visual — Landing (cuarta revisión)
Fecha: 2026-10-31 06:00
Screenshot: docs/revisiones/landing-375.png (tramos _seg0.._seg4.png, 375x6839)
Usabilidad: 36/40
Craft: 16/20
Copy: 17/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA

## Puntajes
- Usabilidad: h1:3 h2:4 h3:3 h4:4 h5:3 h6:4 h7:3 h8:4 h9:3 h10:3 = 36/40. h4 y h8 suben a 4: etiqueta subrayada y numerales de texto ya no parecen botones; hero con una sola acción primaria y menú completo. Justo en el umbral.
- Craft: jerarquía 3 · profundidad 3 · identidad 3 · movimiento 4 · encaje 3 = 16/20. Movimiento sube a 4: stagger de entrada del hero, conteo del precio, reduced-motion presente en Hero/Oferta/ui (verificado por grep; los tramos son estáticos, el conteo no se ve en captura). Justo en el umbral.
- Copy: idea 3 · especificidad 3 · emoción 4 · oferta 4 · acción 3 = 17/20. Sin eje <=2.

## Test de fidelidad (6 puntos) — FIEL, 0 de 6 fallos
Modo claro cálido, acento oliva, display serif (Fraunces) + Nunito, radios 16-18px, densidad aireada y sombras difusas: pasan. Anti-clon: crema+verde+serif roza "Capítulo", pero fuentes distintas y paleta fijada en FICHA-ARTE; no se penaliza.

## Estado de la 3ª pasada
- CORREGIDOS: hero con menú completo de 4 comidas y leyenda "Imágenes ilustrativas"; stagger del hero; conteo del precio; chip del mecanismo y 01-03 sin aspecto de botón; carrusel empieza por el menú con fotos y sin marcos vacíos; copy del menú real coherente.
- ABIERTOS: sin testimonios (decisión documentada); fotos generadas con IA (mitigado con leyenda); alineación de títulos mixta; "Una sola consulta con nutricionista cuesta más" sin cifra; "60 recetas" solo 8 con foto; FAQ sin objeción gluten/lácteos; candado en "15 días para decidir".

## Hallazgos por severidad
### ALTO
Ninguno.
### MEDIO
1. [ABIERTO] Especificidad: claim de nutricionista sin cifra con fuente; "60 recetas" no verificable en pantalla. Fix: cifra de FICHA-MERCADO o quitar; decir "60" solo si existen.
2. [ABIERTO] Alineación de títulos mixta (izq. Problema/Solución/FAQ, centro App/Oferta/Garantía). Fix: convención única.
3. [ABIERTO] Prueba social ausente: sin testimonios; las fotos son ilustrativas. Mantener la leyenda y sumar garantía visible cerca del CTA (ya existe).
### BAJO
4. [NUEVO] Carrusel: la primera slide termina con Merienda/Cena asomando recortadas tras la fila 1 dentro del marco del teléfono; aceptable por ser marco de teléfono, pero un fundido a crema lo pulirían.
5. [ABIERTO] FAQ sin "ya dejé gluten y lácteos"; candado en "15 días para decidir"; logo footer vs header; footer con aire sobrante al final (_seg4).

## Gate de carga cognitiva
0-1 fallas de 8. Sin sobrecarga.

## CTA héroe vivo
Pasa los 4 (contraste ~5.5:1, tap definido, nunca disabled, 52px ancho completo).

## Margen
Aprobada por un punto en usabilidad y en craft; cualquier regresión en esos ejes la devuelve a corrección.
