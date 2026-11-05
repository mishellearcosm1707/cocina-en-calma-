import { Barras, Bloque, Pagina, Rejilla, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import { cargarVentas, monedaPrincipal, ventasPorMes } from '@/lib/admin/datos';
import { dinero, fechaHora, nombreMes, porcentaje } from '@/lib/admin/formato';

const ESTADO: Record<string, string> = { aprobada: 'Vigente', reembolsada: 'Reembolsada', contracargo: 'Contracargo', cancelada: 'Cancelada' };

export default async function Ventas() {
  await exigirAdmin();
  const ventas = await cargarVentas();
  const { moneda, otras } = monedaPrincipal(ventas);
  const meses = moneda ? ventasPorMes(ventas, moneda) : [];
  const propias = ventas.filter((v) => v.moneda === moneda);
  const vigentes = propias.filter((v) => v.estado === 'aprobada');
  const ingresos = vigentes.reduce((s, v) => s + (v.bruto_minor ?? 0), 0);
  const devueltas = propias.filter((v) => v.estado === 'reembolsada' || v.estado === 'contracargo');
  const sinImporte = ventas.filter((v) => v.bruto_minor === null).length;

  return (
    <Pagina titulo="Ventas" bajada="Tu app es de pago único: aquí se mide lo que entra por compra, los reembolsos y los contracargos. (La suscripción mensual y su baja no aplican.)">
      {!ventas.length ? (
        <VacioInfo>Sin datos todavía. Cada compra que Hotmart avise aparecerá aquí con su importe, su comisión y su canal.</VacioInfo>
      ) : (
        <>
          <Rejilla>
            <Tarjeta titulo="Ingresos vigentes" valor={moneda ? dinero(ingresos, moneda) : null} insight="Compras que no se reembolsaron." />
            <Tarjeta titulo="Compras" valor={String(propias.length)} insight={`${vigentes.length} siguen vigentes.`} />
            <Tarjeta
              titulo="Reembolsos y contracargos"
              valor={String(devueltas.length)}
              tono={propias.length >= 5 && devueltas.length / propias.length > 0.1 ? 'alerta' : 'neutro'}
              insight={propias.length ? `${porcentaje(devueltas.length / propias.length, 1)} de las compras.` : undefined}
            />
            <Tarjeta
              titulo="Compras sin importe"
              valor={String(sinImporte)}
              tono={sinImporte ? 'alerta' : 'bien'}
              insight={sinImporte ? 'Hotmart no mandó el importe en esos avisos: no se suman.' : 'Todas traen su importe.'}
            />
          </Rejilla>
          {otras.length > 0 && <VacioInfo>Hay ventas en otras monedas ({otras.join(', ')}). No se suman con {moneda}: no se mezclan monedas.</VacioInfo>}
          <Bloque titulo="Ingresos por mes">
            {moneda && meses.length ? <Barras datos={meses.map((m) => ({ etiqueta: nombreMes(m.mes), valor: m.ingresos }))} formato={(n) => dinero(n, moneda)} /> : <VacioInfo>Sin datos.</VacioInfo>}
          </Bloque>
          <Bloque titulo="Mes a mes">
            <Tabla
              columnas={['Mes', 'Compras', 'Reembolsos', 'Ingresos']}
              filas={[...meses].reverse().map((m) => [nombreMes(m.mes), m.compras, m.reembolsos, dinero(m.ingresos, moneda ?? 'USD')])}
            />
          </Bloque>
          <Bloque titulo="Últimas compras">
            <Tabla
              columnas={['Fecha', 'Correo', 'Importe', 'Canal', 'Estado']}
              filas={ventas.slice(0, 20).map((v) => [fechaHora(v.comprada_en), v.email, dinero(v.bruto_minor, v.moneda ?? 'USD'), v.canal ?? 'sin canal', ESTADO[v.estado]])}
            />
          </Bloque>
        </>
      )}
    </Pagina>
  );
}
