-- Migracion 0001: esquema inicial ReciclaYa. Aplicar con `supabase db push` o en Supabase > SQL Editor.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('vecino','recolector','operador','admin')),
  suspendido boolean default false,
  creado_en timestamptz default now()
);
create table puntos_acopio (
  id uuid primary key default gen_random_uuid(),
  operador_id uuid not null unique references profiles(id),      -- 1 punto por operador
  nombre text not null, distrito text not null, direccion text not null,
  dias smallint[] not null check (array_length(dias, 1) > 0),     -- 0=Dom..6=Sab
  abre time not null, cierra time not null check (abre < cierra),
  suspendido boolean default false
);
create table materiales (
  id uuid primary key default gen_random_uuid(),
  punto_id uuid not null references puntos_acopio(id) on delete cascade,
  nombre text not null, descripcion text,
  pago_kg numeric(6,2) not null check (pago_kg > 0),
  capacidad_kg int not null default 0 check (capacidad_kg >= 0)
);
create table solicitudes (
  id uuid primary key default gen_random_uuid(),
  vecino_id uuid not null references profiles(id),
  material_id uuid not null references materiales(id),
  recolector_id uuid references profiles(id),
  kg int not null check (kg > 0),
  pago_kg numeric(6,2) not null,
  direccion_recojo text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aceptado','entregado','rechazado')),
  creado_en timestamptz default now()
);
-- Seguridad: Row Level Security (cada rol solo ve/modifica lo suyo)
alter table profiles enable row level security;
alter table puntos_acopio enable row level security;
alter table materiales enable row level security;
alter table solicitudes enable row level security;
create policy "puntos visibles" on puntos_acopio for select using (not suspendido);
create policy "materiales visibles" on materiales for select using (true);
create policy "operador gestiona su punto" on puntos_acopio for all using (operador_id = auth.uid());
create policy "operador gestiona sus materiales" on materiales for all using (punto_id in (select id from puntos_acopio where operador_id = auth.uid()));
create policy "vecino ve sus solicitudes" on solicitudes for select using (vecino_id = auth.uid());
create policy "vecino crea solicitudes" on solicitudes for insert with check (vecino_id = auth.uid());
create policy "recolector ve pendientes y las suyas" on solicitudes for select using (
  (estado = 'pendiente' and recolector_id is null and exists (select 1 from profiles where id = auth.uid() and rol = 'recolector'))
  or recolector_id = auth.uid());
create policy "recolector toma o entrega" on solicitudes for update using (
  exists (select 1 from profiles where id = auth.uid() and rol = 'recolector') and (recolector_id is null or recolector_id = auth.uid()));
create policy "operador ve solicitudes de su punto" on solicitudes for select using (
  material_id in (select m.id from materiales m join puntos_acopio p on p.id = m.punto_id where p.operador_id = auth.uid()));
