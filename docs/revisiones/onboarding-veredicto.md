# VEREDICTO revisor-visual — onboarding (2ª pasada, v2 de 9 pasos)
Fecha: 2026-10-31 15:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 29/40
Craft: 14/20
Copy: 14/20
Copy (si vende): 14/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN
(Equivale a NO LISTA: usabilidad <36, craft <16, copy <16. Mejora clara frente a 24/13/13, pero no alcanza los umbrales.)

Detalle usabilidad: h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:2 h8:3 h9:3 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:2 movimiento:3 encaje:3
Detalle copy: idea:3 especificidad:2 emoción:3 oferta:2 acción:4 (sin ficha de avatar revisada en detalle; oferta/precio corresponden al paywall)

## Gate de carga cognitiva (1 falla: ya no es sobrecarga)
- OK: una decisión por paso, ≤4 opciones (filtro 2, actividad 4, objetivo 3, síntomas 4), datos en 4 campos apilados.
- OK: el "qué sigue" es obvio; ningún elemento interactivo muerto.
- FALLA: consentimiento con 4 casillas y un bloque obligatorio de ~6 líneas (>3-4 líneas).
- Borde: 18 chips en el paso 8 (>4 opciones; es multiselección de tarea y no desborda, pero sin agrupar).

## Fidelidad contra la referencia (0 de 6 fallos: FIEL)
Modo claro cálido, acento oliva, display Fraunces + Nunito, radios, sombras suaves y densidad coinciden con la referencia. Sin desvíos contra FICHA-ARTE. Error con --error de la ficha (corregido).

## Qué se corrigió de la 1ª pasada (verificado en código y capturas)
- S1-1 CTA nace apagado: CORREGIDO (Flow.tsx:644 siempre vivo, aviso rojo en :632, whileTap).
- S1-2 enlaces: PARCIAL. Ahora target=_blank y apuntan a aviso de salud + privacidad (:319-323); la persistencia SIGUE sin existir (solo useState).
- S1-3 paso 2 sobrecargado y advertencia al final: CORREGIDO (filtro antes de datos, pasos separados, auto-avance).
- S1-4 "100% cubierto" vacío: CORREGIDO (reparto por comida, números en "Ver mis números").
- S2-5 errores en 3 columnas: CORREGIDO (campos apilados). Siguen siendo largos pero caben.
- S2-6 jerga: CASI. "Ver mis números", "porción generosa" OK; persisten "kcal", "Energía/Proteína/Carbohidratos" dentro del desplegable (aceptable al ser opcional).
- S2-7 30 chips: MEJORADO a 18, sin agrupar ni "ver más".
- S2-8 emojis como foto: SIGUE (FotoReceta = color plano + emoji; en captura se ve de nivel placeholder: sartén, vaso, muslo). Aceptado como abierto documentado, pero impide LISTA en la pantalla de mayor valor percibido.
- S2-9 consentimiento largo: PARCIAL (menos texto, pero la 2ª casilla sigue en ~6 líneas y las opcionales no se separan bajo "Opcional").
- S3-10 movimiento: MEJORADO (conteo animado de cobertura, barras que se dibujan en el paso 6, stagger en el menú, transición entre pasos, whileTap). Sigue sin celebración al revelar el menú y sin stagger de entrada en los demás pasos.
- S3-11/12/13 : "100%" quebrado eliminado; error con token correcto; botón atrás invisible en paso 1 sigue dejando hueco (menor).

## Hallazgos pendientes por severidad

### S1 — Críticos
1. (viene de 1ª, S1-2) Flow.tsx:178-194 — todo el estado vive en memoria: recargar o volver desde /paywall borra los 9 pasos. Fix: persistir en sessionStorage y restaurar al montar.

### S2 — Altos
2. (viene de 1ª, S2-8) components/onboarding/FotoReceta.tsx — "fotos" = fondo de color + emoji en el menú (paso 9). Fix: fotos reales de public/recetas/ o ilustración SVG de serie antes de lanzar; hasta entonces no LISTA.
3. (viene de 1ª, S2-9) Flow.tsx:328-338 — casilla de salud de ~6 líneas y 2 opcionales mezcladas con las obligatorias. Fix: texto de 3 líneas + "Leer completo", y opcionales bajo subtítulo "Opcional".
4. (nuevo) Flow.tsx:597 / paso 9 — el cierre promete "plan completo" pero no hay prueba ni número verificable (cuántas recetas, cuánto tiempo ahorra), y la cobertura "99%" no se explica. Fix: una línea concreta ("Más de N recetas…") trazada a FICHA-AVATAR y a datos reales.

### S3 — Medios
5. (nuevo) Flow.tsx:120-137 — campos de edad/peso/talla sin placeholder, sin autoenfoque ni Enter para avanzar; h7 queda en 2. Fix: placeholder de ejemplo, autoFocus en el primero y onKeyDown Enter = siguiente.
6. (nuevo) Pasos 4 y 5 (actividad, objetivo) — mitad inferior de la pantalla vacía y sin dato de apoyo; el paso 6 es pasivo. Fix: centrar verticalmente o añadir una línea de contexto por opción.
7. (viene de 1ª, S3-14) Identidad: sin dispositivo ownable más allá de la palabra en acento y la paleta crema+oliva (cerca del veto "papel cálido + tinta verde", mitigado por venir de la referencia del usuario y usar Fraunces/Nunito). Fix: un detalle firma (sello de hoja en el progreso, ilustración de serie, tratamiento de foto).
8. (nuevo) "Casi nada: paso el día sentada" asume género femenino aunque se ofrece "Hombre". Fix: "paso el día sentado/a" o redactar neutro ("Casi nada: mucho tiempo sentado/a").
9. (viene de 1ª, S3-10) Sin celebración suave al revelar el primer menú (hito real).

## Verificado en código
H3: hay "volver" por paso, enlaces legales en pestaña nueva, salida clara si el filtro aplica (Volver al inicio); no hay acciones destructivas; falta persistencia. H7: defaults en sexo; sin Enter ni autoenfoque. aria-live en aviso y contador de ingredientes; progressbar con aria; reduced-motion respetado en todas las animaciones. CTA vivo: contraste oliva/crema alto, h-14 (56px), ancho completo, whileTap, nunca disabled.
