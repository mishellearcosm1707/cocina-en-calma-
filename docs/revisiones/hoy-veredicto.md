# VEREDICTO revisor-visual — Hoy
Fecha: 2026-10-31 13:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Identidad ownable debil (craft identidad 2): crema + oliva + serif sin dispositivo firma (sin textura/grano, sin ilustracion de serie); 8 de 60 recetas con foto y el resto con icono Lucide uniforme mezcla fotos e iconos en la misma lista; paleta cerca del veto Capitulo (distinta fuente Fraunces/Nunito). 2) Fila "Te toca" desencaja: p-2 + ring desplazan la foto 8px a la derecha y la foto se ve mas angosta que las otras filas; el texto se parte en 3 lineas. Usar margen negativo (-m-2 p-2) o ring-inset para conservar la alineacion. 3) Movimiento incompleto: sin celebracion de hito (semana 22/28, racha), sin transicion de tabs verificada, barra se dibuja pero no hay anillo; el 94% cuenta pero la barra y el numero terminan desfasados. 4) Hoja de receta sin trampa de foco ni bloqueo de scroll del fondo (aria-modal sin gestion de foco); sin undo al cambiar chequeo. 5) Tres bloques de peso similar debajo del menu; la tarjeta "Tu semana" (olive-wash) compite visualmente con la fila "Te toca" (mismo verde) - diferenciar o bajar su peso.
