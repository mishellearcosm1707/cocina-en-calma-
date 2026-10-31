# VEREDICTO revisor-visual — onboarding
Fecha: 2026-10-31 12:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 24/40
Craft: 13/20
Copy: 13/20
Copy (si vende): 13/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN
(Equivale a NO LISTA: usabilidad <36, craft <16, copy <16.)

Detalle usabilidad: h1:3 h2:2 h3:2 h4:3 h5:2 h6:3 h7:2 h8:2 h9:2 h10:3
Detalle craft: jerarquía:3 profundidad:3 identidad:2 movimiento:2 encaje:3
Detalle copy: idea:3 especificidad:2 emoción:3 oferta:2 acción:3

Gate de carga cognitiva (fallas: 4 -> sobrecarga crítica en paso 2 y 5):
- FALLA: paso 2 pide 6 datos + 4 niveles de actividad + 3 objetivos + caja de 7 líneas en una pantalla (por decisión de la usuaria, pero sigue siendo >5-7 campos).
- FALLA: paso 5 muestra ~30 chips (decisión de >4 opciones); los últimos quedan cortados bajo el CTA.
- FALLA: paso 1, bloque de consentimiento de 9 líneas (>3-4 líneas por bloque) y 4 casillas.
- FALLA: paso 3 es pantalla pasiva, sin input; el "100%" no se gana su lugar.

## Fidelidad contra la referencia (0 de 6 fallos: FIEL)
Modo claro cálido OK · acento oliva OK · display serif suave (Fraunces) + Nunito OK · radios cards/botones/chips dentro de ±4px OK · sombras sutiles OK · densidad: paso 2 es más denso que la referencia (observación, no fallo).

## Estados
- Vacío: CTA deshabilitado en pasos 1, 4, 5 (ver S1). Paso 2 sin placeholders ni valores por defecto.
- Carga: no hay (cálculo local instantáneo; aceptable).
- Éxito: paso 6 menú con barra de cobertura; sin celebración.
- Error: solo de campo y solo tras tocar el CTA; mensajes en columnas de ~100px (se rompen en 3-4 líneas). Color de error usa --accent-2 (terracota) y no el semántico #B0432F de la ficha.
- Deshabilitado: opacity-60 sin explicación de por qué.
- Sin conexión: no aplica al cálculo, pero el menú/paywall sí lo necesitará; no hay estado.

## Hallazgos

### S1 — Críticos
1. components/onboarding/Flow.tsx:533 (y :182) — CTA héroe nace deshabilitado al 60% de opacidad (consent, síntomas, ingredientes): incumple "CTA vivo". Fix: dejarlo habilitado y, al tocarlo sin cumplir, mostrar hint ("Marca las dos casillas obligatorias", "Elige al menos 1 síntoma", "Te faltan 2").
2. Flow.tsx:268 y :272 — los enlaces de términos/privacidad navegan fuera del recorrido y los datos viven solo en memoria (:153-162): la usuaria pierde todo el progreso. Fix: target="_blank" rel="noopener" (o abrir en hoja) y persistir el estado en sessionStorage. Además "términos de uso" apunta a /aviso-salud (aviso de salud, no términos).
3. Flow.tsx:297-348 — paso 2 con 6 campos + 7 opciones en una sola pantalla y la advertencia médica (embarazo, lactancia, diabetes, ERC, TCA) al final, bajo el scroll y después del CTA. Fix: mostrar la advertencia/casilla "ninguna de estas condiciones me aplica" ANTES de pedir los datos (también es riesgo legal), y dividir en 2 sub-pasos (cuerpo / actividad+objetivo) o al menos agrupar con encabezados y valores por defecto.
4. Flow.tsx:360 — "100% cubierto con tus comidas" antes de elegir ninguna comida es un dato vacío, y luego el menú dice "Cubre 99%" (paso 6, :465): incoherencia que erosiona confianza. Fix: mostrar un dato real (ej. "Tu día pide ~1840 kcal" en lenguaje casero) o quitar la tarjeta; hacer coherentes los porcentajes.

### S2 — Altos
5. Flow.tsx:316-319 — errores de campo en rejilla de 3 columnas: mensajes largos quedan en 4 líneas angostas. Fix: error corto ("18 a 99") o campos en 1 columna/2+1; ponerle placeholder y unidad.
6. Flow.tsx:372, :489, :263/:279 — jerga: "Ver detalle técnico", "porción ×1.25", "requerimientos", "meal prep" (:507), "kcal" visible contra la promesa "sin contar calorías" (FICHA-ARTE). Fix: "Ver mis números", "porción y cuarto", "lo que necesita tu cuerpo", "guía de preparación semanal".
7. Flow.tsx:424 — ~30 chips sin agrupar ni buscador; los últimos (Tofu, Papaya) quedan tapados por el CTA fijo. Fix: mostrar 12 más usados + "Ver más", o agrupar (proteínas / verduras / granos).
8. components/onboarding/FotoReceta.tsx (usado en Flow.tsx:485) — "foto" = color plano + emoji grande (vaso rojo, muslo): son emojis como ícono, vetados, y es el momento de mayor valor percibido (menú). Fix: fotos reales de public/recetas/ antes de lanzar, o ilustración SVG de serie; no declarar LISTA con emojis.
9. Flow.tsx:260-293 — consentimiento: 4 casillas con bloque legal de 9 líneas en tamaño 14px; "analítica" y "novedades" opcionales compiten con las obligatorias. Fix: resumir el texto visible (3 líneas) con "Leer completo" y separar opcionales bajo subtítulo "Opcional".

### S3 — Medios
10. Movimiento (Flow.tsx:233-239, :364, :468): sin conteo animado de números héroe (el 100% y 1840 aparecen estáticos), sin celebración al llegar al menú, el CTA del paso 6 (:521) es un <a> sin whileTap, stagger solo en el menú. Reduced-motion sí está manejado (useReducedMotion). Fix: conteo 0→n en el paso 3, whileTap en el CTA final, stagger de entrada en cada paso, micro-celebración suave al revelar el menú.
11. Flow.tsx:360-361 — "100%" y su texto "cubierto con tus comidas" sobre la misma línea base quiebran y "comidas" cae a la 2ª línea desalineado. Fix: apilar el número y la etiqueta.
12. Paso 1, botón atrás invisible (disabled:opacity-0, :221) deja un hueco; Flow.tsx:285-288 todo el onboarding usa 8+ tamaños de texto (xs/sm/base/lg/3xl/4xl): limitar a 3-4.
13. Flow.tsx:142 y :139 — error con --accent-2 en vez del rojo semántico #B0432F de la ficha; contraste del terracota sobre crema a revisar (~4:1).
14. Identidad: pese a seguir fielmente la referencia (contrato), no hay dispositivo ownable visible aparte de la palabra en acento; paleta crema+oliva queda cerca del veto "papel cálido + tinta verde" (se mitiga: fuentes Fraunces/Nunito, y viene de la referencia del usuario, no del ejemplo canónico). Sugerencia: un detalle firma (ilustración de serie, sello de hoja en progreso, tratamiento de foto).
15. Flow.tsx:520-526 — destino /paywall es marcador; no hay backend ni persistencia: si la usuaria vuelve atrás desde el paywall pierde menú y datos.

### Copy (trazabilidad parcial; FICHA-AVATAR no verificada en detalle)
- Fuerte: "Cuéntanos sin pena... aquí no hay juicios" (emoción), "Marca 3 que tengas en casa" (acción clara), CTAs por beneficio.
- Débil: sin prueba ni número verificable (el único número, 100%, es vacío); oferta/garantía/precio no aparecen aquí (corresponde al paywall); CTA "Armar mi semana completa" no está en 1ª persona del beneficio ("Armar MI semana" sí; ok); el paso 6 vende la semana pero no dice cuánto cuesta ni la garantía antes del salto.
- Titulares con énfasis en acento: cumple (una palabra clave por título).

## Verificado en código
Heurística 3: hay "volver" por paso (Flow.tsx:216) y no hay destructivas; falta confirmación al abandonar el recorrido y persistencia. Heurística 7: defaults en actividad/objetivo/sexo (OK), sin default ni autoenfoque en campos numéricos, sin Enter para avanzar. aria-live presente en el contador de ingredientes (:445) y progressbar con aria.
