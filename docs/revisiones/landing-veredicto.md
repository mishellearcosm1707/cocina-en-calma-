# VEREDICTO revisor-visual — Landing (tercera revisión)
Fecha: 2026-10-31 05:00
Screenshot: docs/revisiones/landing-375.png (tramos _seg0.._seg3.png, 375x6666)
Usabilidad: 34/40
Craft: 15/20
Copy: 17/20
Copy (si vende): 17/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN

## Puntajes
- Usabilidad: h1:3 h2:4 h3:3 h4:3 h5:3 h6:4 h7:3 h8:3 h9:3 h10:3 = 34 (umbral 36: faltan 2). h6 sube a 4: capturas reales muestran el producto sin imaginarlo.
- Craft: jerarquía 3 · profundidad 3 · identidad 3 · movimiento 3 · encaje 3 = 15/20 (umbral 16: falta 1). Identidad sube de 2 a 3 por fotografía de platos y capturas reales; no llega a 4 porque las fotos son generadas con IA y es un tratamiento de foto sin detalle firma propio.
- Copy: idea 3 · especificidad 3 · emoción 4 · oferta 4 · acción 3 = 17/20. Sin eje <=2. Oferta sube por flujo de pago coherente.

## Test de fidelidad (6 puntos) — FIEL, 0 de 6 fallos
1. Modo claro cálido: pasa. 2. Acento oliva, misma familia: pasa. 3. Display serif (Fraunces) + Nunito: pasa. 4. Radios 16-18px: pasa. 5. Densidad aireada: pasa. 6. Sombras difusas sutiles: pasa. Ahora además la fotografía real acerca el resultado a las referencias. Anti-clon: crema+verde+serif roza "Capítulo", pero fuentes distintas y paleta fijada en FICHA-ARTE; no se penaliza.

## Estado de la 2ª pasada
- CORREGIDOS: subtítulo del hero sin truncar; flujo de pago coherente en hero, oferta, PS y cierre; título de Garantía en mayúscula; emojis reemplazados por fotos y capturas reales; carrusel con pantallas reales.
- ABIERTOS: chip "el Menú Calma" y cuadros 01-03 con aspecto de botón; "Una sola consulta con nutricionista cuesta más" sin cifra; "60 recetas" (solo 8 con foto, no verificable); alineación de títulos mixta (izq. Problema/Solución/FAQ, centro App/Oferta/Garantía); hero sin stagger y precio sin conteo (Hero.tsx sin ninguna animación de entrada); FAQ sin "ya dejé gluten y lácteos"; candado en "15 días para decidir".

## Hallazgos por severidad
### ALTO
1. [NUEVO] Sección "Así se ve por dentro": la primera captura va cortada con el marco del teléfono vacío (zona entre "Digestión ligera" y "Siguiente", ~300px de crema) y la siguiente asoma a la derecha. Fix: recortar la captura al contenido o ajustar altura del marco; el carrusel no muestra el menú con fotos, que es lo más vendedor: ponerlo como primera slide.
2. [ABIERTO] Elementos con apariencia de botón sin acción (chip del mecanismo, 01-03). Fix: etiqueta plana y numerales sin caja.
3. [ABIERTO] Especificidad: claim de nutricionista sin cifra con fuente; "60 recetas" sin inventario. Fix: cifra de FICHA-MERCADO o quitar; decir "60" solo si existen.
### MEDIO
4. [ABIERTO] Movimiento: hero sin stagger, precio sin conteo; hoy es lo que impide el 16/20 de craft. Fix: stagger 60ms en titular, subtítulo, CTA y captura; contar $14.99 al entrar en vista.
5. [NUEVO/ABIERTO] Captura del hero cortada a media fila (Merienda/Cena) con corte brusco. Fix: fundido a crema o cortar tras fila completa.
6. [ABIERTO] Alineación de títulos mixta. Fix: convención única.
7. [NUEVO] Honestidad de la prueba: sin testimonios y fotos generadas con IA; mantener la leyenda "imagen ilustrativa" cerca de las fotos para no prometer resultado fotográfico.
### BAJO
8. FAQ sin objeción gluten/lácteos; candado donde va reloj; logo footer vs header.

## Gate de carga cognitiva
Falla 1-2 de 8 (elementos con aspecto interactivo). Sin sobrecarga crítica.

## CTA héroe vivo
Pasa los 4 (contraste ~5.5:1, tap definido, nunca disabled, 52px ancho completo). Texto de apoyo de pago consistente.

## Para llegar a LISTA
- Craft +1: stagger del hero + conteo del precio (4) y arreglar los recortes (1 y 5).
- Usabilidad +2: resolver 1 y 2 (criterios 4 y 8 a 4) y 3 (criterio 1/10).
