# FICHA DE DIRECCIÓN DE ARTE — Cocina en Calma
Estado: BORRADOR (extracción mirada sobre las 6 imágenes; hex estimados visualmente → verificar con muestreo de píxeles al construir tokens)

## Referencia del usuario (CONTRATO — ver 16)
- ¿Hay imagen(es) de referencia?: SÍ → docs/revisiones/referencia-1.webp … referencia-6.webp
  (1 receta en hoja · 2 Meal prep y compras · 3 ¿Qué tienes en casa? · 4 Empecemos por ti · 5 y 6 Tu menú de hoy + Recetas). Es un prototipo previo de la propia "Cocina en Calma".
- Extracción:
  - Modo: CLARO cálido · Fondo: #F4F0E4 · Superficie/card: #FDFBF6 · Texto 1º/2º: #23291F / #6B6F62
  - Acento principal: verde oliva #4F6F2B (CTAs "Ver mi menú", "Agregar", chips activos, números de pasos, palabra destacada del título: "casa", "ti", "compras", barra de progreso, tab activo)
  - Acento 2: terracota #C0583F (links "Ver receta →", "Falta: Chía", subtítulos de acción)
  - Notas de color: pill síntomas (Gases/Hinchazón) durazno #F8E1D6 · pill "Congelable" celeste #DCEBEF · caja informativa azul-gris #E3EDEA · resumen del día verde pálido #E4EBD6 · badge de carrito mostaza #D9A03F · tab activo verde pálido #E2EAD3
  - Display: serif cálido de contraste suave, títulos en semibold (clase "soft serif"). Candidatas: Fraunces · Newsreader · Young Serif
  - Body: sans redondeada humanista (clase "rounded sans"). Candidatas: Nunito · Nunito Sans · Quicksand
  - Radio: cards 18-20px · botones 16px · pills/chips 999px · inputs 14px · hoja de receta 28px arriba
  - Espaciado: aireado (base 8px; gutters 20px; entre cards 12px)
  - Sombras: sutiles y difusas (elevación mínima en cards y chips) · Bordes: 1px #E6E0CF en inputs y chips; botón secundario con borde oliva 1.5px
  - Textura/gradiente: ninguno; fondo plano crema. Fotografía de comida cenital/45° luz natural suave sobre lino
  - Dataviz: no hay gráficos; solo barra de 3 segmentos de progreso (oliva = hecho, gris cálido = pendiente) y fila de 3-4 métricas (etiqueta mayúscula pequeña + valor en negrita)
  - Íconos: line 1.5px, terminaciones redondeadas (corazón, calendario, libro, carrito, reloj, llama, hoja)
  - Layout: hero título serif + subtítulo → grid 2 columnas de cards con foto arriba (etiqueta de comida en pill blanca sobre la foto, guardar arriba a la derecha) → barra resumen → tarjeta de acción → CTA. Tab bar inferior de 4 ítems: Hoy · Semana · Recetas · Prep (activo en pill verde pálido; badge numérico mostaza)
  - Mood: cálido · sereno · orgánico
  - Detalle firma: UNA palabra del título en verde oliva ("¿Qué tienes en casa?", "Meal prep y compras"); etiquetas de sección en MAYÚSCULAS espaciadas pequeñas; pill de comida sobre la foto
- Prohibiciones anti-IA que la referencia levanta: ninguna.

## ⚠️ Decisión de contenido (la referencia manda en ESTILO, no en la promesa)
La referencia muestra kcal, macros y gramos ("329 kcal", "120 g de zapallo", "Mis datos 1840 kcal"). Eso contradice la promesa central (sin contar calorías ni pesar gramos). Se conserva TODO el estilo y la composición; en el contenido: kcal y macros salen del primer plano, los gramos se muestran como medidas caseras (tazas, puños, unidades), y las pills de síntoma (Gases · Hinchazón) pasan a ser el dato protagonista de cada receta.

## Personalidad compilada
- 3 adjetivos: cálida, serena, cuidadora
- Compilación (tabla 11): spring suave · duración base ~280ms · exclamaciones máx 0-1/pantalla · celebración nivel bajo-medio (calma, no confeti) · radio tendencial 18px

## Brand kit final
- Fondo #F4F0E4 · Superficie #FDFBF6 · Hundido #EAE5D4 · Texto #23291F / #6B6F62
- Acento #4F6F2B (SOLO: CTAs, selección, progreso, palabra destacada) · 2ª nota #C0583F (links y faltantes)
- Semánticos: éxito #4F6F2B · error #B0432F · aviso #D9A03F
- Display: serif cálido (Fraunces; pesos 600-700) · Body: Nunito (400/600/700) · Escala: display 32px / title 22px / body 16px / label 12px mayúsculas con tracking
- Radio 18px · Profundidad: sombras sutiles 2 niveles + borde fino · Espaciado base 4·8·12·16·20·24·32
- Motion signature: ease-out suave, stagger 60ms, firma = entrada de cards con leve fade-up

## Trazabilidad y vetos
- Ruta de diseño: réplica de referencia (captura de pantalla completa → RÉPLICA FIEL)
- Réplica fiel: pendiente (replica-fiel.html) · test de fidelidad: pendiente
- Tour de la app (vista-previa-app.html): pendiente · aprobado por el usuario: NO
- Paleta derivada de: referencia del usuario
- Registro anti-repetición: paleta oliva/crema + Fraunces/Nunito → vetados para el próximo proyecto del SO
- Modo claro DERIVADO por: referencia del usuario (cocina, calma, luz natural)

## Idioma UI: español neutro LATAM · Fecha: 2026-10-30 · Aprobada por el usuario: NO
