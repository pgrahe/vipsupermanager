-- OPSNIGHT MVP seed
-- Run this after schema.sql in the Supabase SQL editor.

with venue as (
  select id
  from public.venues
  where slug = 'kapital-madrid'
)
insert into public.products (
  venue_id,
  section_key,
  sku,
  name,
  category,
  price,
  cost,
  sort_order,
  metadata
)
select
  venue.id,
  seed.section_key,
  seed.sku,
  seed.name,
  seed.category,
  seed.price,
  seed.cost,
  seed.sort_order,
  seed.metadata::jsonb
from venue
cross join (
  values
    ('taquilla', 'ticket-comp-godo', 'Compromiso GODÓ', 'Entradas', 0.00, 0.00, 10, '{"tag":"Compromiso","tone":"amber","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-rrpp', 'Compromiso vía RRPP', 'Entradas', 0.00, 0.00, 20, '{"tag":"RRPP","tone":"violet","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-img-chica', 'Imagen chica', 'Entradas', 0.00, 0.00, 30, '{"tag":"Imagen chica","tone":"pink","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-inv-chico', 'Invitación chico', 'Entradas', 0.00, 0.00, 40, '{"tag":"Invitación chico","tone":"cyan","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-compromiso-5', 'Compromiso', 'Entradas', 5.00, 0.00, 50, '{"tag":"Compromiso","tone":"amber","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-10', 'Entrada 10€', 'Entradas', 10.00, 0.00, 60, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-15', 'Entrada 15€', 'Entradas', 15.00, 0.00, 70, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-20', 'Entrada 20€', 'Entradas', 20.00, 0.00, 80, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-25', 'Entrada 25€', 'Entradas', 25.00, 0.00, 90, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-30', 'Entrada 30€', 'Entradas', 30.00, 0.00, 100, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-40', 'Entrada 40€', 'Entradas', 40.00, 0.00, 110, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('taquilla', 'ticket-entrada-50', 'Entrada 50€', 'Entradas', 50.00, 0.00, 120, '{"tag":"Entrada","tone":"green","icon":"confirmation_number"}'),
    ('barra', 'drink-ron-cola', 'Ron Cola', 'Ron', 12.00, 2.40, 10, '{"tag":"Combinado","tone":"green","icon":"liquor"}'),
    ('barra', 'drink-vodka-rb', 'Vodka Red Bull', 'Vodka', 15.00, 3.60, 20, '{"tag":"Premium","tone":"cyan","icon":"liquor"}'),
    ('barra', 'drink-gin-tonic', 'Gin Tonic', 'Ginebra', 14.00, 3.10, 30, '{"tag":"Copa","tone":"violet","icon":"wine_bar"}'),
    ('barra', 'drink-jb-cola', 'JB Cola', 'Whisky', 12.00, 2.30, 40, '{"tag":"Whisky","tone":"amber","icon":"liquor"}'),
    ('barra', 'drink-barcelo-cola', 'Barceló Cola', 'Ron', 13.00, 2.70, 50, '{"tag":"Ron","tone":"green","icon":"liquor"}'),
    ('barra', 'bottle-moet', 'Moët Brut', 'Champagne', 220.00, 92.00, 60, '{"tag":"Botella","tone":"amber","icon":"liquor"}'),
    ('barra', 'bottle-grey-goose', 'Grey Goose VIP', 'Vodka', 260.00, 108.00, 70, '{"tag":"Botella","tone":"violet","icon":"liquor"}'),
    ('barra', 'soft-redbull', 'Red Bull', 'Refrescos', 6.00, 1.45, 80, '{"tag":"Refresco","tone":"cyan","icon":"bolt"}'),
    ('barra', 'soft-cocacola', 'Coca-Cola', 'Refrescos', 5.00, 1.10, 90, '{"tag":"Refresco","tone":"cyan","icon":"bolt"}'),
    ('barra', 'soft-agua', 'Agua', 'Agua', 5.00, 0.55, 100, '{"tag":"Soft","tone":"slate","icon":"water_drop"}'),
    ('barra', 'soft-zumo-pina', 'Zumo Piña', 'Zumos', 6.00, 1.20, 110, '{"tag":"Zumo","tone":"amber","icon":"water_drop"}'),
    ('barra', 'shot-tequila', 'Tequila Shot', 'Tequila', 8.00, 1.60, 120, '{"tag":"Shot","tone":"green","icon":"liquor"}'),
    ('barra', 'fun-shisha-love66', 'Shisha Love 66', 'Snack & Fun', 45.00, 11.00, 130, '{"tag":"Shisha","tone":"pink","icon":"air"}'),
    ('guardarropia', 'cloak-ticket-standard', 'Ticket guardarropía', 'Guardarropía', 3.00, 0.10, 10, '{"tag":"Ticket","tone":"slate","icon":"checkroom"}'),
    ('guardarropia', 'cloak-ticket-fastlane', 'Fast lane guardarropía', 'Guardarropía', 5.00, 0.10, 20, '{"tag":"Fast lane","tone":"amber","icon":"checkroom"}'),
    ('guardarropia', 'cloak-ticket-vip', 'Guardarropía VIP', 'Guardarropía', 8.00, 0.10, 30, '{"tag":"VIP","tone":"violet","icon":"checkroom"}'),
    ('vip', 'vip-table-min-v1v4', 'Mínimo mesa V1-V4', 'Mesas VIP', 1500.00, 520.00, 10, '{"tag":"Minimo","tone":"violet","icon":"table_restaurant"}'),
    ('vip', 'vip-table-min-v5v10', 'Mínimo mesa V5-V10', 'Mesas VIP', 1000.00, 360.00, 20, '{"tag":"Minimo","tone":"violet","icon":"table_restaurant"}'),
    ('vip', 'vip-pack-champagne', 'Pack champagne premium', 'Botellas VIP', 600.00, 240.00, 30, '{"tag":"Pack","tone":"amber","icon":"liquor"}'),
    ('vip', 'vip-pack-vodka', 'Pack vodka premium', 'Botellas VIP', 520.00, 205.00, 40, '{"tag":"Pack","tone":"cyan","icon":"liquor"}')
) as seed(section_key, sku, name, category, price, cost, sort_order, metadata)
on conflict (venue_id, section_key, sku) do update
set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  cost = excluded.cost,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  is_active = true,
  updated_at = now();

with venue as (
  select id
  from public.venues
  where slug = 'kapital-madrid'
)
insert into public.vip_tables (
  venue_id,
  code,
  name,
  zone,
  capacity,
  minimum_spend,
  status,
  sort_order,
  metadata
)
select
  venue.id,
  seed.code,
  seed.name,
  seed.zone,
  seed.capacity,
  seed.minimum_spend,
  seed.status,
  seed.sort_order,
  seed.metadata::jsonb
from venue
cross join (
  values
    ('V1', 'VIP V1', 'Main room front', 6, 1800.00, 'available', 10, '{"group":"V1-V4","operator":"Elena M.","mix":"Botellas 72% · upgrades 18% · fees 10%"}'),
    ('V2', 'VIP V2', 'Main room front', 6, 1800.00, 'reserved', 20, '{"group":"V1-V4","operator":"Elena M.","mix":"Botellas 72% · upgrades 18% · fees 10%"}'),
    ('V3', 'VIP V3', 'Main room bridge', 8, 1500.00, 'available', 30, '{"group":"V1-V4","operator":"Elena M.","mix":"Botellas 72% · upgrades 18% · fees 10%"}'),
    ('V4', 'VIP V4', 'Main room bridge', 8, 1500.00, 'occupied', 40, '{"group":"V1-V4","operator":"Elena M.","mix":"Botellas 72% · upgrades 18% · fees 10%"}'),
    ('V5', 'VIP V5', 'Terraza backstage', 6, 1200.00, 'available', 50, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}'),
    ('V6', 'VIP V6', 'Terraza backstage', 6, 1200.00, 'reserved', 60, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}'),
    ('V7', 'VIP V7', 'Terraza backstage', 8, 1000.00, 'available', 70, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}'),
    ('V8', 'VIP V8', 'Terraza backstage', 8, 1000.00, 'available', 80, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}'),
    ('V9', 'VIP V9', 'Backstage', 10, 900.00, 'blocked', 90, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}'),
    ('V10', 'VIP V10', 'Backstage', 10, 900.00, 'available', 100, '{"group":"V5-V10","operator":"Juan G.","mix":"Botellas 63% · mínimos 24% · extras 13%"}')
) as seed(code, name, zone, capacity, minimum_spend, status, sort_order, metadata)
on conflict (venue_id, code) do update
set
  name = excluded.name,
  zone = excluded.zone,
  capacity = excluded.capacity,
  minimum_spend = excluded.minimum_spend,
  status = excluded.status,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = now();

with venue as (
  select id
  from public.venues
  where slug = 'kapital-madrid'
),
tables_ref as (
  select id, code, venue_id, minimum_spend, capacity
  from public.vip_tables
  where venue_id = (select id from venue)
    and code in ('V2', 'V4', 'V6')
)
insert into public.vip_reservations (
  venue_id,
  vip_table_id,
  reservation_date,
  client_name,
  guests_count,
  minimum_spend,
  deposit_amount,
  status,
  notes
)
select
  tables_ref.venue_id,
  tables_ref.id,
  date '2026-05-18',
  seed.client_name,
  tables_ref.capacity,
  tables_ref.minimum_spend,
  seed.deposit_amount,
  seed.status,
  seed.notes
from tables_ref
join (
  values
    ('V2', 'Reserva Ortega', 600.00, 'confirmed', 'RRPP premium · llegada 01:15'),
    ('V4', 'Mesa Castella', 900.00, 'seated', 'Cliente recurrente · botella extra solicitada'),
    ('V6', 'Grupo Skyline', 400.00, 'confirmed', 'Pendiente llegada backstage')
) as seed(code, client_name, deposit_amount, status, notes)
  on seed.code = tables_ref.code
where not exists (
  select 1
  from public.vip_reservations existing
  where existing.venue_id = tables_ref.venue_id
    and existing.vip_table_id = tables_ref.id
    and existing.reservation_date = date '2026-05-18'
    and existing.client_name = seed.client_name
);

with venue as (
  select id
  from public.venues
  where slug = 'kapital-madrid'
)
insert into public.capacity_counters (
  venue_id,
  code,
  name,
  counter_value,
  direction_mode,
  sort_order,
  metadata
)
select
  venue.id,
  seed.code,
  seed.name,
  seed.counter_value,
  seed.direction_mode,
  seed.sort_order,
  seed.metadata::jsonb
from venue
cross join (
  values
    ('E1', 'Entrada principal', 0, 'bidirectional', 10, '{"label":"E1","subtitle":"Picado general","device":"iPhone Scanner 02","operator":"Nuria P.","x":10,"y":16}'),
    ('E2', 'Entrada VIP', 0, 'bidirectional', 20, '{"label":"E2","subtitle":"Invitados y mesas","device":"iPhone Scanner VIP 01","operator":"Raúl C.","x":82,"y":14}'),
    ('E3', 'Guest list / RRPP', 0, 'bidirectional', 30, '{"label":"E3","subtitle":"Pulsera + validación","device":"iPad Check-in 02","operator":"Andrea S.","x":28,"y":12}')
) as seed(code, name, counter_value, direction_mode, sort_order, metadata)
on conflict (venue_id, code) do update
set
  name = excluded.name,
  counter_value = excluded.counter_value,
  direction_mode = excluded.direction_mode,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = now();

with venue as (
  select id
  from public.venues
  where slug = 'kapital-madrid'
)
insert into public.finance_daily_snapshots (
  venue_id,
  snapshot_date,
  period_key,
  net_revenue,
  gross_revenue,
  product_cost,
  staff_cost,
  fees_cost,
  other_cost,
  operating_profit,
  cash_available,
  pending_payments,
  margin_pct,
  notes
)
select
  venue.id,
  seed.snapshot_date::date,
  seed.period_key,
  seed.net_revenue,
  seed.gross_revenue,
  seed.product_cost,
  seed.staff_cost,
  seed.fees_cost,
  seed.other_cost,
  seed.operating_profit,
  seed.cash_available,
  seed.pending_payments,
  seed.margin_pct,
  seed.notes::jsonb
from venue
cross join (
  values
    ('2026-05-18', 'today', 138420.00, 142890.00, 32570.00, 8920.00, 1820.00, 640.00, 98940.00, 86200.00, 18700.00, 34.20, '{"source":"seed","scope":"operativa actual"}'),
    ('2026-05-18', '7d', 812600.00, 842140.00, 185400.00, 62100.00, 11220.00, 4220.00, 549660.00, 276400.00, 49800.00, 33.40, '{"source":"seed","scope":"rolling-7d"}'),
    ('2026-05-18', '30d', 3294000.00, 3421800.00, 756200.00, 261700.00, 47240.00, 18980.00, 2209880.00, 641000.00, 134300.00, 34.10, '{"source":"seed","scope":"rolling-30d"}'),
    ('2026-05-18', 'mtd', 1962400.00, 2035600.00, 451700.00, 149500.00, 28680.00, 11100.00, 1321420.00, 412600.00, 91300.00, 34.50, '{"source":"seed","scope":"month-to-date"}')
) as seed(snapshot_date, period_key, net_revenue, gross_revenue, product_cost, staff_cost, fees_cost, other_cost, operating_profit, cash_available, pending_payments, margin_pct, notes)
on conflict (venue_id, snapshot_date, period_key) do update
set
  net_revenue = excluded.net_revenue,
  gross_revenue = excluded.gross_revenue,
  product_cost = excluded.product_cost,
  staff_cost = excluded.staff_cost,
  fees_cost = excluded.fees_cost,
  other_cost = excluded.other_cost,
  operating_profit = excluded.operating_profit,
  cash_available = excluded.cash_available,
  pending_payments = excluded.pending_payments,
  margin_pct = excluded.margin_pct,
  notes = excluded.notes,
  updated_at = now();
