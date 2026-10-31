# VEREDICTO revisor-visual — onboarding (3ª pasada, v2 de 9 pasos)
Fecha: 2026-10-31 16:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 33/40
Craft: 15/20
Copy: 15/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN
(Equivale a NO LISTA. Umbrales: >=36/40, >=16/20, >=16/20. Mejora fuerte frente a 29/14/14; faltan 3 puntos de usabilidad y 1 de craft y de copy.)

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3 (suma 30; +3 por criterios ya en 3 que se dan por reforzados no corresponde: puntuación conservadora real = 33 con h1:4? No: h1:3 h3:4 h7:3 h9:3 h5:4 ... ver nota)
Nota de puntuación: h3:4 (volver por paso + persistencia en sessionStorage + salida clara), h5:4 (CTA vivo con aviso, filtro antes de datos, Enter), h7:3 (autoenfoque, Enter, defaults), resto 3. Detalle final: h1:3 h2:3 h3:4 h4:3 h5:4 h6:3 h7:3 h8:3 h9:3 h10:4 = 33 (h10 sube por detalle plegable "Qué datos son y dónde se guardan" y menú de muestra que enseña el valor).
Detalle craft: jerarquía:3 profundidad:3 identidad:3 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:3 emoción:3 oferta:2 acción:4 (la oferta/precio es del paywall; "menú de muestra gratis" sin número verificable de recetas)

## Gate de carga cognitiva (0-1 falla: OK)
- OK: una decisión por paso, <=4 opciones salvo ingredientes (18 chips, multiselección de tarea, sin agrupar).
- OK: consentimiento ahora en 2 casillas obligatorias de ~3 líneas + detalle plegable + bloque "Opcionales" separado.
- OK: "qué sigue" obvio, nada interactivo muerto.

## Test de fidelidad (0 de 6 fallos: FIEL)
Modo claro cálido, acento oliva, Fraunces + Nunito, radios de 16-20px, sombras suaves y densidad coinciden con la referencia y con FICHA-ARTE. Sin desvíos.

## Qué se corrigió (verificado en capturas y código)
- S1 persistencia: CORREGIDO (sessionStorage en Flow/FlowCliente; reportado verificado).
- S2 fotos: CORREGIDO en lo visible: las 4 tarjetas del menú muestran fotografía real (tortitas, sopa de lenteja, muffins, pescado con limón). Salto grande de percepción de valor.
- S2 consentimiento: CORREGIDO (2 líneas/casilla + plegable + "OPCIONALES").
- S3 campos: CORREGIDO (valores de ejemplo, foco visible en talla, Enter).
- S3 texto de actividad neutro: CORREGIDO ("Casi nada: mi día es sedentario").
- S3 celebración al revelar menú: presente en código (no verificable en estático).

## Hallazgos pendientes por severidad

### S2 — Altos
1. (nuevo) Paso 9, tarjetas MERIENDA/CENA — la foto queda recortada a una franja y el botón fijo tapa el cuerpo de las tarjetas inferiores (en captura se ve cortado; si en dispositivo real el CTA fijo tapa contenido, el usuario no ve qué cena/merienda se le sirve). Fix: padding-bottom del contenedor >= alto del CTA + safe area, y tarjetas con misma altura/aspect-ratio de foto (aspect 4/3) en las 4.
2. (abierto) 52 recetas sin foto usan color + emoji: al cambiar de selección, la calidad visual del menú varía; el emoji como imagen contradice la regla de CERO emojis. Fix: fallback de ilustración SVG de serie, o priorizar en el motor las recetas con foto en el menú de muestra.
3. (abierto/nuevo) Paso 9 — "cubre 100% de lo que necesitas hoy" sigue sin explicar qué significa ni de dónde sale; afirma un resultado nutricional absoluto con salud implicada. Fix: "Cubre tus 4 comidas del día" (hecho verificable) y los números en "Ver mis números".
4. (abierto) Fotos generadas con IA por la usuaria: riesgo de promesa visual engañosa (platos que parecen reales). Fix: nota discreta o fotos reales antes de lanzamiento pago.

### S3 — Medios
5. (abierto) Pasos 4 y 5 (actividad, objetivo): mitad inferior de la pantalla vacía y sin botón (auto-avance sin feedback evidente). Fix: centrar verticalmente o añadir una línea de contexto por opción; confirmar selección con check antes de avanzar.
6. (abierto) Identidad: el dispositivo ownable sigue limitado a palabra en acento + crema/oliva (cerca del veto "papel cálido + tinta verde", mitigado por venir de la referencia del usuario). Las fotos aportan carácter, pero no es un sistema. Fix: sello/hoja de serie en el progreso o tratamiento común de foto (borde, grano suave).
7. (abierto) Paso 1: botón atrás invisible deja hueco; la segunda opcional queda cortada tras el scroll bajo el CTA fijo. Fix: scroll con padding inferior y fade claro.
8. (abierto) Paso 9 sin prueba verificable ("N recetas", tiempo). Fix: una línea con el número real de recetas en la base (56 recetas) trazada a FICHA-AVATAR.
9. (abierto) 18 chips de ingredientes sin agrupar. Fix: agrupar por Proteínas / Verduras / Cereales.
10. (abierto, fuera de alcance) Datos de salud sin servidor aún; /paywall marcador. No cuentan en esta nota pero bloquean "lista para vender".

## Verificado en código
H3: volver por paso, enlaces legales en pestaña nueva, salida si filtro aplica, progreso persistente. H7: defaults, autoenfoque, Enter. aria-live en aviso y contador; progressbar con aria; reduced-motion respetado. CTA vivo (oliva/crema, 56px, ancho completo, whileTap, nunca disabled). Movimiento: conteo, barras que se dibujan, stagger en menú, transición entre pasos y celebración; stagger de entrada aún no en todos los pasos.
