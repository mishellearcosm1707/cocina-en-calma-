# VEREDICTO revisor-visual — onboarding (6ª pasada, 9 pasos)
Fecha: 2026-10-31 19:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 36/40
Craft: 16/20
Copy: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: LISTA

Detalle usabilidad: h1:4 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:4 h9:3 h10:4 (suma 36, coincide con el total)
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4

Pasa justo en el umbral de usabilidad (36). Craft y Copy cumplen (16/16). Ningún eje de copy es menor o igual a 2.

## Gate de carga cognitiva (0 fallas: OK)

## Test de fidelidad (0 de 6 fallos: FIEL)

## Verificado en esta pasada
- Hallazgo 3 (a) CERRADO: en onboarding-eleccion-unica-375.png "Ligera" aparece con borde y fondo de acento y check antes de avanzar. El código bloquea la interacción 300ms (bloqueo) y respeta reduced-motion. Sube h1 a 4.
- Hallazgo 3 (b) PARCIAL: las notas de apoyo en los pasos 4, 5 y 7 aportan valor (explican por qué se pregunta), pero el paso 4 sigue con ~35% de la altura vacía y el paso 3 queda sin cambios. Es aceptable porque el vacío se debe a la altura de la ventana con el botón fijo, pero un ojo atento lo nota.
- Hallazgo 4 CERRADO: los títulos del paso 9 se leen completos ("Sopa de lenteja con jengibre y zanahoria", "Muffins de banano y avena (2 unidades)") con las tarjetas alineadas.

## Hallazgos abiertos por severidad

### S2 — Altos (abiertos, documentados)
1. 52 recetas sin foto usan color + emoji: rompe la regla de cero emojis y la calidad cambia según la selección. Fix: ilustración SVG de serie como fallback.
2. Fotos de platos generadas con IA: riesgo de promesa visual engañosa. Fix: nota discreta o fotos reales antes del cobro.

### S3 — Medios (abiertos)
3. Pasos 3 y 4: mitad inferior todavía poco aprovechada. Fix: acercar el CTA al contenido o añadir un dato de valor.
4. Identidad: el dispositivo ownable se limita a la palabra en acento y a la combinación crema/oliva; cercano al veto papel cálido + tinta verde, mitigado porque es la referencia del usuario. Fix: sello o tratamiento común de foto.
5. Paso 1: el botón atrás invisible deja un hueco y las casillas opcionales quedan cerca del CTA fijo.
6. Fuera de alcance, bloquea "lista para vender" pero no la nota: los datos de salud aún no pasan por servidor y /paywall es un marcador.

## Verificado en código (heredado, no re-auditado línea a línea)
H3 volver por paso + sessionStorage; H7 defaults, autoenfoque, Enter; aria-live y progressbar; reduced-motion; CTA vivo (56px, ancho completo, whileTap); conteo animado, barras que se dibujan, stagger en menú.
