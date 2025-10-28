-- Aquivis v5 initial schema (clean-room)

-- Extensions (Supabase includes pgcrypto; ensure present)
create extension if not exists pgcrypto;
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC',
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key,
  email text not null unique,
  first_name text,
  last_name text,
  role text not null check (role in ('owner','manager','technician','portal')),
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  address text,
  has_individual_units boolean not null default false,
  timezone text,
  created_at timestamptz default now()
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text,
  unit_type text not null,
  water_type text,
  volume_litres integer,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  technician_id uuid references profiles(id) on delete set null,
  service_date date not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz default now()
);

-- Service children
create table if not exists water_tests (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  ph numeric(4,2),
  chlorine numeric(6,2),
  bromine numeric(6,2),
  alkalinity numeric(6,2),
  calcium numeric(6,2),
  cyanuric numeric(6,2),
  salt numeric(8,2),
  turbidity numeric(6,2),
  temperature numeric(6,2),
  notes text,
  created_at timestamptz default now()
);

create table if not exists chemical_additions (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  chemical_type text not null,
  quantity numeric(10,3) not null,
  unit_of_measure text not null,
  cost numeric(12,2),
  created_at timestamptz default now()
);

create table if not exists maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  task_type text not null,
  completed boolean not null default false,
  notes text,
  created_at timestamptz default now()
);

-- Plant rooms and equipment
create table if not exists plant_rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  check_window_morning text, -- e.g. '06:00-10:00'
  check_window_afternoon text, -- e.g. '14:00-18:00'
  check_window_evening text,
  created_at timestamptz default now()
);

create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  name text not null,
  category text,
  maintenance_frequency text,
  maintenance_times text,
  measurement_config jsonb,
  maintenance_scheduled boolean not null default false,
  created_at timestamptz default now()
);

-- Scheduling templates and rules
create table if not exists schedule_templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  template_name text not null,
  template_type text not null, -- e.g., 'plant_check','daily_tests','random_sample','booking_driven','recurrence'
  template_config jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists property_rules (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  rule_type text not null,
  rule_config jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Facility groups for random sampling
create table if not exists facility_groups (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references facility_groups(id) on delete cascade,
  unit_id uuid not null references units(id) on delete cascade,
  weight integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  unique(group_id, unit_id)
);

-- Sampling state for fairness
create table if not exists sampling_state (
  unit_id uuid primary key references units(id) on delete cascade,
  last_selected_on date,
  rolling_count integer not null default 0,
  updated_at timestamptz default now()
);

create table if not exists scheduled_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  task_type text not null,
  date date not null,
  time_slot text, -- e.g. 'morning'|'afternoon'|'evening' or HH:MM
  priority text not null default 'medium',
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Bookings for customer portal
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  unit_id uuid not null references units(id) on delete cascade,
  check_in date not null,
  check_out date not null,
  is_owner_stay boolean not null default false,
  source text not null default 'manual', -- manual|csv
  created_by uuid references profiles(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

-- Billing
create table if not exists billing_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  type text not null, -- hotel/shared|letting_pool|owner|property_manager
  external_ref text,
  created_at timestamptz default now()
);

create table if not exists billing_mappings (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  account_id uuid not null references billing_accounts(id) on delete cascade,
  effective_from date not null default current_date,
  effective_to date,
  created_at timestamptz default now(),
  unique(unit_id, account_id, effective_from)
);

create table if not exists service_charges (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  account_id uuid references billing_accounts(id) on delete set null,
  charge_type text not null, -- labor|test|chemical|fee
  qty numeric(12,3) not null default 1,
  uom text,
  unit_cost numeric(12,2),
  total numeric(14,2),
  created_at timestamptz default now()
);

-- Inventory (single-tenant)
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  sku text not null,
  name text not null,
  uom text not null,
  created_at timestamptz default now(),
  unique(company_id, sku)
);

create table if not exists inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  item_id uuid not null references inventory_items(id) on delete cascade,
  qty_delta numeric(12,3) not null,
  reason text not null, -- service_use|property_stock|sale|adjustment
  ref_type text, -- service|property|invoice
  ref_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- RLS helpers
create or replace function request_company_id()
returns uuid
stable
language sql
as $$
  select nullif(current_setting('request.jwt.claims', true), '')::json->>'company_id' :: uuid;
$$;

create or replace function request_role()
returns text
stable
language sql
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'role','');
$$;

create or replace function is_owner()
returns boolean stable language sql as $$ select request_role() = 'owner'; $$;

create or replace function is_manager()
returns boolean stable language sql as $$ select request_role() = 'manager'; $$;

create or replace function is_technician()
returns boolean stable language sql as $$ select request_role() = 'technician'; $$;

-- Enable RLS and baseline policies
alter table companies enable row level security;
create policy companies_select on companies for select using (id = request_company_id());

alter table profiles enable row level security;
create policy profiles_select on profiles for select using (company_id = request_company_id());
create policy profiles_owner_write on profiles for update using (is_owner() or is_manager()) with check (company_id = request_company_id());

-- Helper to apply generic tenant policies
-- For each table with company_id, grant tenant SELECT; writes for owner/manager
do $$
declare r record;
begin
  for r in select table_schema, table_name from information_schema.columns where column_name = 'company_id' and table_schema = 'public'
  loop
    execute format('alter table %I.%I enable row level security;', r.table_schema, r.table_name);
    execute format('create policy %I on %I.%I for select using (company_id = request_company_id());', r.table_name||'_select', r.table_schema, r.table_name);
    execute format('create policy %I on %I.%I for insert with check (company_id = request_company_id())', r.table_name||'_insert', r.table_schema, r.table_name);
    execute format('create policy %I on %I.%I for update using (company_id = request_company_id()) with check (company_id = request_company_id())', r.table_name||'_update', r.table_schema, r.table_name);
  end loop;
end$$;

-- Services and children: allow technicians to write their own work
alter table services enable row level security;
create policy services_select on services for select using (
  (select company_id from properties p where p.id = services.property_id) = request_company_id()
);
create policy services_insert_owner on services for insert with check (
  (select company_id from properties p where p.id = services.property_id) = request_company_id()
);
create policy services_update_owner on services for update using (
  (select company_id from properties p where p.id = services.property_id) = request_company_id()
) with check (
  (select company_id from properties p where p.id = services.property_id) = request_company_id()
);
create policy services_update_tech on services for update using (
  technician_id = auth.uid()
) with check (technician_id = auth.uid());

alter table water_tests enable row level security;
create policy water_tests_rw on water_tests for all using (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = water_tests.service_id and p.company_id = request_company_id())
) with check (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = water_tests.service_id and p.company_id = request_company_id())
);

alter table chemical_additions enable row level security;
create policy chemical_additions_rw on chemical_additions for all using (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = chemical_additions.service_id and p.company_id = request_company_id())
) with check (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = chemical_additions.service_id and p.company_id = request_company_id())
);

alter table maintenance_tasks enable row level security;
create policy maintenance_tasks_rw on maintenance_tasks for all using (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = maintenance_tasks.service_id and p.company_id = request_company_id())
) with check (
  exists (select 1 from services s join properties p on p.id = s.property_id where s.id = maintenance_tasks.service_id and p.company_id = request_company_id())
);

