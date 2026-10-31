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
- Trial: NINGUNO — el menú de muestra gratis hace de prueba · Garantía: 15 días, sin fijar fecha de inicio en el copy (FICHA-MERCADO §4)
- Pricing (decisión del usuario 2026-10-31): PAGO ÚNICO $14.99 USD, sin suscripción, hasta probar cómo va. Plan B: $7.99/mes y $44.99/año del estudio. Pendiente definir qué incluye exactamente (acceso completo sin mensualidades; NO prometer "de por vida" hasta validar costos). Economía: LTV = $14.99 → priorizar tráfico orgánico; el costo por venta pagada debe quedar muy por debajo (comisión de Hotmart: verificar).
- Venta: Hotmart (default del SO)

## Decisiones de producto del usuario (2026-10-31, nutricionista)
- La creadora de la app es NUTRICIONISTA (dato del usuario). El claim "diseñado/revisado por nutricionista" solo se usa con nombre y credencial confirmados por ella (gate 61).
- Onboarding pide: sexo, edad, peso, talla, actividad física, objetivo → la app calcula requerimientos diarios (Mifflin-St Jeor × factor de actividad; ejemplo mujer 30a/65kg/160cm/ligera = 1,840 kcal, coincide con la referencia). Fórmula y macros a validar por la nutricionista antes de construir.
- Las recetas se sugieren y eligen para completar el requerimiento del día; el usuario ve una barra de cobertura (% del día), no un contador de calorías.
- Catálogo amplio: el usuario ELIGE entre muchas recetas por comida (objetivo ≥20 opciones por tipo de comida), con filtros por síntoma, tiempo, "con lo que tengo".
- BANCO DE RECETAS: datos/recetas.json v0.1 (60 recetas: 15 por tipo de comida, generadas por IA con base antiinflamatoria del estudio). Valores nutricionales ESTIMADOS, pendientes de validación de la nutricionista; objetivo ≥20 por tipo en la siguiente ronda. Fuente única para la app.
- AJUSTES DE FIDELIDAD AL ESTUDIO (2026-10-31, aprobados): primera victoria <5 min (3 ingredientes → menú de hoy de muestra gratis); kcal/macros en segundo plano (barra de cobertura + detalle técnico desplegable); módulo Menús Express 10 min en Hoy; chequeo diario de síntomas que ajusta el menú de mañana (bucle de retención). Regla del usuario: NO alejarse del estudio.
- INICIO MÁS CÁLIDO (2026-10-31): el usuario sintió el inicio sombrío/triste → pantalla de bienvenida con gradiente durazno, tiras de fotos de comida en cada paso del onboarding, copy cercano ("¡Hola!", "sin pena, sin juicios"), emojis en síntomas, marco de teléfono claro. Titular de bienvenida suave ("Come rico y siéntete ligera"), sin promesa médica.
- El usuario arma su semana completa (7 días × 4 comidas). Meal prep y compras se DESBLOQUEAN solo cuando los 7 días están armados.

## Gamificación y retención (se documenta en Sesión 4)
- Bucle semanal del PDF: push domingo → revisar menú → compras → meal prep de ~90 min
- Primera victoria <5 min: síntoma + 3 ingredientes → menú antiinflamatorio del día
- Mitigación churn: rotación de especias/métodos de cocción; módulo "Menús Express de 10 minutos"
- Loop completo gatillo→acción→recompensa→inversión + D1-D7: pendiente

## Secuencia maestra de construcción (NO saltar)
- Estado: pre-Landing (fichas pendientes)
- Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing / Onboarding / Paywall / Login / App interna / Servicios externos: pendiente

## Puertas de etapa
- Todas: no iniciadas. Servicios externos: bloqueados.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: pendiente (regla de 51/04)
- MVP funciones núcleo (PDF, en orden): 1) onboarding de síntomas 2) selector táctil de ingredientes por categorías 3) menú diario de 4 comidas 4) guía paso a paso de meal prep con indicador de congelación 5) compras automáticas por faltantes
- NO construir: red social/foro, pedidos a supermercados, escáner de códigos, chat con nutricionista en vivo, seguimiento de agua

## Problemas conocidos ⚠️
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
