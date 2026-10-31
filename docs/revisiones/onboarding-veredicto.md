# VEREDICTO revisor-visual — onboarding (5ª pasada, 9 pasos)
Fecha: 2026-10-31 18:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 35/40
Craft: 16/20
Copy: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN

Detalle usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:4 h9:3 h10:4 (suma 35, coincide con el total)
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4

Usabilidad queda a 1 punto del umbral (36). Craft y Copy cumplen (16/16).

## Gate de carga cognitiva (0 fallas: OK)
Una decisión por paso, 18 chips agrupados en 3 subtítulos, una acción primaria, sin elementos muertos.

## Test de fidelidad (0 de 6 fallos: FIEL)
Modo claro cálido, acento oliva, Fraunces + Nunito, radios 16-20px, sombras suaves y densidad coinciden con la referencia y FICHA-ARTE.

## Verificado en esta pasada (capturas)
- Hallazgo 1 CERRADO: el porcentaje de cobertura ya no aparece; "4 de 4 comidas armadas, con la porción ajustada a ti" es honesto (sube h8).
- Hallazgo 6 CERRADO: las 4 tarjetas del paso 9 tienen la misma altura y los chips quedan al pie. Con 2 chips envueltos (Almuerzo) quedan algo más altos, sin romper la alineación.

## Hallazgos por severidad

### S2 — Altos
1. (abierto) 52 recetas sin foto usan color + emoji: rompe la regla de cero emojis y varía la calidad al cambiar la selección. Fix: ilustración SVG de serie como fallback.
2. (abierto) Fotos de platos generadas con IA: riesgo de promesa visual engañosa. Fix: nota discreta o fotos reales antes del cobro.

### S3 — Medios
3. (abierto, sin resolver) Pasos 3, 4, 5 y 7: mitad inferior vacía y auto-avance sin confirmación visible (pasos 4 y 5 ocupan ~30% de la altura); el usuario no ve que su elección quedó registrada. Fix: pausa de ~250ms con la opción marcada (check) antes de avanzar, o una línea de contexto bajo la opción elegida. Sigue frenando h1, h4 y h7.
4. (NUEVO) Paso 9: dos títulos truncados con puntos suspensivos ("Sopa de lenteja con jengibre y...", "Muffins de banano y avena ..."): el usuario no lee el nombre completo del plato. Fix: permitir 3 líneas o acortar el nombre en el banco de recetas.
5. (abierto) Identidad: el dispositivo ownable se limita a la palabra en acento + crema/oliva; cerca del veto papel cálido + tinta verde, mitigado por ser referencia del usuario. Fix: sello o tratamiento común de foto.
6. (abierto) Paso 1: el botón atrás invisible deja hueco y las opcionales quedan cerca del CTA fijo.
7. (abierto, fuera de alcance) Datos de salud sin servidor; /paywall es marcador. Bloquean "lista para vender", no cuentan en la nota.

## Verificado en código (heredado, no re-auditado línea a línea)
H3 volver por paso + persistencia sessionStorage; H7 defaults, autoenfoque, Enter; aria-live y progressbar; reduced-motion; CTA vivo (56px, ancho completo, whileTap, nunca disabled); conteo animado 0→4, barras que se dibujan, stagger en menú.

## Para pasar a LISTA
Resolver el hallazgo 3 (confirmación visible antes del auto-avance + reducir el vacío en pasos 3-5 y 7) y el 4 (títulos truncados) debería aportar el punto que falta en h1/h4/h7.
