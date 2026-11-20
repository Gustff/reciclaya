-- Migracion inicial (supabase/migrations/0001_init.sql). Ejecutar en Supabase > SQL Editor.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('comprador','vendedor','admin')),
  suspendido boolean default false,
  creado_en timestamptz default now()
);
create table stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references profiles(id),   -- 1 tienda por vendedor
  nombre text not null, rubro text not null, direccion text,
  suspendida boolean default false
);
create table products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  nombre text not null, descripcion text,
  precio numeric(10,2) not null check (precio > 0),
  stock int not null default 0 check (stock >= 0),
  imagen_url text
);
create table orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references profiles(id),
  product_id uuid not null references products(id),
  cantidad int not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','aceptado','rechazado','entregado')),
  fecha timestamptz default now()
);
alter table profiles enable row level security;
alter table stores enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
create policy "lectura publica tiendas" on stores for select using (not suspendida);
create policy "lectura publica productos" on products for select using (true);
create policy "vendedor gestiona su tienda" on stores for all using (owner_id = auth.uid());
create policy "vendedor gestiona sus productos" on products for all using (store_id in (select id from stores where owner_id = auth.uid()));
create policy "comprador ve sus pedidos" on orders for select using (buyer_id = auth.uid());
create policy "comprador crea pedidos" on orders for insert with check (buyer_id = auth.uid());
