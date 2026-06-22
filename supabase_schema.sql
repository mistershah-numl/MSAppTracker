-- ─────────────────────────────────────────────────────────
-- MS Application Tracker — Supabase Schema
-- Run this entire file once in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────

create table if not exists entries (
  id           text        primary key,
  type         text        not null default 'Professor',
  country      text        not null default 'Canada',
  name         text        not null,
  uni          text        not null,
  dept         text,
  degree       text        default 'MS',
  areas        text,
  funding      text        default 'Unknown',
  fit          text        default 'no',
  status       text        not null default 'Not Applied',
  deadline     text,
  response     text,
  email        text,
  phone        text,
  web          text,
  portal       text,
  scholar      text,
  linkedin     text,
  twitter      text,
  rg           text,
  note         text,
  email_draft  text,
  custom_label text,
  custom_value text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on entries;
create trigger set_updated_at
  before update on entries
  for each row execute function update_updated_at();

-- Enable RLS (Row Level Security)
alter table entries enable row level security;

-- Allow all operations — we protect with our own API secret
-- (the API key acts as the auth layer; no user accounts needed)
create policy "Allow all" on entries
  for all using (true) with check (true);
