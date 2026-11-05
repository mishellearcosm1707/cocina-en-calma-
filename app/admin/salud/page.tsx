import { CheckCircle2 } from 'lucide-react';
import { Bloque, Pagina, Rejilla, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import { calcularSalud } from '@/lib/admin/datos';
import { fechaHora, haceCuanto } from '@/lib/admin/formato';

const RESULTADO: Record<string, string> = {
  aplicado: 'Aplicado (dio o quitó acceso)',
  duplicado: 'Repetido (ya estaba procesado)',
  ignorado: 'Ignorado (no cambia nada)',
  no_autorizado: 'Rechazado (contraseña incorrecta)',
  error: 'Con error',
};

export default async function Salud() {
  await exigirAdmin();
  const s = await calcularSalud();
  const fallos = (s.avisos24h['error'] ?? 0) + (s.avisos24h['no_autorizado'] ?? 0);
  const bien = fallos === 0 && s.errores24h < 5;
  const claves = Object.keys(RESULTADO).filter((k) => (s.avisos7d[k] ?? 0) > 0);

  return (
    <Pagina titulo="Salud" bajada="¿Todo funciona? Aquí ves si Hotmart te está avisando bien y si la app tiene errores.">
      <p role="status" className="rounded-[var(--radius-card)] p-4 text-lg font-bold" style={{ background: bien ? 'var(--olive-wash)' : 'var(--peach)', color: bien ? 'var(--accent)' : 'var(--peach-ink)' }}>
        <span className="flex items-center gap-2">
          {bien && <CheckCircle2 size={24} aria-hidden="true" />}
          {bien ? 'Todo bien en las últimas 24 horas' : 'Hay cosas que revisar abajo'}
        </span>
      </p>
      <Rejilla>
        <Tarjeta titulo="Último aviso de Hotmart" valor={s.ultimoAviso ? haceCuanto(s.ultimoAviso) : null} insight={s.ultimoAviso ? fechaHora(s.ultimoAviso) : 'Hotmart todavía no ha enviado ningún aviso (normal antes de la primera compra).'} />
        <Tarjeta titulo="Avisos con problema (24 h)" valor={String(fallos)} tono={fallos ? 'alerta' : 'bien'} insight={fallos ? 'Puede haber compras sin acceso. Revisa la contraseña del aviso en Hotmart y en Vercel.' : 'Ninguno.'} />
        <Tarjeta titulo="Errores de la app (24 h)" valor={String(s.errores24h)} tono={s.errores24h >= 5 ? 'alerta' : 'bien'} />
        <Tarjeta titulo="Errores técnicos detallados" valor={null} insight="Sentry no está conectado. Aquí se ven los errores que la app registra sola." />
      </Rejilla>

      <Bloque titulo="Avisos de Hotmart (últimos 7 días)">
        {claves.length ? <Tabla columnas={['Resultado', 'Cantidad']} filas={claves.map((k) => [RESULTADO[k], s.avisos7d[k]])} /> : <VacioInfo>Sin datos todavía.</VacioInfo>}
      </Bloque>

      <Bloque titulo="Errores más repetidos (7 días)">
        {s.errores.length ? (
          <Tabla columnas={['Error', 'Pantalla', 'Veces', 'Último']} filas={s.errores.map((e) => [e.mensaje, e.pantalla ?? 'Sin datos', e.veces, haceCuanto(e.ultima)])} />
        ) : (
          <VacioInfo>Sin errores registrados en los últimos 7 días.</VacioInfo>
        )}
      </Bloque>
    </Pagina>
  );
}
