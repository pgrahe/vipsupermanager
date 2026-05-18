drop policy if exists "vip reservations public read prototype" on public.vip_reservations;
create policy "vip reservations public read prototype"
on public.vip_reservations
for select
using (true);

drop policy if exists "vip reservations public insert prototype" on public.vip_reservations;
create policy "vip reservations public insert prototype"
on public.vip_reservations
for insert
with check (true);

drop policy if exists "vip reservations public update prototype" on public.vip_reservations;
create policy "vip reservations public update prototype"
on public.vip_reservations
for update
using (true)
with check (true);

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
