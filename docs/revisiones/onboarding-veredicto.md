# VEREDICTO revisor-visual — onboarding (4ª pasada, 9 pasos)
Fecha: 2026-10-31 17:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 35/40
Craft: 16/20
Copy: 16/20
Copy (si vende): 16/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN
(Equivale a NO LISTA solo por usabilidad: 35 < 36. Craft y Copy alcanzan el umbral. Falta 1 punto de usabilidad.)

Detalle usabilidad: h1:3 h2:3 h3:4 h4:3 h5:4 h6:4 h7:3 h8:3 h9:3 h10:4 (suma 34 en el desglose conservador; el 35 reconoce que el paso 9 ya no oculta contenido, pero sigue sin cerrar h2/h8/h9 por los hallazgos abajo)
Detalle craft: jerarquía:4 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:3 acción:4

Nota de honestidad: el desglose por heurística suma 34; se otorga 35 por el efecto combinado de las correcciones. Si el equipo prefiere el desglose estricto, la usabilidad real es 34/40. En ambos casos, no alcanza 36.

## Gate de carga cognitiva (0 fallas: OK)
- Una decisión por paso; ingredientes ahora agrupados en 3 subtítulos con 18 chips (aceptable).
- Consentimiento resumido; "qué sigue" obvio; nada interactivo muerto.

## Test de fidelidad (0 de 6 fallos: FIEL)
Modo claro cálido, acento oliva, Fraunces + Nunito, radios 16-20px, sombras suaves y densidad coinciden con la referencia y FICHA-ARTE.

## Qué se corrigió desde la 3ª pasada (verificado en capturas)
- Paso 9 con las 4 tarjetas completas y fotografía a la misma proporción; botón al final sin tapar (en uso real: 192px de aire declarados; verificar en dispositivo).
- Texto "cubre 100%" reemplazado por "Tus 4 comidas de hoy · cobertura estimada de tu día: NN%": mejor, aunque el valor visible sigue siendo 100% (ver hallazgo 1).
- Ingredientes agrupados (Proteínas / Cereales y tubérculos / Verduras y frutas): CORREGIDO.
- "60 recetas" con cifra real del banco: CORREGIDO (sube oferta de 2 a 3).
- Menú favorece recetas con foto: las 4 muestran foto en la captura. Paso 1 sin cortes visibles en la captura.

## Hallazgos pendientes por severidad

### S2 — Altos
1. (abierto, atenuado) Paso 9: "cobertura estimada de tu día: 100%" con barra llena sigue sonando a garantía nutricional y es tautológico (4 comidas siempre = 100%). Fix: quitar el porcentaje y dejar "Tus 4 comidas de hoy, ajustadas a tus gases y pesadez" o mostrar la cifra solo en "Ver mis números".
2. (abierto) 52 recetas sin foto usan color + emoji: al cambiar selección la calidad varía y rompe la regla de cero emojis. Fix: ilustración SVG de serie como fallback.
3. (abierto) Fotos generadas con IA: riesgo de promesa visual engañosa. Fix: nota discreta o fotos reales antes del cobro.

### S3 — Medios
4. (abierto) Pasos 4 y 5: mitad inferior vacía y auto-avance sin confirmación evidente. Fix: breve check/pausa de ~250ms antes de avanzar o línea de contexto bajo cada opción. Paso 3 y 7 también dejan hueco grande sobre el botón fijo.
5. (abierto) Identidad: dispositivo ownable limitado a palabra en acento + crema/oliva; cerca del veto papel cálido + tinta verde, mitigado por ser referencia del usuario. Fix: tratamiento común de foto/sello de serie.
6. (nuevo) Paso 9: tarjetas con alturas de contenido dispares (chips en 1 o 2 líneas, títulos de 2-3 líneas) dejan vacíos irregulares dentro de las tarjetas. Fix: alinear chips al pie de la tarjeta (flex column, mt-auto) y limitar títulos a 2 líneas.
7. (abierto) Paso 1: botón atrás invisible deja hueco; segunda opcional cercana al CTA fijo. Fix: mantener la altura reservada con scroll + fade.
8. (abierto, fuera de alcance) Datos de salud no van aún a servidor; /paywall es marcador. Bloquean "lista para vender", no cuentan en la nota.

## Verificado en código (heredado de la 3ª pasada, no re-auditado línea a línea)
H3 volver por paso + persistencia sessionStorage; H7 defaults, autoenfoque, Enter; aria-live y progressbar; reduced-motion; CTA vivo (56px, ancho completo, whileTap, nunca disabled); conteo animado, barras que se dibujan, stagger en menú.

## Para pasar a LISTA
Resolver hallazgos 1, 4 y 6 (corrección pequeña) debería dar los +1-2 puntos de usabilidad (h8/h9/h2) necesarios.
