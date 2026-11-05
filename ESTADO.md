# ESTADO — Cocina en Calma
Última actualización: 2026-10-30 | Sesión actual: 1

⏸️ CHECKPOINT — Última acción completada: diseño aprobado (FICHA-ARTE) y FICHA-AVATAR en borrador / Siguiente acción exacta: FICHA-MERCADO (investigación web con fuente y fecha) → completar FICHA-MODELO → Constitución del Producto (01) → Landing.

## Qué es esta app (3 líneas máximo)
App que dice qué comer cada día según síntomas digestivos (hinchazón, pesadez, fatiga) e ingredientes que ya hay en casa, y organiza la semana en una sola tarde de meal prep.
Para mujeres 28-45 de LATAM / hispanas en EE.UU., profesionales o madres, NSE medio a medio-alto. Suscripción freemium con trial.

## Promesa central
"Esta app ayuda a mujeres profesionales y ocupadas a desinflamar su abdomen y recuperar su ropa favorita sin contar calorías, pesar gramos ni hacer dietas restrictivas, mediante menús antiinflamatorios según su síntoma y su despensa + meal prep semanal guiado."
Big Idea: "Desinflama tu abdomen y recupera tu ropa favorita sin volver a pesar un solo gramo ni contar una sola caloría."

## Reporte de validación (fuente: PDF del usuario "estudio de mercado, cliente ideal, razones", NO se revalida)
- Veredicto del PDF: 88/100 — Oportunidad Muy Fuerte
- Nombre: Cocina en Calma (alt.: DesinflamaApp, MealPrep Antiinflamatorio)
- Referencias: Fitia ($64-85K USD/mes Android LATAM, 1.43M MAU), Eat This Much (~$1M/año, 4.7★, 22K valoraciones), Mealime (cierre oct-2026 según PDF, 4.5M usuarios históricos), Plan to Eat ($59/año)
- Oportunidad: Fitia = obsesión por gramos; Eat This Much = repetitivo y listas caras; nadie combina síntoma digestivo + despensa real + meal prep guiado
- Precio de referencia del mercado: $24.99-$60 USD/año
- Keywords: dieta antiinflamatoria recetas · meal prep español · que cocinar con lo que tengo · menu antiinflamatorio semanal
- ⚠️ Cifras del PDF sin enlace/fecha propia → FICHA-MERCADO.md debe citar fuente y fecha antes de fijar precio/garantía (cierre de Mealime y cifras de Fitia: verificar).

## Dirección de Arte (Sesión 2 — NO cambiar sin justificación)
- FICHA-ARTE.md: APROBADA por el usuario 2026-10-31
- ¿Referencia visual del usuario?: SÍ, 6 capturas en docs/revisiones/referencia-N.webp → CONTRATO (réplica fiel)
- Resumen: fondo #F4F0E4 · acento #4F6F2B · Display Fraunces · Body Nunito · radio 18px · cálida/serena/cuidadora. Tokens en tokens.css
- Contenido: el estilo manda la referencia; kcal/gramos salen del primer plano (la promesa es sin contar)
- REGISTRO ANTI-REPETICIÓN: oliva+crema, Fraunces+Nunito → vetados para el próximo proyecto

## Avatar y venta (fuente PDF; FICHA-AVATAR.md aún por crear en formato SO)
- FICHA-AVATAR.md: APROBADA por el usuario 2026-10-31 (incluye las 3 razones de compra: dolor, esfuerzo y la razón práctica = ahorrar tiempo)
- Avatar: Laura, 34, corporativa urbana; abdomen plano al despertar, "panza de embarazada" por la noche; fatiga de decisión "¿qué cocino hoy?"
- Dolor #1: "Tengo panza de embarazada y ni siquiera estoy embarazada." · Deseo #1: despertar y acostarse con la panza plana y relajada
- Dolores 2-5: no soporta pantalones/ropa ajustada · agua o manzana la infla · fatiga de cocinar · harta de pesar/contar calorías
- Razones de compra (Jim Edwards): #1 escapar del dolor físico/mental · #2 evitar esfuerzo · #3 ahorrar tiempo (también ahorrar dinero, comodidad, salud, elogios, ser aceptada)
- Objeciones: ¿tengo que pesar? · ¿recetas raras/caras? · ya dejé gluten/lácteos y seguí inflamada · no tengo tiempo para meal prep · apps que borro a los días
- Consciencia: el PDF dice DOS cosas (resumen: "consciente de la solución"; avatar: Problem-Aware). A resolver en 57.
- Verbatims para copy: ver PDF (sección "Lenguaje Literal del Cliente")

## Estrategia de monetización (propuesta del PDF; el modelo A-F de 02C lo decide el agente antes del paywall)
- Modelo: freemium con compra única; se cobra el plan semanal completo, el filtro de despensa, las compras consolidadas y la guía meal prep
- Gratis: ingresar síntoma + ver un menú diario de muestra
- Garantía: 7 días a través de Hotmart (confirmado por la usuaria el 2026-10-31).
- Trial: NINGUNO — el menú de muestra gratis hace de prueba · Garantía: 7 días, sin fijar fecha de inicio en el copy (FICHA-MERCADO §4)
- Pricing (decisión del usuario 2026-10-31): PAGO ÚNICO $14.99 USD, sin suscripción, hasta probar cómo va. Plan B: $7.99/mes y $44.99/año del estudio. Pendiente definir qué incluye exactamente (acceso completo sin mensualidades; NO prometer "de por vida" hasta validar costos). Economía: LTV = $14.99 → priorizar tráfico orgánico; el costo por venta pagada debe quedar muy por debajo (comisión de Hotmart: verificar).
- Venta: Hotmart (default del SO)

## Decisiones de producto del usuario (2026-10-31, nutricionista)
- La creadora de la app es NUTRICIONISTA (dato del usuario). El claim "diseñado/revisado por nutricionista" solo se usa con nombre y credencial confirmados por ella (gate 61).
- Onboarding pide: sexo, edad, peso, talla, actividad física, objetivo → la app calcula requerimientos diarios (Mifflin-St Jeor × factor de actividad; ejemplo mujer 30a/65kg/160cm/ligera = 1,840 kcal, coincide con la referencia). Fórmula y macros a validar por la nutricionista antes de construir.
- MÉTODO APROBADO por la nutricionista (2026-10-31): Mifflin-St Jeor; −10% SOLO si el objetivo es bajar de peso; piso 1200 kcal mujeres / 1500 kcal hombres con cualquier objetivo; proteína g/kg por actividad (0.8/1.0/1.2/1.4, escalones a validar) y macros por AMDR/DRI del IOM 2005. Fuentes en datos/metodo-y-fuentes.md. HECHO 2026-10-31: kcal/macros de las 60 recetas calculados ingrediente por ingrediente con la tabla INCAP/OPS de Centroamérica (fuente principal, 200 ingredientes) y USDA como respaldo (83) — herramientas/nutricion/, datos/recetas.json v0.3, datos/alimentos.json, datos/nutricion-por-ingrediente.csv. Promedio 315 kcal/porción (IA estimaba 381). Pendiente: revisión de la nutricionista (proxies y equivalencias estimadas en datos/metodo-y-fuentes.md).
- Las recetas se sugieren y eligen para completar el requerimiento del día; el usuario ve una barra de cobertura (% del día), no un contador de calorías.
- Catálogo amplio: el usuario ELIGE entre muchas recetas por comida (objetivo ≥20 opciones por tipo de comida), con filtros por síntoma, tiempo, "con lo que tengo".
- BANCO DE RECETAS: datos/recetas.json v0.1 (60 recetas: 15 por tipo de comida, generadas por IA con base antiinflamatoria del estudio). Valores nutricionales ESTIMADOS, pendientes de validación de la nutricionista; objetivo ≥20 por tipo en la siguiente ronda. Fuente única para la app.
- AJUSTES DE FIDELIDAD AL ESTUDIO (2026-10-31, aprobados): primera victoria <5 min (3 ingredientes → menú de hoy de muestra gratis); kcal/macros en segundo plano (barra de cobertura + detalle técnico desplegable); módulo Menús Express 10 min en Hoy; chequeo diario de síntomas que ajusta el menú de mañana (bucle de retención). Regla del usuario: NO alejarse del estudio.
- INICIO MÁS CÁLIDO (2026-10-31): el usuario sintió el inicio sombrío/triste → pantalla de bienvenida con gradiente durazno, tiras de fotos de comida en cada paso del onboarding, copy cercano ("¡Hola!", "sin pena, sin juicios"), emojis en síntomas, marco de teléfono claro. Titular de bienvenida suave ("Come rico y siéntete ligera"), sin promesa médica.
- El usuario arma su semana completa (7 días × 4 comidas). Meal prep y compras se DESBLOQUEAN solo cuando los 7 días están armados.

## Constitución del Producto (APROBADA por el usuario 2026-10-31)
1. Usuaria: Laura (34), profesional o mamá, llega a la tarde-noche hinchada y agotada, sin saber qué cocinar.
2. Problema: abdomen que se hincha durante el día + fatiga de decidir qué comer. Evita: pesar, contar calorías, dietas restrictivas, ingredientes raros.
3. Promesa: "Esta app ayuda a mujeres ocupadas con hinchazón digestiva a sentirse más ligeras comiendo rico, sin pesar ni contar calorías, mediante menús antiinflamatorios armados con su síntoma, lo que tiene en casa y lo que su cuerpo necesita."
4. Primera victoria (<5 min): marca su síntoma y 3 ingredientes → ve su menú de hoy completo, ya cubriendo lo que necesita.
4b. Mecanismo (nombre): MENÚ CALMA — se arma con tu síntoma + tu despensa + lo que tu cuerpo necesita hoy. Elimina la causa del fracaso anterior (apps de calorías: pesar y no mirar el síntoma). Falsable: dos usuarias con síntoma y despensa distintos deben recibir menús distintos; si no, el mecanismo es falso.
5. Tres flujos clave: (a) Primer menú: síntoma + 3 ingredientes → menú de hoy · (b) Armar la semana: 7 días × 4 comidas → se desbloquea meal prep + compras · (c) Cierre del día: ¿cómo terminó tu abdomen? → ajusta el menú de mañana.
6. NUNCA: exigir pesar o contar gramos · prometer curar, diagnosticar o "panza plana garantizada" · culpar (rachas rotas = tono cuidador, no castigo) · dark patterns o cobros ocultos · vender o ceder datos de salud · empujar objetivos de peso agresivos ni a personas con trastornos alimentarios · inventar testimonios.

## Gamificación y retención (se documenta en Sesión 4)
- Bucle semanal del PDF: push domingo → revisar menú → compras → meal prep de ~90 min
- Primera victoria <5 min: síntoma + 3 ingredientes → menú antiinflamatorio del día
- Mitigación churn: rotación de especias/métodos de cocción; módulo "Menús Express de 10 minutos"
- Loop completo gatillo→acción→recompensa→inversión + D1-D7: pendiente

## Secuencia maestra de construcción (NO saltar)
- Estado: Landing y Onboarding LISTOS (revisor-visual) · siguiente etapa: Paywall (pendiente del OK del usuario). Onboarding: LISTA en la 6ª revisión (36/40 · 16/20 · 16/20, fidelidad FIEL, justo en umbral) · Landing: LISTA en la 6ª revisión tras el rediseño con color y vida (36/40 · 16/20 · 16/20, fidelidad FIEL; justo en umbral). Detalle:  (1ª revisión del revisor-visual: NECESITA CORRECCIÓN 30/40 · 14/20 · 15/20; ajustes aplicados, 2ª revisión en curso)
- Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida en Next 16 desde el kit (app/page.tsx, components/landing/), CTA → /onboarding (modelo 2) · Onboarding: construido (components/onboarding/Flow.tsx, lib/calculos.ts, lib/recetas.ts; 6 pasos: consentimiento → datos → requerimientos → síntomas → 3 ingredientes → primer menú; cálculo local Mifflin-St Jeor; datos solo en memoria, sin backend) · Paywall (marcador /paywall) / Login / App interna / Servicios externos: pendiente
- Proyecto de código en la raíz (Next 16.4 + Tailwind 4 + motion + lucide). Servidor local de revisión: npx next start -p 3100
- DESVIACIONES del kit (justificadas): (1) OfertaUnica.tsx — el kit trae Oferta anual/mensual con trial; la decisión del usuario es pago único $14.99 sin trial. (2) FooterLegal con soporteEmail opcional — aún no hay correo de la empresa. (3) CtaFinal usa --accent-on-dark para que el acento se lea sobre el bloque invertido. (4) FooterLegal con anio fijo 2026 (new Date() no compila en client component prerenderizado).

## Puertas de etapa
- Landing: aprobada por el revisor (6ª pasada, con color y vida; garantía 7 días por Hotmart) · pendiente OK del usuario
- Onboarding: aprobado por el revisor (6ª pasada) · pendiente OK del usuario
- Paywall, Login, App interna: no iniciadas · Servicios externos: bloqueados.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: pendiente (regla de 51/04)
- MVP funciones núcleo (PDF, en orden): 1) onboarding de síntomas 2) selector táctil de ingredientes por categorías 3) menú diario de 4 comidas 4) guía paso a paso de meal prep con indicador de congelación 5) compras automáticas por faltantes
- NO construir: red social/foro, pedidos a supermercados, escáner de códigos, chat con nutricionista en vivo, seguimiento de agua

## Rescate de onboarding y paywall — fases R1-R3 hechas (2026-10-31), esperando OK para R5
- R1 (estado real): onboarding de 12 pasos (situación → síntomas → ritmo → permiso → filtro → datos → actividad → objetivo → tus números → ingredientes → carga "Armando tu Menú Calma" → menú con fotos). Paywall DESPUÉS del menú, modelo onboarding-first con pago único $14.99 (decisión de la usuaria, sin prueba gratis), garantía 7 días por Hotmart. La app NO está en producción todavía: no hay datos de conversión, todo lo que se estime es hipótesis.
- R2 (fallas contra 02B/02C): (1) el paywall ya NO muestra "Hecho con tus N respuestas" (regla obligatoria a de LA ESCALERA) — se quitó al reescribir el subtítulo; (2) falta el etiquetado de identidad antes del paywall (peldaño 6) y el compromiso explícito (peldaño 7); (3) no se pide nombre, así que el paywall no puede decir "El Menú Calma de <nombre>"; (4) la primera victoria llega tras 12 pasos (meta del SO: <60 s de valor visible); (5) sin salida corta en ingredientes ("elegir por mí"); (6) sin prueba social ni ancla con cifra: pendientes de contenido real, no se inventan; (7) pantalla post-pago (peak-end) depende del pago real (servicios externos).
- R3 (plan propuesto, sin ejecutar): ver el mensaje de cierre de esta sesión. No se ejecuta nada hasta el OK de la usuaria.

## Rescate R5 ejecutado (2026-10-31) — resultado
- Cambios hechos: paso opcional de nombre, etiqueta de identidad ("Cocinera de 20 minutos"), "Hecho con tus N respuestas" restaurado en la pantalla de planes, titular con nombre, chip de celebración, "Elige por mí", oferta clara al final del menú (60 recetas, $14.99, 7 días), barras proporcionales, "meal prep" traducido.
- Veredictos del revisor tras el rescate: planes NO LISTA 30/40 · 16/20 · 15/20 (frena la falta de prueba real: cifra de consulta/testimonios, pendientes de la dueña); onboarding NO LISTA 32/40 · 15/20 · 15/20 (la versión v3 previa, commit d1c5489, había salido LISTA 36/16/16: el revisor puntúa distinto en cada pasada, sin cambios de diseño que lo expliquen). DECISIÓN DE LA USUARIA (2026-10-31): conservar los cambios del rescate. Veredicto onboarding y planes: pospuestos como NO LISTA hasta contar con contenido real (cifra de consulta, testimonios) y poder medir conversión con tráfico real; se re-lanza el revisor entonces.

## Diseño vistoso del onboarding (2026-10-31, pedido de la usuaria)
- Contenido intacto. Añadidos: ícono grande de color en cada paso, íconos de color en cada opción (actividad, objetivo, ritmo, síntomas, sexo, filtro), flecha en los botones con sombra de color, barra de avance con degradé oliva→mostaza y chips de ingredientes con color por grupo. Sin revisión formal del revisor tras este cambio (solo estético).

## Etapa 4 — Pantalla de acceso (login), 2026-10-31
- Construida en app/login + components/login/Login.tsx: enlace mágico por correo como método principal (el comprador de Hotmart entra con el correo de su compra), Google marcado como "llegará pronto", sin contraseñas, 3 estados (inicio, error, enviado con cuenta atrás de 60 s), sello de marca. La pantalla de planes enlaza con "¿Ya compraste? Entra a tu cuenta".
- NO envía correos ni abre cuentas hasta conectar Supabase/Resend/Hotmart (servicios externos); el estado "enviado" es mockup honesto con aviso "Vista previa".
- Veredicto del revisor tras 3 pasadas: NO LISTA (31/40 · 15/20); los últimos ajustes (guía "cómo funciona", Google como texto, sello legible) no se re-puntuaron. Frena la identidad (crema+oliva+serif, sin segundo dispositivo propio) y subjetividades del revisor; sin defectos funcionales abiertos.

## Etapa 5 — App interna (2026-10-31)
- Construida: 5 secciones con barra inferior — Hoy (menú del día con "Te toca", chequeo diario, avance semanal), Semana (planificador 7×4 con fechas reales, ← → entre semanas, "Completar por mí" con Deshacer, desbloqueo de la preparación de una tarde al llegar a 28/28), Recetas (60, búsqueda y filtros, hoja con ingredientes/pasos y valores plegados), Compras (lista por pasillo con casillas + guía de preparación de una tarde con las recetas que se guardan) y Yo (números del cuerpo, datos editables, cuenta, privacidad, borrar datos). Rutas /app, /app/semana, /app/recetas, /app/compras, /app/yo.
- Datos: solo en el celular (localStorage, lib/semana.ts) con semana de ejemplo de Laura; la base real llega en servicios externos. La semana de ejemplo usa recetas con foto en el día de hoy.
- Veredictos del revisor tras 2 pasadas: Hoy NO LISTA 32/40 · 14/20; Semana NO LISTA 30/40 · 15/20. Corregidos: acción primaria "Te toca", hoja sobre la barra, movimiento, deshacer, n/4 por día. Abiertos: identidad (sin dispositivo firma propio), 52 de 60 recetas sin foto (pendiente de la dueña), trampa de foco en las hojas, transición entre pestañas. Recetas, Compras y Yo sin revisor (secundarias). Sin defectos funcionales abiertos.

## Problemas conocidos ⚠️
- onboarding v3 (12 pasos, 2026-10-31): rehecho tras comparar con una guía externa (empatía primero, ritmo de cocina que cambia el menú, pantalla de carga "Armando tu Menú Calma", etiquetas Express/Congelable, línea de dolor del paywall según la situación elegida). Veredicto LISTA en la 4ª pasada (36/40 · 16/20 · 16/20), justo en umbral. Pendientes: (1) las 2 primeras pantallas (situación y síntomas) van ANTES del permiso de datos de salud, todo queda en el navegador del celular y la pantalla lo dice: confirmar con la abogada; (2) el primer menú usa solo recetas con foto (BONO_FOTO en lib/calculos.ts) hasta que haya fotos de las 52 restantes: bajarlo a 1 entonces; (3) opcional: dispositivo firma propio en los pasos, atajos de teclado, aviso de scroll en el paso 12.
- paywall (pantalla de planes) construida en app/paywall + components/paywall/Paywall.tsx; veredicto del revisor tras 6 pasadas: NO LISTA (33/40 · 15/20 · 16/20; el texto ya pasa, faltan usabilidad y diseño). Lo que lo frena es de CONTENIDO de la usuaria, no de diseño: (1) precio real de una consulta (opcional, para el ancla), (2) testimonios reales si existen (no se inventan). DECISIÓN DE LA USUARIA: no mostrar nombre ni rostro de la nutricionista; solo "avalada por una nutricionista" (ya en landing y paywall). Estado: no se declara lista hasta aportarlos y re-lanzar el revisor. El botón NO cobra: sin NEXT_PUBLIC_HOTMART_CHECKOUT_URL muestra un aviso honesto; el enlace real va en servicios externos. Pendiente menor: isotipo real de marca en la cabecera (hoy un cuadrado oliva).
- veredicto onboarding (caducado por fecha de archivo, pospuesto 2026-10-31): el aviso sale porque la landing comparte app/page.tsx y components/landing/ con esa comprobación; el código del onboarding (components/onboarding/Flow.tsx) no cambió visualmente desde su 6ª revisión LISTA. Se re-lanza el revisor del onboarding antes de cerrar la etapa de paywall.
- direcciones-abc (pospuesto 2026-10-31): replica-fiel.html y vista-previa-app.html son previsualizaciones de identidad ya aprobadas, no la app; se rehacen desde el kit abc-v2 solo si la usuaria lo pide.
- veredicto onboarding (aviso de "caducado" tras el 6º veredicto LISTA): desde entonces solo cambió una frase dentro de "Ver mis números" (fórmula de Mifflin-St Jeor) y los factores de proteína en lib/calculos.ts, sin cambio visual de pantalla. Se re-lanza el revisor-visual del onboarding y de la landing cuando termine el recálculo de las recetas con la tabla de composición, antes de cerrar la etapa.
- veredicto landing (aviso de "caducado"): el control compara con cualquier .tsx más nuevo (p. ej. components/onboarding/Flow.tsx, que es del onboarding). El código de la landing (app/page.tsx y components/landing/) no cambió desde su 4ª revisión LISTA; solo se editó el onboarding. Si se toca la landing, se re-lanza el revisor.
- fotos: 8 fotos de la Etapa 1 recibidas el 2026-10-31 (generadas por la usuaria con IA) e instaladas en public/recetas/{d01,a02,m01,c01,d02,a01,m02,c07}.jpg; m01 se recortó para quitar una tarjeta de ingredientes superpuesta. Landing e onboarding usan capturas REALES de la app (public/mocks/real-*.jpg). Quedan 52 recetas sin foto (color + emoji de apoyo). Re-revisión del revisor-visual de landing y onboarding en curso.

- veredicto onboarding: LISTA (docs/revisiones/onboarding-veredicto.md, 6ª pasada). Abiertos S2/S3: 52 recetas sin foto (color + emoji), fotos de platos generadas con IA por la usuaria, vacío en los pasos 3-4, identidad cercana al veto "papel cálido + verde" (viene de la referencia), consentimiento en servidor y validación de la nutricionista (fórmula y banco de recetas).
- veredicto landing: LISTA (docs/revisiones/landing-veredicto.md, 6ª pasada). Después solo cambió el texto de garantía de 15 a 7 días (por Hotmart), sin cambio de diseño: el aviso de veredicto caducado es por fecha de archivo. Pendiente de contenido de la usuaria: credencial de nutricionista y testimonios reales (especificidad del copy = 2/4; no se inventan). Sello de garantía: repetirlo como firma en hero/oferta es opcional. Abiertos de severidad media/baja: cifra real para "60 recetas" y el ancla de nutricionista, alineación mixta de títulos del kit, sin testimonios (no se inventan), fotos generadas con IA (leyenda "ilustrativas" visible), FAQ sin gluten/lácteos.
- audit-conversion.sh: 13 críticos mayormente falsos positivos por escanear comentarios/strings del propio kit (voseo "animate", hairlines y gradientes que sí existen en ui.tsx/Hero.tsx); se revisan con el revisor-visual.
- Legal (47): borradores en docs/legal/ (política de privacidad + consentimiento y deslinde). Responsable: Conexión Digital, Ecuador (LOPDP; autoridad: Superintendencia de Protección de Datos Personales — verificar con abogado). Pendientes: correo de contacto propio, ciudad/RUC, términos y política de reembolso, pantalla de consentimiento en la app, revisión de abogado local. Datos de salud = sensibles.
- FICHA-MODELO: creada en BORRADOR (modelo: Fitia, eje: ángulo síntoma). Secciones 2-6 con NO ENCONTRADO: completar con investigación antes de la landing.
- veredicto paywall: no aplica todavía — el paywall NO está construido (etapa no iniciada); el veredicto del revisor-visual se genera al construirlo.
- direcciones-abc (kit abc-v2): replica-fiel.html y vista-previa-app.html se escribieron a mano (HTML+CSS propio con tokens.css), NO desde plantillas-codigo/direcciones-abc/plantilla.html, así que no llevan data-kit="abc-v2". Pospuesto a propósito: son previsualizaciones de identidad, no la app. Se rehacen desde el kit si el usuario lo pide o antes de construir la landing. Fuente de verdad de estilo: FICHA-ARTE.md + tokens.css.
- vista-previa: tour aprobado por el usuario = pendiente. Fotos de comida son placeholders (gradiente+emoji) hasta tener fotografía real o generada. Test de fidelidad contra la captura: pendiente.
- Riesgo legal salud: deslinde obligatorio (orientación general, no sustituye médico). No prometer curación ni "panza plana" garantizada.
- Claim "personalizado por nutricionistas / respaldo profesional": NO usar hasta tener un nutricionista real que lo respalde (gate 61).
- Testimonios: no inventar; usar demo real + beta honesta.

## Pendientes del usuario
- [ ] Opinar sobre réplica fiel y tour (me encanta / ajustar / repensar)
- [ ] (Más adelante) cuentas: Hotmart, Supabase, Vercel, Resend, dominio

## Notas para la próxima sesión
- Idea entró con RESUMEN FINAL validado: no revalidar ni proponer alternativas.
- PDF fuente: C:\Users\MISHELLE\Downloads\estudio de mercado, cliente ideal, razones .pdf
- Escribir archivos con herramienta Write/Edit (UTF-8); evitar Set-Content sin -Encoding en PowerShell 5.1 (corrompe tildes).

## Ajustes de la app interna tras la primera revisión del usuario
- Hoy: chequeo "¿Cómo te sientes hoy?" arriba; el % se cambió por "n de 4 listas".
- Meal prep real: pestaña "Prep" (/app/prep) con tarde de cocina (recetas, comidas, tiempo, pasos tachables, nevera/congelador por receta, botón "Armar mi semana de meal prep" con Deshacer). Compras es la otra mitad (conmutador). Ya no está bloqueado.
- Recetas: filtros en 3 grupos (Comida · Tu tiempo en la cocina · Te ayudan con).
- Yo: encabezado animado, sensaciones de la semana, logros, números con color.
- ⏸️ CHECKPOINT: esperando feedback del usuario; revisor-visual no corrido en estas pantallas. Siguiente: servicios externos con su OK.

## Banco ampliado a 300 recetas + meal prep al elegir (2026-10-31)
- Se importaron 240 recetas de los recetarios LIVIANA (CSV de Descargas del usuario: Canva desayunos/almuerzos, Cenas, Meriendas, Air Fryer, En familia, Snacks, Postres, Aderezos) a datos/recetas.json v0.4. Script reutilizable: guardado solo en scratchpad (importar.js); ids "x…". Campos nuevos: categoria, porciones, nevera_dias, tiempo_texto, fuente.
- ⚠️ Síntomas y tiempos de guardado de las 240 nuevas son REGLAS AUTOMÁTICAS (32 sin síntoma): pendientes de revisión de la nutricionista. Valores nutricionales de las nuevas = los del recetario (no INCAP/USDA); las 60 de antes siguen con INCAP/USDA.
- Aderezos: se ven en Recetas pero no se ponen en la semana; postres no se sugieren solos.
- Meal prep al elegir receta (Semana y Recetas): componente PlanificarPrep recomienda cuántas comidas y qué días según porciones y días de nevera/congelador; el tab Prep lista lo que se repite.
- Yo: quitada la etiqueta "Cocinera de…". Textos de ventas/planes dicen 300 recetas (lib/oferta.ts, mantener igual al banco).
- ⏸️ CHECKPOINT: esperando feedback; revisor-visual no corrido; fotos solo 8 recetas.
- Síntomas/guardado de las 240 recetas nuevas: la usuaria los revisó y le parecen bien (2026-10-31). Quitada la etiqueta "Cocinera de…" de Yo, onboarding y pantalla de planes. Lista de fotos: docs/lista-fotos.csv (archivo = id.jpg en public/recetas). Guía PDF en Prep: aparece sola si existe public/guia-meal-prep.pdf; ⚠️ al estar en public es descargable sin login → cuando haya Supabase moverla a almacenamiento privado.
- Guía PDF 'Meal Prep LIVIANA' (10 págs, 27 MB) puesta en public/guia-meal-prep.pdf; trae marca LIVIANA e Instagram @liviana_alimentacion (confirmar que es lo que quiere mostrar). Pendiente: comprimir (27 MB pesa para celular) y moverla a almacenamiento privado.
- Decisión (2026-10-31): la usuaria deja la guía PDF tal cual, con marca LIVIANA e Instagram. Pendiente solo: comprimirla y moverla a almacenamiento privado.
- Logo de la usuaria (dorado/verde, olla con batidor y hoja) puesto sin fondo y recortado: public/logo.png, ícono de pestaña app/icon.png y apple-icon.png (se quitó favicon.ico). Visible en página de ventas (arriba y pie), acceso, planes, pantalla 'armando' del recorrido de inicio y Hoy. Pendiente: versión vectorial/profesional del logo y revisar bordes en fondo oscuro.
- Servicios externos: la usuaria ya creó el proyecto Supabase (ref xflwckpomldxxymkhmxp, URL pública https://xflwckpomldxxymkhmxp.supabase.co). Falta: repositorio GitHub (dirección), claves solo por entorno, Resend, Vercel, Hotmart, dominio.
- GitHub: repo privado https://github.com/mishellearcosm1707/cocina-en-calma- (rama main) con la app subida (2026-11-01). Siguiente: Supabase (tablas+RLS+login), Resend, Vercel, Hotmart, dominio.
- Supabase (2026-11-01): CLI conectada y proyecto enlazado; migración supabase/migrations/20261101000000_base.sql aplicada (tablas estado_app, accesos, eventos_hotmart con RLS; estado de la app = una fila jsonb por persona; accesos/eventos solo los escribe el webhook con la clave secreta). Falta: poner la clave pública en .env.local (la usuaria, sin pasarla por chat), login real con enlace al correo, sincronizar estado, webhook Hotmart, Resend como correo de Supabase, URLs de redirección tras publicar.
- Login real (2026-11-01): enlace al correo con Supabase Auth (Login.tsx → signInWithOtp; app/auth/callback canjea el código); proxy.ts protege /app (sesión + acceso activo en tabla accesos, si no → /login o /paywall?sin_acceso=1); estado de la app sincronizado con estado_app (lib/semana.ts: iniciarSincronizacion/cerrarSesion). Para probar: en Supabase → Authentication → URL Configuration agregar redirect http://localhost:3100/auth/callback y http://127.0.0.1:3100/auth/callback; y dar acceso a la dueña con un insert en accesos. Pendiente: mensajes de ?enlace=invalido y ?sin_acceso=1, Resend como SMTP, webhook Hotmart (crea el acceso), URLs de producción.
- Hallazgo (2026-11-01): el enlace del correo falla si se abre en un navegador distinto al que lo pidió (flujo PKCE) → para compradoras reales hace falta plantilla propia con token_hash (supabase/templates/acceso.html + [auth.email.template.*] en supabase/config.toml, ya escritos) y una página /auth/confirmar. Supabase NO permite plantillas propias en plan gratis sin SMTP propio: primero conectar Resend como SMTP, luego `npx supabase config push --yes`. config.toml ya está alineado con el proyecto remoto (diff solo de plantillas).
- Login por enlace ahora usa flujo implícito (supabaseEnlace + /auth/entrar) para que el enlace sirva en cualquier navegador; redirect URLs de Supabase = localhost/127.0.0.1:3100/** (config push hecho). Plantillas propias siguen comentadas hasta tener SMTP (Resend).
- Fotos (2026-11-04): 25 recetas nuevas con foto (a03-a15 salvo a01/a02, c02-c14 salvo c01/c07) desde 'Downloads/IMAGENES APP', reducidas a 1000px JPG. Ya hay 33 fotos de 300. Revisar: c04 (foto de sopa de calabaza vs receta crema de zanahoria) y c14 (arroz con salteado vs salteado de pavo).
- Fotos optimizadas (2026-11-04): cada receta con 2 tamaños (id.jpg 640px, id-s.jpg 240px) y srcset en la app; script para tandas nuevas: node scripts/importar-fotos.mjs "<carpeta>" (luego npm run build). Total ~2.6 MB para 33 fotos.
- Cuenta nueva (2026-11-04): login probado OK (la usuaria entró). Cuenta sin perfil → /onboarding?cuenta=1 (arma perfil real y entra a /app, sin textos de compra); estado real sin historial inventado (crearReal: 3 primeros días armados); useApp espera a la sincronización (sin parpadeo de datos de ejemplo); 'Borrar mis datos' borra en la nube y vuelve al recorrido. Pendiente: Vercel (la usuaria importa el repo), URLs de producción en Supabase, Resend, Hotmart.
- Publicado (2026-11-04): https://cocina-en-calma.vercel.app (Vercel Hobby, proyecto cocina-en-calma conectado a GitHub rama main; variables NEXT_PUBLIC_SUPABASE_URL y _PUBLISHABLE_KEY en Producción y Vista previa). /app redirige a /login sin sesión (probado). Supabase: site_url y redirect URLs apuntan a la dirección de Vercel (config push hecho). ⚠️ Hobby = solo uso no comercial: pasar a Pro antes de cobrar. Pendiente: probar el acceso en producción, Resend (correos propios), Hotmart (checkout+webhook, SUPABASE_SECRET_KEY y HOTMART_HOTTOK solo en Vercel), dominio propio, PDF privado.
- Guía PDF privada (2026-11-04): ya no está en public/. Vive en el bucket privado 'guias' de Supabase (migración 20261104000000) y /app/guia (exige sesión + acceso activo) redirige a un enlace temporal de 5 min. Original local en fuentes-privadas/ (ignorado por git). ⚠️ El PDF sigue en el historial de git (repo privado) y estuvo público unas horas en la web: si importa, quitar del historial. Subir otra versión: npx supabase --experimental storage cp --remote --yes <archivo> ss:///guias/guia-meal-prep.pdf
- Webhook de Hotmart (2026-11-04): app/api/webhooks/hotmart (lib/hotmart.ts). Pipeline: hottok en tiempo constante → producto permitido (HOTMART_PRODUCT_ID) → dedupe en eventos_hotmart → acceso en accesos (compra=activo, reembolso/contracargo=reembolsado, cancelación=cancelado; un reembolso viejo no quita una compra nueva). Sin config completa responde 500 (nunca abierto). Probado local: 401 sin/mal hottok, 200 otro producto/sin efecto, 400 cuerpo roto. NO probado con base real: falta SUPABASE_SECRET_KEY, HOTMART_HOTTOK y HOTMART_PRODUCT_ID en Vercel (los pone la usuaria directo en Vercel, Sensitive). URL para Hotmart: https://cocina-en-calma.vercel.app/api/webhooks/hotmart. Sin ventana de frescura a propósito (Hotmart reintenta días después).

## Panel de administración (2026-11-05)
- Construido: /admin con 8 secciones (Resumen, Ventas, Ganancia, Usuarias, Uso, Negocio, Salud, Ajustes). Acceso solo admin: proxy (404 real sin sesión de admin, política RLS de `admins`) + exigirAdmin() en layout, páginas y acciones; datos con clave secreta solo en servidor (server-only). Tablas nuevas (migración 20261105000000): admins, ventas, event_log, error_log, webhook_log, costos_config, gasto_adquisicion, admin_log, todas con RLS sin políticas (solo servidor). Hotmart guarda importe/comisión/canal en `ventas`. Eventos anónimos (/api/eventos, lista cerrada, sin PII) y errores (app/error.tsx). Privacidad actualizada. Acciones manuales con auditoría: dar acceso a mano, cambiar estado, enlace de entrada, costos, gasto de adquisición.
- No aplica y se dice así: MRR/churn (pago único), costo de IA (la app no usa IA), Sentry (no conectado → "Sin datos").
- Evidencia: capturas reales de la dueña en docs/revisiones/admin-resumen-desktop.png y admin-usuarias-desktop.png. revisor-visual sobre Resumen (1ª pasada): NO LISTA 27/40 · 8/20 (banner verde con 0 datos, 8 tarjetas sin héroe, sin movimiento). Corregido: estado neutro sin datos, 1 héroe + 2 filas de 3, entrada escalonada, feedback al tocar, pestaña activa a la vista, íconos en vez de emojis. PENDIENTE: nueva captura de Resumen para re-puntuar. Resto de pantallas del panel: sin revisor (secundarias).
- Pendiente de la dueña: HOTMART_HOTTOK, HOTMART_PRODUCT_ID y SUPABASE_SECRET_KEY (ya puesta) en Vercel; ?src= en el enlace de pago; registrar costos en Ajustes.

## Pulido general (2026-11-05)
- Página 404 propia en español (también la ve quien no es admin en /admin); mensaje en la pantalla de planes cuando un correo no tiene acceso (?sin_acceso=1).
- robots.txt (solo ventas y legales se indexan), sitemap.xml, manifest (instalable en la pantalla de inicio), color del navegador y cabeceras de seguridad (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). Sin CSP todavía (pendiente, riesgo de romper fuentes/Supabase).
- Hojas de receta y selector de semana: el foco entra, se queda dentro (Tab/Shift+Tab) y vuelve al cerrar (lib/foco.ts).
- Lista de compras: lib/ingredientes.ts limpia cantidades, jugo/ralladura→fruta, sal y pimienta en un renglón, separa "X y Y", junta singular/plural (340 → 292 artículos distintos).
- Pruebas automáticas: npm test (tests/*.mjs con node:test): hottok, eventos de Hotmart, importes, ingredientes. 7 pruebas pasan.
- Pendiente del pulido: CSP, límite de peticiones en /api/eventos, re-puntuar Resumen del panel (falta captura nueva), fotos de 267 recetas, textos legales con datos reales de la dueña.
