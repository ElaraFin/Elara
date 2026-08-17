-- Elara MVP database schema
-- Area: User data backend / portfolio integration / user database
-- Target: Supabase PostgreSQL

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'asset_type') then
    create type asset_type as enum (
      'cash',
      'etf',
      'stock',
      'crypto',
      'bond',
      'real_estate',
      'physical_asset',
      'other'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'asset_source') then
    create type asset_source as enum (
      'manual',
      'pdf',
      'wealth_api'
    );
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'currency_code') then
    create type currency_code as enum (
      'EUR',
      'USD',
      'GBP',
      'CHF'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key,
  email text,
  full_name text,
  base_currency currency_code not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Later this id should reference auth.users(id).
-- For now we keep it flexible while auth is still not connected.

-- ---------------------------------------------------------------------
-- PORTFOLIOS
-- ---------------------------------------------------------------------

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null default 'Main portfolio',
  base_currency currency_code not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ASSETS
-- ---------------------------------------------------------------------

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  portfolio_id uuid references portfolios(id) on delete cascade,

  name text not null,
  asset_type asset_type not null,
  quantity numeric,
  current_value numeric not null check (current_value >= 0),
  currency currency_code not null default 'EUR',

  source asset_source not null default 'manual',
  provider text,

  external_id text,
  raw_payload jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_user_id_idx on assets(user_id);
create index if not exists assets_portfolio_id_idx on assets(portfolio_id);
create index if not exists assets_asset_type_idx on assets(asset_type);
create index if not exists assets_source_idx on assets(source);

-- ---------------------------------------------------------------------
-- PORTFOLIO SNAPSHOTS
-- ---------------------------------------------------------------------

create table if not exists portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  portfolio_id uuid references portfolios(id) on delete cascade,

  base_currency currency_code not null default 'EUR',
  total_net_worth numeric not null default 0,
  asset_count integer not null default 0,
  asset_class_count integer not null default 0,

  normalized_portfolio jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_snapshots_user_id_idx
  on portfolio_snapshots(user_id);

create index if not exists portfolio_snapshots_created_at_idx
  on portfolio_snapshots(created_at desc);

-- ---------------------------------------------------------------------
-- UPDATED_AT TRIGGER
-- ---------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
before update on profiles
for each row
execute function set_updated_at();

drop trigger if exists set_portfolios_updated_at on portfolios;
create trigger set_portfolios_updated_at
before update on portfolios
for each row
execute function set_updated_at();

drop trigger if exists set_assets_updated_at on assets;
create trigger set_assets_updated_at
before update on assets
for each row
execute function set_updated_at();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------

alter table profiles enable row level security;
alter table portfolios enable row level security;
alter table assets enable row level security;
alter table portfolio_snapshots enable row level security;

-- These policies assume Supabase Auth later.
-- Once auth is connected, auth.uid() must match user_id/profile id.

drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

drop policy if exists "Users can read own portfolios" on portfolios;
create policy "Users can read own portfolios"
on portfolios for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own portfolios" on portfolios;
create policy "Users can insert own portfolios"
on portfolios for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own portfolios" on portfolios;
create policy "Users can update own portfolios"
on portfolios for update
using (auth.uid() = user_id);

drop policy if exists "Users can delete own portfolios" on portfolios;
create policy "Users can delete own portfolios"
on portfolios for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own assets" on assets;
create policy "Users can read own assets"
on assets for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own assets" on assets;
create policy "Users can insert own assets"
on assets for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own assets" on assets;
create policy "Users can update own assets"
on assets for update
using (auth.uid() = user_id);

drop policy if exists "Users can delete own assets" on assets;
create policy "Users can delete own assets"
on assets for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own snapshots" on portfolio_snapshots;
create policy "Users can read own snapshots"
on portfolio_snapshots for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own snapshots" on portfolio_snapshots;
create policy "Users can insert own snapshots"
on portfolio_snapshots for insert
with check (auth.uid() = user_id);