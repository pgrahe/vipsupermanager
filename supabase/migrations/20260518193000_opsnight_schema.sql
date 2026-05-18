create extension if not exists pgcrypto;

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  city text,
  timezone text not null default 'Europe/Madrid',
  legal_capacity integer not null default 0,
  is_active boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.venue_user_roles (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_key text not null check (role_key in ('manager', 'barra', 'taquilla', 'guardarropia', 'vip', 'pica', 'office')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (venue_id, user_id, role_key)
);

create table if not exists public.finance_daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  snapshot_date date not null,
  period_key text not null default 'today' check (period_key in ('today', '7d', '30d', 'mtd')),
  net_revenue numeric(12,2) not null default 0,
  gross_revenue numeric(12,2) not null default 0,
  product_cost numeric(12,2) not null default 0,
  staff_cost numeric(12,2) not null default 0,
  fees_cost numeric(12,2) not null default 0,
  other_cost numeric(12,2) not null default 0,
  operating_profit numeric(12,2) not null default 0,
  cash_available numeric(12,2) not null default 0,
  pending_payments numeric(12,2) not null default 0,
  margin_pct numeric(6,2) not null default 0,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, snapshot_date, period_key)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  section_key text not null check (section_key in ('barra', 'taquilla', 'guardarropia', 'vip')),
  sku text not null,
  name text not null,
  category text,
  price numeric(12,2) not null default 0,
  cost numeric(12,2) not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists products_venue_section_sku_idx
on public.products (venue_id, section_key, sku);

create table if not exists public.vip_tables (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  code text not null,
  name text not null,
  zone text,
  capacity integer not null default 0,
  minimum_spend numeric(12,2) not null default 0,
  status text not null default 'available' check (status in ('available', 'reserved', 'occupied', 'blocked', 'closed')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, code)
);

create table if not exists public.vip_reservations (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  vip_table_id uuid references public.vip_tables(id) on delete set null,
  reservation_date date not null,
  client_name text not null,
  guests_count integer not null default 0,
  minimum_spend numeric(12,2) not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capacity_counters (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  code text not null,
  name text not null,
  counter_value integer not null default 0,
  direction_mode text not null default 'bidirectional' check (direction_mode in ('entry', 'exit', 'bidirectional')),
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, code)
);

create table if not exists public.cloakroom_tickets (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  ticket_code text not null,
  status text not null default 'open' check (status in ('open', 'collected', 'cancelled')),
  item_count integer not null default 1,
  amount numeric(12,2) not null default 0,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, ticket_code)
);

create table if not exists public.pos_sales (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  section_key text not null check (section_key in ('barra', 'taquilla', 'guardarropia', 'vip')),
  sale_number text not null,
  sale_status text not null default 'open' check (sale_status in ('open', 'paid', 'voided', 'refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'partial', 'refunded')),
  total_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  customer_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, sale_number)
);

create table if not exists public.pos_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.pos_sales(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_venues_updated_at on public.venues;
create trigger set_venues_updated_at before update on public.venues for each row execute function public.set_updated_at();

drop trigger if exists set_finance_daily_snapshots_updated_at on public.finance_daily_snapshots;
create trigger set_finance_daily_snapshots_updated_at before update on public.finance_daily_snapshots for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();

drop trigger if exists set_vip_tables_updated_at on public.vip_tables;
create trigger set_vip_tables_updated_at before update on public.vip_tables for each row execute function public.set_updated_at();

drop trigger if exists set_vip_reservations_updated_at on public.vip_reservations;
create trigger set_vip_reservations_updated_at before update on public.vip_reservations for each row execute function public.set_updated_at();

drop trigger if exists set_capacity_counters_updated_at on public.capacity_counters;
create trigger set_capacity_counters_updated_at before update on public.capacity_counters for each row execute function public.set_updated_at();

drop trigger if exists set_cloakroom_tickets_updated_at on public.cloakroom_tickets;
create trigger set_cloakroom_tickets_updated_at before update on public.cloakroom_tickets for each row execute function public.set_updated_at();

drop trigger if exists set_pos_sales_updated_at on public.pos_sales;
create trigger set_pos_sales_updated_at before update on public.pos_sales for each row execute function public.set_updated_at();

create or replace function public.has_venue_access(target_venue uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.venue_user_roles vur
    where vur.venue_id = target_venue
      and vur.user_id = auth.uid()
      and vur.is_active = true
  );
$$;

alter table public.venues enable row level security;
alter table public.venue_user_roles enable row level security;
alter table public.finance_daily_snapshots enable row level security;
alter table public.products enable row level security;
alter table public.vip_tables enable row level security;
alter table public.vip_reservations enable row level security;
alter table public.capacity_counters enable row level security;
alter table public.cloakroom_tickets enable row level security;
alter table public.pos_sales enable row level security;
alter table public.pos_sale_items enable row level security;

drop policy if exists "venues public read" on public.venues;
create policy "venues public read"
on public.venues
for select
using (true);

drop policy if exists "venue roles self read" on public.venue_user_roles;
create policy "venue roles self read"
on public.venue_user_roles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "finance read by venue access" on public.finance_daily_snapshots;
create policy "finance read by venue access"
on public.finance_daily_snapshots
for select
to authenticated
using (public.has_venue_access(venue_id));

drop policy if exists "finance public read prototype" on public.finance_daily_snapshots;
create policy "finance public read prototype"
on public.finance_daily_snapshots
for select
using (true);

drop policy if exists "finance write by venue access" on public.finance_daily_snapshots;
create policy "finance write by venue access"
on public.finance_daily_snapshots
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "products read by venue access" on public.products;
create policy "products read by venue access"
on public.products
for select
to authenticated
using (public.has_venue_access(venue_id));

drop policy if exists "products public read prototype" on public.products;
create policy "products public read prototype"
on public.products
for select
using (true);

drop policy if exists "products write by venue access" on public.products;
create policy "products write by venue access"
on public.products
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "vip tables access" on public.vip_tables;
create policy "vip tables access"
on public.vip_tables
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "vip tables public read prototype" on public.vip_tables;
create policy "vip tables public read prototype"
on public.vip_tables
for select
using (true);

drop policy if exists "vip tables public write prototype" on public.vip_tables;
create policy "vip tables public write prototype"
on public.vip_tables
for update
using (true)
with check (true);

drop policy if exists "vip reservations access" on public.vip_reservations;
create policy "vip reservations access"
on public.vip_reservations
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "capacity counters access" on public.capacity_counters;
create policy "capacity counters access"
on public.capacity_counters
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "capacity counters public read prototype" on public.capacity_counters;
create policy "capacity counters public read prototype"
on public.capacity_counters
for select
using (true);

drop policy if exists "capacity counters public write prototype" on public.capacity_counters;
create policy "capacity counters public write prototype"
on public.capacity_counters
for update
using (true)
with check (true);

drop policy if exists "cloakroom tickets access" on public.cloakroom_tickets;
create policy "cloakroom tickets access"
on public.cloakroom_tickets
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "cloakroom tickets public write prototype" on public.cloakroom_tickets;
create policy "cloakroom tickets public write prototype"
on public.cloakroom_tickets
for insert
with check (true);

drop policy if exists "pos sales access" on public.pos_sales;
create policy "pos sales access"
on public.pos_sales
for all
to authenticated
using (public.has_venue_access(venue_id))
with check (public.has_venue_access(venue_id));

drop policy if exists "pos sales public write prototype" on public.pos_sales;
create policy "pos sales public write prototype"
on public.pos_sales
for insert
with check (true);

drop policy if exists "pos sale items access" on public.pos_sale_items;
create policy "pos sale items access"
on public.pos_sale_items
for all
to authenticated
using (
  exists (
    select 1
    from public.pos_sales ps
    where ps.id = sale_id
      and public.has_venue_access(ps.venue_id)
  )
)
with check (
  exists (
    select 1
    from public.pos_sales ps
    where ps.id = sale_id
      and public.has_venue_access(ps.venue_id)
  )
);

drop policy if exists "pos sale items public write prototype" on public.pos_sale_items;
create policy "pos sale items public write prototype"
on public.pos_sale_items
for insert
with check (true);

insert into public.venues (slug, name, city, timezone, legal_capacity)
values ('kapital-madrid', 'Kapital Madrid', 'Madrid', 'Europe/Madrid', 2100)
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  timezone = excluded.timezone,
  legal_capacity = excluded.legal_capacity;
