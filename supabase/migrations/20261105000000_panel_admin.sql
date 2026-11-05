-- Panel de administración (solo la dueña). Todas las tablas nuevas tienen RLS activado y SIN políticas para
-- usuarias normales: solo el servidor (clave secreta) las lee o escribe, después de verificar que quien pide es admin.

-- 1) Quién es admin (cada persona solo puede ver si ella misma figura; nadie puede escribir desde la app)
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);
alter table public.admins enable row level security;
create policy "admins: ver la propia fila" on public.admins
  for select to authenticated using ((select auth.uid()) = user_id);

-- 2) Accesos: nombre y de dónde vino (Hotmart o agregado a mano)
alter table public.accesos add column nombre text;
alter table public.accesos add column origen text not null default 'hotmart' check (origen in ('hotmart', 'manual'));

-- 3) Ventas: una fila por compra, con importes en unidad menor (centavos) y moneda. NULL = Hotmart no lo informó.
create table public.ventas (
  id uuid primary key default gen_random_uuid(),
  transaccion text not null unique,
  email text not null,
  producto_id text,
  moneda text,
  bruto_minor bigint,
  fee_hotmart_minor bigint,
  afiliado_minor bigint,
  neto_productor_minor bigint,
  canal text,
  estado text not null default 'aprobada' check (estado in ('aprobada', 'reembolsada', 'contracargo', 'cancelada')),
  comprada_en timestamptz not null default now(),
  cerrada_en timestamptz,
  creado_en timestamptz not null default now()
);
create index ventas_comprada_idx on public.ventas (comprada_en desc);
create index ventas_canal_idx on public.ventas (canal);
alter table public.ventas enable row level security;

-- 4) Eventos de uso (anónimos: sin correo ni respuestas de salud) y errores
create table public.event_log (
  id bigserial primary key,
  evento text not null,
  user_id uuid references auth.users (id) on delete set null,
  sesion text,
  props jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);
create index event_log_evento_idx on public.event_log (evento, creado_en desc);
create index event_log_user_idx on public.event_log (user_id, creado_en);
alter table public.event_log enable row level security;

create table public.error_log (
  id bigserial primary key,
  mensaje text not null,
  pantalla text,
  user_id uuid references auth.users (id) on delete set null,
  creado_en timestamptz not null default now()
);
create index error_log_creado_idx on public.error_log (creado_en desc);
alter table public.error_log enable row level security;

-- 5) Intentos del aviso de Hotmart (para ver si está fallando)
create table public.webhook_log (
  id bigserial primary key,
  resultado text not null check (resultado in ('aplicado', 'duplicado', 'ignorado', 'no_autorizado', 'error')),
  evento text,
  creado_en timestamptz not null default now()
);
create index webhook_log_creado_idx on public.webhook_log (creado_en desc);
alter table public.webhook_log enable row level security;

-- 6) Costos que registra la dueña a mano
create table public.costos_config (
  clave text primary key check (clave in ('impuesto_pct', 'infra_mensual', 'email_mensual')),
  valor numeric not null check (valor >= 0),
  moneda text not null default 'USD',
  nota text,
  actualizado_en timestamptz not null default now()
);
alter table public.costos_config enable row level security;

create table public.gasto_adquisicion (
  id uuid primary key default gen_random_uuid(),
  canal text not null,
  monto_minor bigint not null check (monto_minor >= 0),
  moneda text not null default 'USD',
  desde date not null,
  hasta date not null check (hasta >= desde),
  nota text,
  creado_en timestamptz not null default now()
);
alter table public.gasto_adquisicion enable row level security;

-- 7) Auditoría de lo que hace la admin a mano
create table public.admin_log (
  id bigserial primary key,
  admin_id uuid not null references auth.users (id) on delete cascade,
  accion text not null,
  objetivo text,
  detalle jsonb not null default '{}'::jsonb,
  creado_en timestamptz not null default now()
);
alter table public.admin_log enable row level security;
