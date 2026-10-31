# VEREDICTO revisor-visual — Landing
Fecha: 2026-10-31 02:10
Screenshot: docs/revisiones/landing-375.png
Usabilidad: 30/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): FIEL
Veredicto: NECESITA CORRECCIÓN

Detalle de puntaje
- Usabilidad (h1..h10): h1:3 h2:3 h3:3 h4:3 h5:3 h6:3 h7:3 h8:3 h9:3 h10:3. Fuentes: [render] h2, h4, h6, h8, h10; [código] h1, h3, h7 (sticky CTA de 2 estados en ui.tsx, dots tocables, FAQ con aria-expanded/aria-controls, reveal con reduced-motion). h5 y h9 son casi N/A en una landing sin formularios; se puntúan 3 por defecto.
- Craft: jerarquía 3 · profundidad 3 · identidad 2 · movimiento 3 · encaje 3.
- Copy: idea 3 · especificidad 2 · emoción 4 · oferta 3 · acción 3. El eje de especificidad es ≤2, así que el copy se corrige aunque el total pasara.
- Umbrales del SO: ≥36/40 y ≥16/20. Usabilidad, craft y copy quedan por debajo.

## Test de fidelidad contra la referencia (referencia-1..6, sobre todo la 5 y la 6)
- Modo: claro cálido en ambas. Pasa.
- Hue del acento: oliva #4F6F2B en ambas, mismo hue. Pasa.
- Clase tipográfica display: serif suave (Fraunces semibold/bold) frente al soft serif de la referencia. Pasa. El body es Nunito, rounded sans. Pasa.
- Radios: cards 18px y botones 16px según tokens.css, dentro de ±4px de 18-20/16. Pasa.
- Densidad: aireada, con gutter de 20px. Pasa.
- Sombras: sutiles, difusas y tintadas con el neutro de marca. Pasa.
- Resultado: FIEL, 0 de 6 fallos.
- Matiz fuera del test de 6 puntos: la referencia es fotográfica (comida real). Aquí las tarjetas del hero y los chips del mock usan emojis sobre degradados. Es el hueco visual más grande frente al contrato, aunque esté documentado como marcador.

## Gate de carga cognitiva
- 8 ítems revisados. Fallan 2: hay elementos que parecen interactivos y no hacen nada (ver hallazgo 3), y hay dos bloques de contraste redundantes (ver hallazgo 6).
- Hay 2 fallos, por debajo del umbral crítico de 4. Sin sobrecarga crítica.
- Problema tiene 4 cards, Oferta 5 ítems y FAQ 6 ítems. Todo está dentro de rango.

## CTA héroe vivo (ui.tsx CtaButton)
- Contraste: texto crema sobre #4F6F2B, aproximadamente 5.5:1. Pasa.
- whileTap 0.97 y hover definidos. Pasa.
- Nunca disabled. Pasa.
- Alto de 52px, ancho completo en móvil. Pasa.
- El sticky mide 48px. Pasa.

## Hallazgos ordenados por severidad

### ALTO
1. **El CTA de la oferta promete compra y el destino es el onboarding gratis.**
   - Ubicación: app/page.tsx:20 y 104-106 (`CTA_OFERTA = 'Quiero mi Menú Calma'`, `ctaHref: CTA_HREF = /onboarding`), y en el sticky de ui.tsx:~236.
   - El usuario toca "Quiero mi Menú Calma" bajo "$14.99 pago único" y cae en un onboarding gratis. Hay dos verbos de acción (comprar y probar gratis) sobre un solo destino, y eso baja el eje de acción del copy y la heurística 4.
   - Además, la oferta nunca explica cuándo se paga. El microcopy dice "Empiezas gratis con tu menú de muestra", y eso choca con "Un solo pago" en el título.
   - Fix: unificar el verbo ("Ver mi menú de hoy gratis" también en la oferta, con "pagas $14.99 solo si te quedas con él" como línea explícita), o cerrar el flujo de verdad. docs/copy/landing.md decía "Quiero mi Menú Calma por $14.99", y el código ya omite el precio.
2. **Identidad ownable débil en el primer viewport: fotos de comida a base de emojis sobre degradados.**
   - Ubicación: public/mocks/primer-menu.png (hero, 375px, entre y≈497 y 1015), y los chips de síntoma con emoji en public/mocks/sintomas.png (carrusel).
   - La referencia es fotografía cenital de comida real, y esa es su firma. Aquí las 4 tarjetas de comida y los chips de síntoma usan emojis. Cualquier usuario nota que son marcadores, y el checklist de conversión baja el eje 3 por "emoji como ícono".
   - El hero no tiene textura ni tratamiento propio fuera de la palabra en acento. Es el punto que más separa esta landing de "diseñada".
   - Fix: sustituir por fotografía real o ilustración de la serie en el mock. Mientras tanto, usar un tratamiento de ilustración consistente (no emoji del sistema) y, sin foto, no mostrar el mock a tamaño protagonista.
3. **Elementos del mock que parecen botones reales y no hacen nada.**
   - Ubicación: el hero (botón "Armar mi semana completa", pills y cards del mock) y el carrusel ("Atrás", "Siguiente", chips de síntoma seleccionados).
   - Son imágenes, pero a 375px compiten con el CTA real justo debajo. El "Armar mi semana completa" es verde oliva igual que el CTA y está a unos 200px de él.
   - El chip "el Menú Calma" (Solucion.tsx:74-78, Hairline w-fit) también parece un botón o tag interactivo.
   - Fix: recortar el mock antes del botón interno, o desaturarlo. Presentar el chip del mecanismo como etiqueta no interactiva (sin borde de botón, o con texto "Método:").
4. **Especificidad y prueba del copy ≤2.** Los claims tienen números pero poca prueba verificable.
   - Ubicación: app/page.tsx:96 y 100. "Una sola consulta con nutricionista cuesta más" no lleva cifra. "60 recetas antiinflamatorias" es una cifra que no se puede verificar: la app aún no existe y no hay inventario trazado en FICHA-AVATAR ni en FICHA-MERCADO.
   - "Lo que tu cuerpo necesita, calculado sin contar nada" (page.tsx:99) es un adjetivo vacío. "Respaldada por la garantía de Hotmart" (page.tsx:113) no está confirmado: FICHA-MERCADO marca pendiente la verificación del checkout real.
   - No hay demo real (todo son mocks), ni credencial (la nutricionista está "por confirmar"). Sin testimonios por decisión, la prueba restante es la garantía y el precio.
   - Fix: poner una cifra real y citable en el ancla (rango de precios de consulta, con fuente en FICHA-MERCADO). Eliminar o verificar "60 recetas" contra el contenido real. Sustituir la línea vaga por algo concreto ("tazas, puños y unidades"). Retirar la mención a Hotmart hasta confirmarla.

### MEDIO
5. **La garantía no está nombrada junto al CTA de compra.**
   - El microcopy de la oferta dice "15 días de garantía" sin nombre (page.tsx:106). La "Garantía Calma de 15 días" aparece recién en la sección siguiente.
   - Fix: nombrarla en el microcopy del botón ("Garantía Calma de 15 días").
6. **Redundancia entre Agitación y Solución.**
   - Los pares Hoy / Si nada cambia (Agitacion) y Antes / Después (Solucion) son casi el mismo contraste emocional en cajas del mismo tipo. En el render ocupan unos 560px a 375px entre las dos secciones.
   - Las cajas ("HOY", "SI NADA CAMBIA") son tono sobre tono, casi sin separación, y pesan poco frente al resto.
   - Fix: dejar solo uno (el de Solucion, que cierra con la tarde de cocina), o fusionarlos en una sola pieza.
7. **El mecanismo no se nombra en el hero.**
   - El hero habla de "Menús antiinflamatorios según tu síntoma" y "Menú Calma" aparece recién en Solucion. Eso debilita el eje 1 de copy, que pide el mecanismo bautizado en hero + solución + oferta.
   - Fix: subtítulo del hero con el nombre, dentro de las 14 palabras.
8. **Alineación de títulos de sección inconsistente.**
   - Problema, Solución y FAQ van alineados a la izquierda. AppPorDentro, Oferta y Garantía van centrados. El ritmo se rompe a mitad de página.
   - Fix: elegir una convención (izquierda para las secciones de lectura, centro solo para las de cierre) y aplicarla a las 6.

### BAJO
9. **Movimiento sin conteo ni barras que se dibujen.**
   - El hero solo hace un fade de 300ms, sin stagger (Hero.tsx:~75). El precio "$14.99" aparece plantado, sin conteo.
   - La barra "Cubre 100% de lo que necesitas hoy" del mock es estática por ser imagen.
   - Las demás baselines que aplican sí están: stagger por sección con reveal (ui.tsx useReveal), whileTap, acordeón animado, dots del carrusel y sticky CTA con reduced-motion respetado en todo.
   - Fix: stagger de 60ms en el hero y conteo del precio una vez al entrar en vista.
10. **El cuadrado de marca del footer no coincide con el del header.**
    - Header: olive #4F6F2B, 24px. Footer: gris `--text-tertiary`, 20px (FooterLegal.tsx:36). Es el mismo logo con dos tratamientos.
    - Fix: usar el mismo color y tamaño, o el logo real.
11. **FAQ sin las objeciones 5 y 7 de la ficha.**
    - Faltan "Ya dejé gluten y lácteos y seguí inflamada" y los métodos de pago LATAM (OXXO, SPEI, PSE, según FICHA-MERCADO).
    - No frena el veredicto, pero la objeción de pago es la que más pesa en el segmento.
12. **El kicker del hero y el label "LISTO EN MENOS DE 5 MINUTOS" del mock** son microcopy de 10-12px de bajo contraste sobre crema. Aceptable en un mock, pero a 375px roza el límite de lectura.

## Notas honestas de lo que sí funciona (para no romperlo al corregir)
- El H1 lleva bold completo y una sola palabra en acento ("ligera"), sin artículos. Pasa el ancla de énfasis.
- El copy del dolor usa los verbatims del avatar casi literales: "panza de 5 meses", pantalón que aprieta, la pregunta de las 7 pm, culpa. Es el eje más fuerte.
- No hay claims de ingresos ni de curación. El FAQ lleva el aviso de que no reemplaza al médico.
- El precio tiene anclaje ($14.99 y "menos de $0.05 al día"; 14.99/365 ≈ $0.041, correcto).
- Hairlines: 3 usos (oferta, garantía y chip), dentro del máximo. Checks y chips son SVG, sin emojis, salvo en el contenido de los mocks.
- Alternancia base/elevado distinguible entre secciones. El CTA final invertido (oscuro) da un cierre claro.
- Accesibilidad: FAQ con button + aria-expanded + aria-controls, dots tocables de 24px con aria-label y aria-current, y targets ≥48px.
