import { Avisos, Barras, Bloque, Pagina, Rejilla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { exigirAdmin } from '@/lib/admin/acceso';
import {
  calcularAvisos,
  calcularSalud,
  calcularUso,
  cargarAccesos,
  cargarCostos,
  cargarGastos,
  cargarVentas,
  gananciaPorMes,
  monedaPrincipal,
  porCanal,
  ventasPorMes,
} from '@/lib/admin/datos';
import { dinero, haceCuanto, mesDe, nombreMes, porcentaje } from '@/lib/admin/formato';

export default async function Resumen() {
  await exigirAdmin();
  const [ventas, costos, gastos, salud, uso, accesos] = await Promise.all([
    cargarVentas(),
    cargarCostos(),
    cargarGastos(),
    calcularSalud(),
    calcularUso(),
    cargarAccesos(),
  ]);
  const { moneda } = monedaPrincipal(ventas);
  const ganancias = moneda ? gananciaPorMes(ventas, moneda, costos) : [];
  const canales = moneda ? porCanal(ventas, gastos, moneda) : [];
  const avisos = calcularAvisos({ ventas, moneda, ganancias, canales, salud, costos });
  const mesActual = mesDe(new Date().toISOString());
  const delMes = ganancias.find((g) => g.mes === mesActual);
  const mesesVentas = moneda ? ventasPorMes(ventas, moneda) : [];
  const comprasMes = mesesVentas.find((m) => m.mes === mesActual)?.compras ?? 0;
  const activos = accesos.filter((a) => a.estado === 'activo').length;

  return (
    <Pagina titulo="Resumen" bajada="Lo importante de tu negocio de un vistazo.">
      <Avisos avisos={avisos} />

      <Rejilla>
        <Tarjeta
          titulo="Ingresos de este mes"
          valor={moneda ? dinero(delMes?.ingresos ?? 0, moneda) : null}
          insight={moneda ? `${comprasMes} compra${comprasMes === 1 ? '' : 's'} este mes.` : 'Aparece con la primera compra que avise Hotmart.'}
        />
        <Tarjeta
          titulo={delMes && !delMes.real ? 'Ganancia del mes (estimación)' : 'Ganancia del mes'}
          valor={moneda && delMes?.ganancia != null ? dinero(delMes.ganancia, moneda) : null}
          tono={delMes?.ganancia != null ? (delMes.ganancia > 0 ? 'bien' : 'alerta') : 'neutro'}
          insight={
            moneda && delMes?.ganancia != null
              ? `Facturaste ${dinero(delMes.ingresos, moneda)} y te quedaron ${dinero(delMes.ganancia, moneda)} limpios (${porcentaje(delMes.margen)}).`
              : 'Aparece cuando haya ventas este mes.'
          }
        />
        <Tarjeta
          titulo="Personas con acceso"
          valor={accesos.length ? String(activos) : null}
          insight={accesos.length ? `${accesos.length} cuenta${accesos.length === 1 ? '' : 's'} en total (activas, reembolsadas y canceladas).` : 'Aparece con la primera compra o al agregar a alguien.'}
        />
        <Tarjeta
          titulo="Último aviso de Hotmart"
          valor={salud.ultimoAviso ? haceCuanto(salud.ultimoAviso) : null}
          tono={(salud.avisos24h['error'] ?? 0) + (salud.avisos24h['no_autorizado'] ?? 0) > 0 ? 'alerta' : 'neutro'}
          insight={salud.ultimoAviso ? 'Hotmart avisa de cada compra o reembolso.' : 'Hotmart todavía no ha enviado ningún aviso.'}
        />
      </Rejilla>

      <Rejilla>
        <Tarjeta
          titulo="Activas en 7 días"
          valor={uso.conEventos ? String(uso.activos7) : null}
          insight={uso.conEventos ? `${uso.activos30} en 30 días.` : 'Aparece cuando las usuarias empiecen a entrar.'}
        />
        <Tarjeta
          titulo="Se activan el primer día"
          valor={uso.activacion.pct === null ? null : porcentaje(uso.activacion.pct)}
          insight={uso.activacion.n ? `De ${uso.activacion.n} persona${uso.activacion.n === 1 ? '' : 's'} que entraron, esa parte hizo algo de valor el mismo día.` : 'Aparece con las primeras entradas.'}
        />
        <Tarjeta
          titulo="Vuelven al día siguiente"
          valor={uso.retencion.d1.pct === null ? null : porcentaje(uso.retencion.d1.pct)}
          insight={uso.retencion.d1.n ? `Sobre ${uso.retencion.d1.n} persona${uso.retencion.d1.n === 1 ? '' : 's'}.` : 'Aparece cuando haya personas con más de 1 día.'}
        />
        <Tarjeta titulo="Errores en 24 horas" valor={String(salud.errores24h)} tono={salud.errores24h >= 5 ? 'alerta' : 'bien'} insight={salud.errores24h === 0 ? 'Ninguno: bien.' : 'Mira el detalle en Salud.'} />
      </Rejilla>

      <Bloque titulo="Ingresos por mes">
        {mesesVentas.length && moneda ? (
          <Barras datos={mesesVentas.map((m) => ({ etiqueta: nombreMes(m.mes), valor: m.ingresos }))} formato={(n) => dinero(n, moneda)} />
        ) : (
          <VacioInfo>Sin datos todavía. El gráfico aparece con la primera compra.</VacioInfo>
        )}
      </Bloque>
    </Pagina>
  );
}
