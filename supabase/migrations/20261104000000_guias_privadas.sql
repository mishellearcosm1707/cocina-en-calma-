-- Guías en PDF: bucket PRIVADO (nada es público). Solo quien tiene un acceso activo puede pedir el enlace temporal.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guias', 'guias', false, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "guias: solo con acceso activo" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'guias'
    and exists (
      select 1 from public.accesos a
      where lower(a.email) = lower((select auth.jwt() ->> 'email')) and a.estado = 'activo'
    )
  );
-- Sin políticas de insert/update/delete: los archivos solo se suben desde el panel o con la clave de servicio.
