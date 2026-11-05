import { Bloque, Pagina, Rejilla, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import { cargarGastos, cargarVentas, monedaPrincipal, porCanal } from '@/lib/admin/datos';
import { dinero } from '@/lib/admin/formato';

export default async function Negocio() {
  await exigirAdmin();
  const [ventas, gastos] = await Promise.all([cargarVentas(), cargarGastos()]);
  const { moneda } = monedaPrincipal(ventas);
  const canales = moneda ? porCanal(ventas, gastos, moneda) : [];
  const compras = canales.reduce((s, c) => s + c.compras, 0);
  const neto = canales.reduce((s, c) => s + c.neto, 0);
  const gastoTotal = moneda ? gastos.filter((g) => g.moneda === moneda).reduce((s, g) => s + g.monto_minor, 0) : 0;
  const ltv = moneda && compras ? neto / compras : null;
  const cac = moneda && gastoTotal > 0 && compras ? gastoTotal / compras : null;
  const ratio = ltv !== null && cac ? ltv / cac : null;
  const textoRatio =
    ratio === null || !moneda || ltv === null || cac === null
      ? 'Aparece cuando haya compras y registres lo que gastaste en anuncios (Ajustes).'
      : `Por cada $1 que gastas en conseguir una clienta, recuperas $${ratio.toFixed(2)}. ${ratio >= 3 ? 'Es sano.' : ratio >= 1 ? 'Recuperas el gasto, pero por debajo del 3 a 1 sano.' : 'Estás perdiendo dinero por cada clienta.'}`;

  return (
    <Pagina titulo="Negocio" bajada="¿Ganas o pierdes dinero al conseguir clientas? Con tu pago único, cada clienta vale lo que te deja su compra.">
      <Rejilla>
        <Tarjeta titulo="Valor de una clienta (LTV)" valor={ltv !== null && moneda ? dinero(ltv, moneda) : null} insight="Lo que te queda de su compra después de Hotmart y afiliados. No hay recompra porque es pago único." />
        <Tarjeta titulo="Costo de conseguirla (CAC)" valor={cac !== null && moneda ? dinero(cac, moneda) : null} insight="Lo gastado en anuncios y afiliados dividido entre las compras." />
        <Tarjeta titulo="Relación LTV : CAC" valor={ratio === null ? null : `${ratio.toFixed(1)} a 1`} tono={ratio === null ? 'neutro' : ratio >= 3 ? 'bien' : ratio >= 1 ? 'neutro' : 'alerta'} insight={textoRatio} />
        <Tarjeta
          titulo="Se recupera con…"
          valor={ratio === null ? null : ratio >= 1 ? 'su primera compra' : 'no se recupera'}
          insight="Con pago único no hay meses de recuperación: o la compra cubre el gasto, o no."
        />
      </Rejilla>

      <Bloque titulo="Por canal">
        {!canales.length || !moneda ? (
          <VacioInfo>Sin datos todavía. Aparece con las primeras compras. Cada canal sale del parámetro <b>src</b> del enlace de Hotmart.</VacioInfo>
        ) : (
          <Tabla
            columnas={['Canal', 'Compras', 'Te queda por clienta', 'Gastaste', 'Costo por clienta', 'LTV : CAC']}
            filas={canales.map((c) => [
              c.canal,
              c.compras,
              dinero(c.ltv === null ? null : Math.round(c.ltv), moneda),
              dinero(c.gasto, moneda),
              dinero(c.cac === null ? null : Math.round(c.cac), moneda),
              c.ratio === null ? 'Sin datos' : `${c.ratio.toFixed(1)} a 1`,
            ])}
          />
        )}
      </Bloque>

      <Bloque titulo="Cómo medir cada canal">
        <p className="text-base text-[var(--text-secondary)]">
          Al enlace de pago de Hotmart agrégale al final <b>?src=nombre_del_canal</b> (por ejemplo <b>?src=ads_meta</b> o <b>?src=instagram</b>). Hotmart devuelve ese nombre en cada compra y el panel lo usa. Las compras sin esa marca salen como &quot;sin canal&quot;. El gasto de cada canal lo registras en Ajustes con el mismo nombre.
        </p>
      </Bloque>

      <Bloque titulo="Costo de IA">
        <VacioInfo>No aplica: tu app hoy no usa inteligencia artificial, así que no hay costo que medir.</VacioInfo>
      </Bloque>
    </Pagina>
  );
}
