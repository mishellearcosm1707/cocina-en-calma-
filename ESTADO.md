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
- MÉTODO APROBADO por la nutricionista (2026-10-31): Mifflin-St Jeor; −10% SOLO si el objetivo es bajar de peso; piso 1200 kcal mujeres / 1500 kcal hombres con cualquier objetivo; proteína g/kg por actividad (0.8/1.0/1.2/1.4, escalones a validar) y macros por AMDR/DRI del IOM 2005. Fuentes en datos/metodo-y-fuentes.md. PENDIENTE: recalcular kcal/macros de las 60 recetas ingrediente por ingrediente con una tabla de composición de alimentos (USDA FoodData Central u otra que ella indique) y medidas caseras → gramos.
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
- Estado: Landing y Onboarding LISTOS (revisor-visual) · siguiente etapa: Paywall (pendiente del OK del usuario). Onboarding: LISTA en la 6ª revisión (36/40 · 16/20 · 16/20, fidelidad FIEL, justo en umbral) · Landing: LISTA en la 4ª revisión (36/40 · 16/20 · 17/20, fidelidad FIEL; margen de 1 punto). Detalle:  (1ª revisión del revisor-visual: NECESITA CORRECCIÓN 30/40 · 14/20 · 15/20; ajustes aplicados, 2ª revisión en curso)
- Ruta: `/` → `/onboarding` → `/paywall` → `/login` → `/app`
- Landing: construida en Next 16 desde el kit (app/page.tsx, components/landing/), CTA → /onboarding (modelo 2) · Onboarding: construido (components/onboarding/Flow.tsx, lib/calculos.ts, lib/recetas.ts; 6 pasos: consentimiento → datos → requerimientos → síntomas → 3 ingredientes → primer menú; cálculo local Mifflin-St Jeor; datos solo en memoria, sin backend) · Paywall (marcador /paywall) / Login / App interna / Servicios externos: pendiente
- Proyecto de código en la raíz (Next 16.4 + Tailwind 4 + motion + lucide). Servidor local de revisión: npx next start -p 3100
- DESVIACIONES del kit (justificadas): (1) OfertaUnica.tsx — el kit trae Oferta anual/mensual con trial; la decisión del usuario es pago único $14.99 sin trial. (2) FooterLegal con soporteEmail opcional — aún no hay correo de la empresa. (3) CtaFinal usa --accent-on-dark para que el acento se lea sobre el bloque invertido. (4) FooterLegal con anio fijo 2026 (new Date() no compila en client component prerenderizado).

## Puertas de etapa
- Landing: aprobada por el revisor (4ª pasada) · pendiente OK del usuario
- Onboarding: aprobado por el revisor (6ª pasada) · pendiente OK del usuario
- Paywall, Login, App interna: no iniciadas · Servicios externos: bloqueados.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: pendiente (regla de 51/04)
- MVP funciones núcleo (PDF, en orden): 1) onboarding de síntomas 2) selector táctil de ingredientes por categorías 3) menú diario de 4 comidas 4) guía paso a paso de meal prep con indicador de congelación 5) compras automáticas por faltantes
- NO construir: red social/foro, pedidos a supermercados, escáner de códigos, chat con nutricionista en vivo, seguimiento de agua

## Problemas conocidos ⚠️
- veredicto landing (aviso de "caducado"): el control compara con cualquier .tsx más nuevo (p. ej. components/onboarding/Flow.tsx, que es del onboarding). El código de la landing (app/page.tsx y components/landing/) no cambió desde su 4ª revisión LISTA; solo se editó el onboarding. Si se toca la landing, se re-lanza el revisor.
- fotos: 8 fotos de la Etapa 1 recibidas el 2026-10-31 (generadas por la usuaria con IA) e instaladas en public/recetas/{d01,a02,m01,c01,d02,a01,m02,c07}.jpg; m01 se recortó para quitar una tarjeta de ingredientes superpuesta. Landing e onboarding usan capturas REALES de la app (public/mocks/real-*.jpg). Quedan 52 recetas sin foto (color + emoji de apoyo). Re-revisión del revisor-visual de landing y onboarding en curso.

- veredicto onboarding: LISTA (docs/revisiones/onboarding-veredicto.md, 6ª pasada). Abiertos S2/S3: 52 recetas sin foto (color + emoji), fotos de platos generadas con IA por la usuaria, vacío en los pasos 3-4, identidad cercana al veto "papel cálido + verde" (viene de la referencia), consentimiento en servidor y validación de la nutricionista (fórmula y banco de recetas).
- veredicto landing: LISTA (docs/revisiones/landing-veredicto.md, 4ª pasada). Abiertos de severidad media/baja: cifra real para "60 recetas" y el ancla de nutricionista, alineación mixta de títulos del kit, sin testimonios (no se inventan), fotos generadas con IA (leyenda "ilustrativas" visible), FAQ sin gluten/lácteos.
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
