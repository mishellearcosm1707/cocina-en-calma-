# VEREDICTO revisor-visual — admin-resumen
Fecha: 2026-11-04 12:00
Screenshot: docs/revisiones/admin-resumen-desktop.png (desktop ~1190px; NO es 375px: movil evaluado solo por codigo)
Usabilidad: 27/40
Craft: 8/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Banner superior] "Todo en orden este mes" en verde con emoji, aunque hay 4 "Sin datos", 0 ventas y Hotmart nunca avisó. Tranquiliza en falso y rompe la regla de cero emojis como ícono (se ve el cuadro verde nativo). Fix: estado "Aún sin ventas ni avisos: nada que revisar" en tono neutro, con ícono Lucide (CheckCircle) en chip SVG; verde solo si hay datos y todo está bien.
2. [Rejillas de 8 tarjetas] Todas pesan igual: ningún dato héroe, 8 bloques + 8 pestañas (gate de carga cognitiva: grupos >5). Etiquetas largas que saltan de línea (ÚLTIMO AVISO DE HOTMART, VUELVEN AL DÍA SIGUIENTE) desalinean los valores entre tarjetas de la misma fila. Fix: 1 tarjeta héroe ancha (ingresos/ganancia), el resto en 4 secundarias; altura mínima fija para el título o labels más cortos ("Último aviso", "Vuelven al día 2").
3. [Movimiento, código] Cero movimiento: sin entrada escalonada, sin conteo de números, sin barras animadas, sin estado :active/hover en pestañas ni tarjetas, sin transición de pestañas ni reduced-motion. Fix: fade-up con stagger 60ms en tarjetas, conteo en valores numéricos, active:scale-[0.97] en pestañas, todo con motion-reduce.
4. [Móvil, solo código] Una columna con 8 tarjetas = scroll muy largo antes del gráfico. La barra de pestañas oculta el scroll y no tiene señal de borde; la pestaña activa (p. ej. Ajustes/Salud) puede quedar fuera de vista al cargar. Fix: grid-cols-2 en móvil para las tarjetas secundarias, degradado en el borde del nav y scrollIntoView de la pestaña activa. Táctil correcto (min-h-11 en pestañas y enlace).
5. [Tarjetas "Sin datos" / "0%"] Cuatro "Sin datos" repiten el mismo peso visual; "0%" de activación sobre 1 persona se lee como alarma y el texto "activas, reembolsadas y canceladas" confunde junto a "1". Profundidad casi nula (sombra imperceptible, fondo plano crema). Fix: tarjetas sin dato más tenues/hundidas (surface-2), mostrar "—" con muestra pequeña en vez de 0%, y sombra/borde de 1px #E6E0CF visible.

Notas: heurística 3 y 7 verificadas en código (solo lectura, sin acciones destructivas; no hay selector de periodo ni atajos). Heurística 1: el único estado de carga es texto "Cargando el panel…", sin skeleton. Paleta y tipografías coinciden con FICHA-ARTE (oliva #4F6F2B, crema, Fraunces/Nunito, radio ~18px). Paleta cercana a la vetada "papel cálido + tinta verde" pero con fuentes distintas y por mandato de la referencia: eje identidad 2, no 0. El texto "Acti… Ve a C…" abajo a la derecha es la marca de agua de Windows, no del producto.
