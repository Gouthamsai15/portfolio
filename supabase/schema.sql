create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null unique,
  resume_url text not null,
  template text not null,
  color_primary text not null,
  color_secondary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  role text not null,
  about text not null,
  skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  contact jsonb not null default '{}'::jsonb
);

create index if not exists users_username_idx on public.users (username);
create index if not exists users_created_at_idx on public.users (created_at desc);

alter table public.users enable row level security;
alter table public.portfolio_data enable row level security;
