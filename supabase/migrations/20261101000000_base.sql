-- Base de datos de Cocina en Calma (versión 1)
-- Decisiones: el estado de la app de cada persona vive en una sola fila (jsonb) protegida por RLS;
-- las compras llegan desde Hotmart (webhook, con clave de servicio) y la persona solo puede LEER su propio acceso.

-- 1) Estado de la app por persona (perfil, semanas, chequeos, marcas de compras/prep)
create table public.estado_app (
  user_id uuid primary key references auth.users (id) on delete cascade,
  estado jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.estado_app enable row level security;

create policy "estado_app: leer lo propio" on public.estado_app
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "estado_app: crear lo propio" on public.estado_app
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "estado_app: actualizar lo propio" on public.estado_app
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "estado_app: borrar lo propio" on public.estado_app
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 2) Accesos pagados: quién compró (los escribe SOLO el webhook de Hotmart con la clave de servicio)
create table public.accesos (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  estado text not null default 'activo' check (estado in ('activo', 'reembolsado', 'cancelado')),
  transaccion text not null unique,
  comprado_en timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index accesos_email_unico on public.accesos (lower(email));

alter table public.accesos enable row level security;

create policy "accesos: ver el propio" on public.accesos
  for select to authenticated using (lower(email) = lower((select auth.jwt() ->> 'email')));
-- Sin políticas de insert/update/delete: nadie desde la app puede darse acceso a sí mismo.

-- 3) Eventos de Hotmart ya procesados (idempotencia: un aviso repetido no se procesa dos veces)
create table public.eventos_hotmart (
  transaccion text not null,
  evento text not null,
  recibido_en timestamptz not null default now(),
  primary key (transaccion, evento)
);

alter table public.eventos_hotmart enable row level security;
-- Sin políticas: solo la clave de servicio (el webhook) puede leer o escribir.

-- 4) Marca de tiempo automática al actualizar el estado
create function public.tocar_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger estado_app_updated before update on public.estado_app
  for each row execute function public.tocar_updated_at();
create trigger accesos_updated before update on public.accesos
  for each row execute function public.tocar_updated_at();
