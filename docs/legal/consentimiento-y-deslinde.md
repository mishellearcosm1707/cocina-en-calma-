# Consentimiento y deslinde — Cocina en Calma

> **NOTAS INTERNAS (borrar antes de publicar):** borrador v0.1 del 2026-10-31. Textos para la app (onboarding y ajustes) y especificación técnica para guardar el consentimiento. Requiere revisión de abogado local por tratar datos de salud. Los textos entre comillas son los que ve la usuaria.

## A. Pantalla de consentimiento (se muestra ANTES de pedir peso, talla y síntomas)

**Título:** "Antes de empezar, cuídate tú y cuidamos tus datos"
**Texto de apoyo:** "Para calcular lo que necesita tu cuerpo te pedimos datos de salud. Son sensibles, por eso te los pedimos con tu permiso."

Casillas (NINGUNA premarcada; cada una es una decisión separada):

1. ☐ **(Obligatoria para crear tu cuenta)** "Acepto los [Términos de Servicio] y la [Política de Privacidad]. Confirmo que tengo 18 años o más."
2. ☐ **(Obligatoria para calcular tus requerimientos y menús)** "Autorizo de forma expresa el tratamiento de mis datos de salud (sexo, edad, peso, talla, actividad física, objetivo y síntomas digestivos) para calcular mis requerimientos y sugerirme menús. Sé que son datos sensibles, que se guardan en servidores de proveedores en el extranjero (por ejemplo, EE.UU.) y que puedo retirar esta autorización cuando quiera."
3. ☐ **(Opcional)** "Quiero recibir novedades y recetas por correo."
4. ☐ **(Opcional)** "Acepto que midan cómo uso la app para mejorarla."

**Si no marca la casilla 2:** puede ver el menú de muestra, pero no se le piden ni se guardan peso, talla ni síntomas, y no se calculan requerimientos. Mensaje: "Sin este permiso no podemos calcular lo que necesitas. Puedes dárnoslo cuando quieras."
**Botón:** "Continuar" (deshabilitado hasta marcar las casillas 1 y, para calcular, la 2).

## B. Deslinde visible (3 lugares, el mismo mensaje)
Texto: "Cocina en Calma ofrece orientación nutricional general. No diagnostica ni trata enfermedades y no reemplaza a tu médico o nutricionista."
Dónde va: (1) en los Términos, (2) en la pantalla "Esto necesita tu cuerpo" y en la pantalla de datos, (3) en el pie de las recetas.

**Aviso de uso responsable** (se muestra junto a la pantalla de datos): "No uses esta app para decidir tu alimentación si estás embarazada o en lactancia, tienes diabetes, enfermedad renal o hepática, alergias graves, o has tenido un trastorno de la conducta alimentaria. En esos casos consulta primero a tu profesional de salud."

## C. Especificación técnica del registro de consentimiento (ledger)
Tabla `consentimientos` (una fila por decisión, solo se agregan filas, no se editan):
- `usuario_id`, `finalidad` (`terminos_privacidad` | `datos_salud` | `novedades` | `analitica`), `otorgado` (sí/no), `version_texto` (ej. `v0.1`), `fecha_hora`, `idioma`, `origen` (`onboarding` | `ajustes`), `retirado_en` (fecha, si lo retira).
- Reglas: casillas sin premarcar; no guardar el "sí" en el navegador para premarcar la próxima vez; al cambiar el texto o la política, pedir consentimiento de nuevo; retirar consentimiento de `datos_salud` bloquea el cálculo y ofrece borrar esos datos.
- Seguridad: cada usuario solo puede leer sus propias filas (RLS); el borrado de cuenta elimina datos de salud y deja solo el registro mínimo de consentimiento/compra que la ley exija.

## D. Dónde se muestran los enlaces legales
- Footer de la página de ventas: Términos · Privacidad · Reembolso · Contacto
- Registro/onboarding: casilla 1 con enlaces
- Ajustes: "Mis datos" (descargar), "Retirar permisos", "Eliminar mi cuenta"

## E. Pendientes antes de publicar
- [x] Responsable: Conexión Digital, Ecuador (dado por el usuario 2026-10-31)
- [ ] Correo de contacto de privacidad (crear uno propio de la empresa, no personal), ciudad/dirección y RUC → completar [PENDIENTE] en la política
- [ ] Términos de Servicio y Política de Reembolso (alineada a Hotmart: garantía de 15 días) — por redactar
- [ ] Confirmar proveedores y regiones de servidor; decidir si se activa analítica
- [ ] Revisión de abogado en Ecuador (ver docs/legal/brief-para-abogado.md)
- [ ] Construir la pantalla de consentimiento (hoy no está en la vista previa)
