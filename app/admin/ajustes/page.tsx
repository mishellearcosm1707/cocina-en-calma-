import { borrarGasto } from '@/app/admin/acciones';
import { Bloque, Pagina, Tabla, VacioInfo } from '@/components/admin/ui';
import { FormCostos, FormGasto } from '@/components/admin/Formularios';
import { exigirAdmin } from '@/lib/admin/acceso';
import { cargarAuditoria, cargarCostos, cargarGastos } from '@/lib/admin/datos';
import { dinero, fechaHora } from '@/lib/admin/formato';

const ACCION: Record<string, string> = {
  agregar_acceso_manual: 'Dio acceso a mano',
  reactivar_acceso_manual: 'Reactivó un acceso a mano',
  cambiar_estado_acceso: 'Cambió el estado de un acceso',
  generar_enlace_acceso: 'Creó un enlace de entrada',
  guardar_costos: 'Guardó costos',
  agregar_gasto: 'Registró un gasto',
  borrar_gasto: 'Borró un gasto',
};

export default async function Ajustes() {
  await exigirAdmin();
  const [costos, gastos, auditoria] = await Promise.all([cargarCostos(), cargarGastos(), cargarAuditoria()]);

  return (
    <Pagina titulo="Ajustes" bajada="Aquí registras lo que el panel no puede saber solo: tus costos y lo que gastas en anuncios.">
      <Bloque titulo="Costos">
        <p className="mb-3 text-base text-[var(--text-secondary)]">Con esto la ganancia deja de ser estimación y pasa a ser real. Consulta con tu contadora el porcentaje de impuestos que te corresponde.</p>
        <FormCostos actual={costos} />
      </Bloque>

      <Bloque titulo="Gasto en conseguir clientas">
        <FormGasto />
        <div className="mt-4">
          {gastos.length ? (
            <Tabla
              columnas={['Canal', 'Monto', 'Periodo', 'Nota', '']}
              filas={gastos.map((g) => [
                g.canal,
                dinero(g.monto_minor, g.moneda),
                `${g.desde} → ${g.hasta}`,
                g.nota ?? '',
                <form key={g.id} action={borrarGasto}>
                  <input type="hidden" name="id" value={g.id} />
                  <button type="submit" className="min-h-11 text-sm font-semibold text-[var(--error)] underline underline-offset-4">
                    Borrar
                  </button>
                </form>,
              ])}
            />
          ) : (
            <VacioInfo>Todavía no registraste gastos.</VacioInfo>
          )}
        </div>
      </Bloque>

      <Bloque titulo="Lo último que hiciste a mano">
        {auditoria.length ? (
          <Tabla columnas={['Cuándo', 'Qué', 'A quién']} filas={auditoria.map((a) => [fechaHora(a.creado_en), ACCION[a.accion] ?? a.accion, a.objetivo ?? ''])} />
        ) : (
          <VacioInfo>Sin acciones registradas.</VacioInfo>
        )}
      </Bloque>
    </Pagina>
  );
}
