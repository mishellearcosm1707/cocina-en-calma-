-- Registro de consentimientos (solo se agregan filas; retirar un permiso es agregar una fila "otorgado = false").
-- Cada persona ve e inserta solo lo suyo (RLS). Si borra su cuenta, el registro queda SIN su id, solo con una huella
-- (hash) del correo: es la evidencia mínima de que existió el consentimiento, sin datos de contacto.
create table public.consentimientos (
  id bigserial primary key,
  user_id uuid references auth.users (id) on delete set null,
  correo_hash text not null,
  finalidad text not null check (finalidad in ('terminos_privacidad', 'datos_salud', 'novedades', 'analitica')),
  otorgado boolean not null,
  version_texto text not null,
  origen text not null check (origen in ('onboarding', 'ajustes')),
  idioma text not null default 'es',
  creado_en timestamptz not null default now()
);
create index consentimientos_user_idx on public.consentimientos (user_id, finalidad, creado_en desc);
alter table public.consentimientos enable row level security;

create policy "consentimientos: ver los propios" on public.consentimientos
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "consentimientos: registrar los propios" on public.consentimientos
  for insert to authenticated with check ((select auth.uid()) = user_id);
-- Sin políticas de update/delete: el registro no se edita ni se borra desde la app.
