import { cambiarEstado } from '@/app/admin/acciones';
import { Bloque, Pagina, Rejilla, Tabla, Tarjeta, VacioInfo } from '@/components/admin/ui';
import { FormAgregarUsuario, FormEnlace } from '@/components/admin/Formularios';
import { exigirAdmin } from '@/lib/admin/acceso';
import { cargarAccesos, cargarCuentas, cuentasNuevas } from '@/lib/admin/datos';
import { fechaHora, haceCuanto } from '@/lib/admin/formato';

const ESTADO: Record<string, string> = { activo: 'Activo', reembolsado: 'Reembolsado', cancelado: 'Cancelado' };

export default async function Usuarias({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await exigirAdmin();
  const { q = '' } = await searchParams;
  const busca = q.trim().toLowerCase().slice(0, 80);
  const [accesos, cuentas] = await Promise.all([cargarAccesos(), cargarCuentas()]);
  const entrada = new Map(cuentas.map((c) => [c.email.toLowerCase(), c.ultimaEntrada]));
  const lista = accesos.filter((a) => !busca || a.email.toLowerCase().includes(busca) || (a.nombre ?? '').toLowerCase().includes(busca));
  const nuevas30 = cuentasNuevas(cuentas, 30);

  return (
    <Pagina titulo="Usuarias" bajada="Quién tiene acceso, y cómo darlo a mano si a alguien no le llegó.">
      <Rejilla>
        <Tarjeta titulo="Cuentas creadas" valor={cuentas.length ? String(cuentas.length) : null} insight={cuentas.length ? `${nuevas30} en los últimos 30 días.` : 'Aparece cuando alguien pida su primer enlace.'} />
        <Tarjeta titulo="Con acceso activo" valor={accesos.length ? String(accesos.filter((a) => a.estado === 'activo').length) : null} />
        <Tarjeta titulo="Agregadas a mano" valor={accesos.length ? String(accesos.filter((a) => a.origen === 'manual').length) : null} />
        <Tarjeta titulo="Reembolsadas o canceladas" valor={accesos.length ? String(accesos.filter((a) => a.estado !== 'activo').length) : null} />
      </Rejilla>

      <Bloque titulo="Dar acceso a mano">
        <p className="mb-3 text-base text-[var(--text-secondary)]">Para agregar a alguien con solo su correo y nombre. Después esa persona pide su enlace en la pantalla de acceso, o puedes crearle uno abajo.</p>
        <FormAgregarUsuario />
      </Bloque>

      <Bloque titulo="Lista">
        <form method="get" className="mb-3 flex gap-2">
          <label htmlFor="q" className="sr-only">
            Buscar por correo o nombre
          </label>
          <input
            id="q"
            name="q"
            defaultValue={busca}
            placeholder="Buscar por correo o nombre"
            className="h-12 min-w-0 flex-1 rounded-[var(--radius-button)] border border-[var(--surface-2)] bg-[var(--bg)] px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          />
          <button type="submit" className="min-h-12 rounded-[var(--radius-button)] border border-[var(--accent)] px-4 text-base font-bold text-[var(--accent)]">
            Buscar
          </button>
        </form>
        {!accesos.length ? (
          <VacioInfo>Sin datos todavía. Aquí aparecen las compradoras y las personas que agregues a mano.</VacioInfo>
        ) : !lista.length ? (
          <VacioInfo>Nadie coincide con esa búsqueda.</VacioInfo>
        ) : (
          <Tabla
            columnas={['Persona', 'Estado', 'Desde', 'Última entrada', 'Acciones']}
            filas={lista.map((a) => [
              <div key="p">
                <b>{a.nombre || 'Sin nombre'}</b>
                <div className="text-sm text-[var(--text-secondary)]">{a.email}</div>
                <div className="text-sm text-[var(--text-secondary)]">{a.origen === 'manual' ? 'Agregada a mano' : 'Compra en Hotmart'}</div>
              </div>,
              ESTADO[a.estado],
              fechaHora(a.comprado_en),
              haceCuanto(entrada.get(a.email.toLowerCase())),
              <div key="a" className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-2">
                  {(['activo', 'cancelado', 'reembolsado'] as const)
                    .filter((e) => e !== a.estado)
                    .map((e) => (
                      <form key={e} action={cambiarEstado}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="estado" value={e} />
                        <button type="submit" className="min-h-11 rounded-[var(--radius-button)] border border-[var(--surface-2)] px-3 text-sm font-semibold">
                          {e === 'activo' ? 'Activar' : e === 'cancelado' ? 'Quitar acceso' : 'Marcar reembolsado'}
                        </button>
                      </form>
                    ))}
                </div>
                {a.estado === 'activo' && <FormEnlace email={a.email} />}
              </div>,
            ])}
          />
        )}
      </Bloque>
    </Pagina>
  );
}
