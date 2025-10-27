-- Aquivis v5 initial schema (skeleton)
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key,
  email text not null unique,
  first_name text,
  last_name text,
  role text not null check (role in ('owner','manager','technician')),
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  address text,
  has_individual_units boolean not null default false,
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

create table if not exists scheduled_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  task_type text not null,
  date date not null,
  time text,
  priority text not null default 'medium',
  status text not null default 'pending',
  created_at timestamptz default now()
);

