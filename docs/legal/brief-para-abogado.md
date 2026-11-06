# Brief para el abogado — Cocina en Calma (Conexión Digital, Ecuador)

> Actualizado el 2026-11-06 tras la auditoría legal: ya existen Política de Privacidad v1.0, Términos v1.0, Garantía y Reembolsos v1.0, Política de Cookies v1.0 y Aviso de salud v1.0 (ver `docs/legal/`). "Conexión Digital" es el nombre comercial de una **persona natural** (no hay empresa constituida); el nombre y cédula de la titular NO figuran públicamente por decisión de la dueña: consultar si la LOPDP exige identificarla en la política.

**Qué es:** app web de menús y meal prep antiinflamatorios. La usuaria ingresa sexo, edad, peso, talla, actividad física, objetivo y síntomas digestivos; la app calcula requerimientos aproximados y sugiere recetas. Venta por pago único de USD 14.99 a través de Hotmart a público hispanohablante (México, Colombia, Argentina, Chile, España, EE.UU.). Mayores de 18 años. La app NO usa IA de terceros con datos de usuarios.

**Documentos a revisar:** `politica-de-privacidad.md`, `terminos-de-servicio.md`, `politica-de-reembolsos.md`, `politica-de-cookies.md`, `consentimiento-y-deslinde.md` y el Aviso de salud (`app/aviso-salud/page.tsx`).

**Preguntas concretas:**
1. Datos de salud: ¿cuentan como categoría especial bajo la LOPDP de Ecuador? ¿El texto de consentimiento expreso (casilla 2) es suficiente y está bien redactado?
2. ¿Necesitamos delegado de protección de datos, registro ante la Superintendencia u otra obligación por tratar datos de salud?
3. Transferencia internacional (Supabase, Vercel, Resend, Hotmart, servidores en el extranjero): ¿qué cláusulas o garantías hacen falta?
4. Vendiendo a usuarias de otros países: ¿qué obligaciones mínimas adicionales (México LFPDPPP, Colombia Ley 1581, Argentina, Chile, UE) conviene cubrir desde el inicio?
5. Plazos de respuesta a solicitudes de derechos y de conservación tras eliminar la cuenta.
6. Deslinde de salud y límites de lo que puede decir la publicidad ("desinflamar", "sentirse ligera"): ¿hay riesgo por claims? ¿Qué requisitos hay para decir que la app cuenta con respaldo de una nutricionista (título/registro)?
7. Política de reembolso: garantía de 7 días alineada a Hotmart y a la ley de defensa del consumidor aplicable.
8. "Conexión Digital" es nombre comercial de una persona natural: ¿qué datos de la titular deben figurar (nombre, RUC) en la política y los términos? ¿Conviene constituir una empresa antes de vender a otros países?
9. Plazos que fijamos: respuesta a solicitudes en 15 días hábiles, conservación de registros de compra hasta 7 años, conteos anónimos hasta 24 meses: ¿son adecuados?
10. ¿Basta el consentimiento de datos de salud registrado (usuario, versión del texto, fecha, correo cifrado como huella) y el botón "Eliminar mi cuenta" para cumplir los derechos ARCO-POL?
