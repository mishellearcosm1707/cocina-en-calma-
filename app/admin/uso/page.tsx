import { Bloque, Embudo, Pagina, Rejilla, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import { calcularUso, cargarVentas } from '@/lib/admin/datos';
import { porcentaje } from '@/lib/admin/formato';

export default async function Uso() {
  await exigirAdmin();
  const [uso, ventas] = await Promise.all([calcularUso(), cargarVentas()]);
  const r = uso.retencion;
  const retencion = (titulo: string, d: { pct: number | null; n: number }, nota: string) => (
    <Tarjeta titulo={titulo} valor={d.pct === null ? null : porcentaje(d.pct)} insight={d.n ? `Sobre ${d.n} persona${d.n === 1 ? '' : 's'}. ${nota}` : 'Aparece cuando haya personas con ese tiempo en la app.'} />
  );
  const pasos = [...uso.embudo, { clave: 'compras', etiqueta: 'Compran (Hotmart avisa)', personas: ventas.length }];

  return (
    <Pagina titulo="Uso" bajada="¿La gente usa la app y vuelve? Todo es anónimo: se cuentan acciones, no se guardan respuestas de salud.">
      <Rejilla>
        <Tarjeta titulo="Activas en 7 días" valor={uso.conEventos ? String(uso.activos7) : null} insight="Personas con cuenta que entraron." />
        <Tarjeta titulo="Activas en 30 días" valor={uso.conEventos ? String(uso.activos30) : null} />
        <Tarjeta
          titulo="Se activan el primer día"
          valor={uso.activacion.pct === null ? null : porcentaje(uso.activacion.pct)}
          insight={uso.activacion.n ? `Sobre ${uso.activacion.n}: hicieron un chequeo, armaron su semana o su meal prep el mismo día que entraron.` : 'Aparece con las primeras entradas.'}
        />
      </Rejilla>
      <Rejilla>
        {retencion('Vuelven el día 1', r.d1, 'Entraron al día siguiente.')}
        {retencion('Vuelven el día 7', r.d7, 'Entraron justo 7 días después.')}
        {retencion('Vuelven el día 30', r.d30, 'Entraron justo 30 días después.')}
      </Rejilla>

      <Bloque titulo="Qué hace la gente en la app">
        {!uso.conEventos ? (
          <VacioInfo>Sin datos todavía. Se llena cuando las personas empiecen a usar la app.</VacioInfo>
        ) : (
          <Tabla columnas={['Acción', 'Últimos 7 días', 'Últimos 30 días']} filas={uso.acciones.map((a) => [a.nombre, a.semana, a.mes])} />
        )}
      </Bloque>

      <Bloque titulo="Dónde se cae la gente (antes de comprar)">
        {pasos.every((p) => p.personas === 0) ? (
          <VacioInfo>Sin datos todavía. Se llena cuando alguien haga el recorrido de inicio.</VacioInfo>
        ) : (
          <>
            <Embudo pasos={pasos} />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">Cuenta navegadores distintos, no personas con nombre. El rojo muestra cuánta gente se pierde de un paso al siguiente.</p>
          </>
        )}
      </Bloque>
    </Pagina>
  );
}
