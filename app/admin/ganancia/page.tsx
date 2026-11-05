import { Bloque, Pagina, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import { cargarCostos, cargarVentas, gananciaPorMes, monedaPrincipal } from '@/lib/admin/datos';
import { dinero, nombreMes, porcentaje } from '@/lib/admin/formato';

export default async function Ganancia() {
  await exigirAdmin();
  const [ventas, costos] = await Promise.all([cargarVentas(), cargarCostos()]);
  const { moneda } = monedaPrincipal(ventas);
  const meses = moneda ? gananciaPorMes(ventas, moneda, costos) : [];
  const m = meses[meses.length - 1];

  return (
    <Pagina titulo="Ganancia" bajada="Lo que de verdad te queda después de pagar todos los costos.">
      {!moneda || !m ? (
        <VacioInfo>Sin datos todavía. Cuando entre la primera compra verás aquí cuánto facturaste y cuánto te quedó limpio.</VacioInfo>
      ) : (
        <>
          <Tarjeta
            titulo={`${nombreMes(m.mes)} · ${m.real ? 'Ganancia real' : 'Ganancia (estimación)'}`}
            valor={m.ganancia === null ? null : dinero(m.ganancia, moneda)}
            tono={m.ganancia !== null && m.ganancia > 0 ? 'bien' : 'alerta'}
            insight={m.ganancia === null ? undefined : `Facturaste ${dinero(m.ingresos, moneda)} y te quedaron ${dinero(m.ganancia, moneda)} limpios${m.margen === null ? '' : ` (${porcentaje(m.margen)} de margen)`}.`}
          />
          {!m.real && (
            <VacioInfo>
              Esto es una <b>estimación</b>, no ganancia real, porque: {m.supuestos.join('; ')}.
            </VacioInfo>
          )}
          <Bloque titulo={`Cómo se calcula (${nombreMes(m.mes)})`}>
            <Tabla
              columnas={['Concepto', 'Importe']}
              filas={[
                ['Lo que cobraste (compras vigentes)', dinero(m.ingresos, moneda)],
                ['− Comisión de Hotmart', m.fee === 0 ? 'Sin datos o $0' : dinero(-m.fee, moneda)],
                ['− Afiliados', m.afiliados === 0 ? 'Sin datos o $0' : dinero(-m.afiliados, moneda)],
                ['− Impuestos', m.impuestos === null ? 'Sin datos (regístralo en Ajustes)' : dinero(-m.impuestos, moneda)],
                ['− Infraestructura', m.infra === null ? 'Sin datos (regístralo en Ajustes)' : dinero(-m.infra, moneda)],
                ['− Correos', m.email === null ? 'Sin datos (regístralo en Ajustes)' : dinero(-m.email, moneda)],
                [<b key="g">= Te quedan</b>, <b key="v">{m.ganancia === null ? 'Sin datos' : dinero(m.ganancia, moneda)}</b>],
              ]}
            />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">El costo de IA no aplica: tu app no usa inteligencia artificial. La publicidad se mide aparte en Negocio.</p>
          </Bloque>
          <Bloque titulo="Mes a mes">
            <Tabla
              columnas={['Mes', 'Cobrado', 'Te quedó', 'Margen', 'Tipo']}
              filas={[...meses].reverse().map((x) => [nombreMes(x.mes), dinero(x.ingresos, moneda), dinero(x.ganancia, moneda), porcentaje(x.margen), x.real ? 'Real' : 'Estimación'])}
            />
          </Bloque>
        </>
      )}
    </Pagina>
  );
}
