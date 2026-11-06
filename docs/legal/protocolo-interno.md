# Protocolo interno de privacidad — Conexión Digital (Cocina en Calma)

> Documento INTERNO (no se publica). Hecho para operar sin abogado mientras la app no tiene ventas. Versión 1.0 · 2026-11-06.
> No es asesoría legal colegiada: es una guía práctica para cumplir lo que prometen las políticas. Cuando haya ventas relevantes, que lo revise un abogado (ver brief-para-abogado.md).

## 1. Cuando alguien pide algo sobre sus datos (derechos)
La persona puede hacer casi todo sola en la app (Yo → Tu privacidad). Si escribe a conexiondigital_hub@outlook.com:
1. **Responde en 15 días como máximo** (antes es mejor). Anota la fecha en que llegó el correo.
2. **Verifica que sea ella:** el correo debe venir de la misma dirección con la que tiene cuenta. Si dudas, pide que lo haga desde la app.
3. **Según lo que pida:**
   - *Copia de sus datos:* indícale **Yo → Descargar mis datos**.
   - *Corregir datos:* se corrigen en **Yo** (peso, actividad, objetivo). Si es el correo, se cambia a mano en el panel.
   - *Eliminar:* indícale **Yo → Eliminar mi cuenta**. Si no puede entrar, hazlo tú: panel → Usuarias (quita acceso) y elimina el usuario en Supabase (Authentication → Users). Se conserva solo el registro de compra.
   - *Retirar permisos / no recibir novedades:* **Yo → Tu privacidad**.
4. **Contesta por escrito** confirmando qué hiciste y la fecha. Guarda el hilo.

## 2. Si hay un incidente de seguridad (datos expuestos, acceso indebido, clave filtrada)
1. **Contén:** cambia la clave comprometida en el proveedor (Supabase, Vercel, Hotmart), cierra sesiones, revisa el panel (Salud) y los registros de Vercel/Supabase.
2. **Evalúa:** qué datos, de cuántas personas, desde cuándo, si incluye datos de salud.
3. **Avisa:** a las personas afectadas **sin demora** (por correo, en simple: qué pasó, qué datos, qué hacer) y a la **Superintendencia de Protección de Datos Personales** dentro de los plazos de la ley (la ley ecuatoriana habla de **5 días**; verifícalo en la fuente oficial al momento del incidente, porque fue reformada en 2026).
4. **Documenta:** fecha, qué pasó, qué hiciste. Guárdalo en una carpeta privada (no en el repositorio).
5. **Corrige la causa** y anótala en ESTADO.md.

## 3. Registro de lo que tratamos (por qué, dónde y cuánto tiempo)
| Dato | Dónde vive | Para qué | Cuánto tiempo |
|---|---|---|---|
| Correo, nombre | Supabase (EE.UU.) | Cuenta y acceso | Mientras haya cuenta |
| Datos de salud y elecciones | Supabase (EE.UU.), copia en el celular de la persona | Armar menús (con su autorización expresa) | Hasta que elimine su cuenta o sus datos |
| Permisos y su versión | Supabase | Demostrar el consentimiento | Se conserva sin correo (solo huella) tras eliminar la cuenta |
| Compra (monto, comisión, canal, correo) | Hotmart y Supabase | Cobro, reembolsos, contabilidad | Hasta 7 años (registros contables) |
| Conteos y errores | Supabase | Mejorar la app | Máximo 24 meses |

## 4. Tareas periódicas
- **Cada 6 meses:** borrar conteos y errores con más de 24 meses (Supabase → SQL: `delete from event_log where creado_en < now() - interval '24 months'`, igual con `error_log` y `webhook_log`).
- **Cada vez que sumes un servicio** (Resend, analítica, IA, otro hosting): actualizar la Política de privacidad **antes** de que reciba datos.
- **Cada cambio de textos legales:** subir `VERSION_LEGAL` en `lib/legal.ts` y avisar a las usuarias por correo.

## 5. Gestiones tuyas que no puede hacer la app
- Aceptar el **acuerdo de tratamiento de datos (DPA)** de Supabase y de Vercel en su panel (sección legal de la cuenta). Es gratis y suele ser un clic.
- Guardar (fuera del repositorio) la **prueba de tu título de nutricionista registrado**, por si alguien cuestiona "avalada por una nutricionista".
- Hablar con un **contador** para declarar lo que Hotmart te paga.
- **Contratar un abogado** cuando: las ventas sean relevantes, vayas a hacer publicidad pagada, constituyas empresa, o te llegue un reclamo.
