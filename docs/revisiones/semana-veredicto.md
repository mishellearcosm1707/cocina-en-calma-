# VEREDICTO revisor-visual — semana
Fecha: 2026-10-31 13:00
Screenshot: docs/revisiones/app-semana-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) Selector (app-selector-375.png): 6 de 8 recetas muestran el mismo ícono de taza, se ve como relleno repetido; hace falta ilustración distinta por receta o ocultar el recuadro hasta tener foto. 2) Toast Deshacer (app-semana-completa-375.png) tapa el texto de la tarjeta de preparación recién celebrada (bottom-28 la pisa); subirlo sobre el contenido o reservar espacio, y no tapar la celebración. 3) Movimiento parcial: el stagger solo cubre la tarjeta de avance; cabecera, selector de semana, tira de días y tarjeta del día entran estáticos, y los ítems del selector no tienen whileTap; escalonar todos los bloques (50-80ms) y añadir tap a los ítems y a las flechas de semana. 4) Sin estado de error o fallo de guardado local ni feedback al cambiar una comida (solo el cierre de la hoja); añadir aviso de error y confirmación breve. 5) Contador n/4 con opacity 70% en días incompletos: contraste bajo sobre superficie crema; subir a texto secundario sólido AA.
