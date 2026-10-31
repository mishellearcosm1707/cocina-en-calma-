# VEREDICTO revisor-visual — Landing (segunda revisión, tras correcciones)
Fecha: 2026-10-31 04:00
Screenshot: docs/revisiones/landing-375.png (tramos _seg0.._seg3.png, 375x6631)
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN

## Puntajes
- Usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3 = 31 (h2 sube a 4: CTA unificado y sin jerga; h5/h9 casi N/A en landing sin formularios). Umbral 36: faltan 5.
- Craft: jerarquía 3 · profundidad 3 · identidad 2 · movimiento 3 · encaje 3 = 14/20. Umbral 16: faltan 2.
- Copy: idea 3 · especificidad 3 · emoción 4 · oferta 3 · acción 3 = 16/20. Pasa justo el umbral y ningún eje ≤2, pero bajó un punto frente a 17 por la promesa de pago inconsistente (acción/oferta).

## Test de fidelidad (6 puntos) — FIEL, 0 de 6 fallos
1. Modo claro cálido: pasa. 2. Acento oliva #4F6F2B, misma familia: pasa. 3. Display serif suave (Fraunces) + Nunito: pasa. 4. Radios 16-18px: pasa. 5. Densidad aireada: pasa. 6. Sombras difusas y sutiles: pasa.
Matiz fuera del test: la referencia es fotografía real; aquí hay emojis (hallazgo 2). Anti-clon: crema+verde+serif roza "Capítulo", pero fuentes distintas y paleta fijada por el usuario en FICHA-ARTE; no se penaliza como clon.

## Estado de la 1ª pasada
- CORREGIDOS: verbo del CTA de oferta (idéntico al hero), garantía nombrada junto al CTA, bloque de contraste redundante de Agitación, logo del footer con acento, Hotmart retirado, FAQ de pago por país, mockups sin botones inferiores.
- PARCIAL: mecanismo nombrado en el hero (en código sí, en render sale truncado: ver 1); apariencia de botón en elementos no interactivos; especificidad; FAQ (falta "ya dejé gluten y lácteos").
- ABIERTOS: fotos de comida = emojis (aceptado, en ESTADO.md); alineación de títulos mixta; movimiento sin stagger en hero ni conteo del precio; logo footer 20px/r6 vs header 24px/r8.

## Hallazgos por severidad

### ALTO
1. [ABIERTO — NUEVO en la 1ª pasada, sin corregir] Subtítulo del hero truncado con "…": render muestra "El Menú Calma arma tu día según tu síntoma y lo que tienes en…". Causa: app/page.tsx:29 tiene 15 palabras y Hero.tsx:54 aplica truncarMarcado(…, 14). Fix: reescribir a ≤14 palabras (ej. "El Menú Calma arma tu día con tu síntoma y lo que hay en casa") y que el truncado falle en build en vez de cortar en silencio.
2. [ABIERTO, aceptado] Identidad ownable débil: emojis sobre degradados en las 4 tarjetas del hero y chips de síntoma del mock con emojis de sistema mezclados. Es el techo del eje identidad (2/4). Fix: fotografía cenital real o set propio de ilustraciones.
3. [PARCIAL] Apariencia de botón sin acción: chip "el Menú Calma" con borde/hairline (Solucion.tsx:74-78), cuadros 01-03 con relleno y borde de botón, pills oliva/blancas del mock. Fix: chip como etiqueta plana, numerales sin caja.
4. [PARCIAL] Especificidad: "Una sola consulta con nutricionista cuesta más" sin cifra; "60 recetas" sin inventario verificable. Fix: cifra con fuente en FICHA-MERCADO o quitar el claim; confirmar el 60.

### MEDIO
5. [NUEVO] Lógica de pago contradictoria. Hero y cierre dicen "Pago único de $14.99 · Garantía de 15 días"; la oferta dice "Pagas solo si te quedas con tu menú"; la Garantía promete "devolvemos todo tu pago". Si pagas solo al quedarte, ¿qué se reembolsa? Fix: una frase única repetida en hero, oferta, garantía, FAQ y PS ("Pruebas gratis hoy; si lo conservas pagas $14.99 una vez y tienes 15 días para pedir reembolso").
6. [NUEVO] Mock del hero cortado a media tarjeta (fila 3-4, pill "Hinchazón" a medias) con vacío del marco debajo; parece recorte descuidado. Fix: cortar tras una fila completa o fundir a crema.
7. [ABIERTO] Alineación de títulos: izquierda en Problema/Solución/FAQ, centro en App/Oferta/Garantía. Fix: una convención única.
8. [NUEVO] H2 de Garantía empieza en minúscula "la Garantía Calma de 15 días" (page.tsx:105). Fix: capitalizar.

### BAJO
9. [ABIERTO] Movimiento: hero sin stagger, precio sin conteo, mock estático (reveal por sección, whileTap, acordeón y reduced-motion sí cumplen).
10. [CASI CERRADO] Logo footer 20px/r6 vs header 24px/r8.
11. [PARCIAL] FAQ sin objeción "ya dejé gluten y lácteos".
12. [NUEVO] Candado en "15 días para decidir" sugiere seguridad de pago; usar reloj/calendario.

## Gate de carga cognitiva
Fallan 2 de 8 (elementos que parecen interactivos y no lo son; Big Idea en el límite de 3-4 líneas). Sin sobrecarga crítica.

## CTA héroe vivo
Pasa los 4 (contraste ~5.5:1, whileTap/hover, nunca disabled, 52px ancho completo; sticky 48px). Un solo tipo de acción repetido.

## Para llegar a LISTA
- Usabilidad +5: arreglar 1, 3, 5, 6, 8 (criterios 2, 4, 8, 10 pueden pasar a 4).
- Craft +2: sin fotografía o ilustración propia el techo ronda 15/20; el cierre real es el hallazgo 2, más stagger en hero y conteo del precio (9) y fix del recorte (6) para sumar en movimiento y encaje.
