-- CHIP Golf Fitness App — Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────
create type protocol_type as enum ('speed', 'strength', 'power', 'recovery');

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── USER SETTINGS ────────────────────────────────────────────────────────────
create table if not exists user_settings (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references profiles(id) on delete cascade,
  notifications_enabled boolean not null default false,
  reminder_time         time,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(user_id)
);

alter table user_settings enable row level security;

create policy "Users can manage own settings"
  on user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── USER SCHEDULES ───────────────────────────────────────────────────────────
-- day_of_week: 0=Sun, 1=Mon, ..., 6=Sat
create table if not exists user_schedules (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  day_of_week  smallint not null check (day_of_week between 0 and 6),
  protocol     protocol_type,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(user_id, day_of_week)
);

alter table user_schedules enable row level security;

create policy "Users can manage own schedule"
  on user_schedules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── WORKOUT LOGS ─────────────────────────────────────────────────────────────
create table if not exists workout_logs (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  workout_date     date not null,
  protocol         protocol_type not null,
  completed        boolean not null default false,
  exercises_json   jsonb not null default '[]'::jsonb,
  duration_seconds integer check (duration_seconds >= 0),
  notes            text check (char_length(notes) <= 1000),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique(user_id, workout_date)
);

alter table workout_logs enable row level security;

create policy "Users can manage own workout logs"
  on workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for performance
create index if not exists workout_logs_user_date_idx on workout_logs(user_id, workout_date desc);
create index if not exists workout_logs_completed_idx on workout_logs(user_id, completed) where completed = true;

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

create trigger set_settings_updated_at
  before update on user_settings
  for each row execute procedure set_updated_at();

create trigger set_schedules_updated_at
  before update on user_schedules
  for each row execute procedure set_updated_at();

create trigger set_logs_updated_at
  before update on workout_logs
  for each row execute procedure set_updated_at();
