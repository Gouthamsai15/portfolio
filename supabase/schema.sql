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

create table if not exists public.portfolio_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  persona text not null,
  highlights jsonb not null default '[]'::jsonb,
  html text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  role text not null,
  about text not null,
  highlights jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  additional_sections jsonb not null default '[]'::jsonb,
  rendered_html text not null default ''
);

alter table public.portfolio_data
add column if not exists highlights jsonb not null default '[]'::jsonb;

alter table public.portfolio_data
add column if not exists additional_sections jsonb not null default '[]'::jsonb;

alter table public.portfolio_data
add column if not exists rendered_html text not null default '';

create index if not exists users_username_idx on public.users (username);
create index if not exists users_created_at_idx on public.users (created_at desc);
create index if not exists portfolio_templates_created_at_idx on public.portfolio_templates (created_at desc);
create index if not exists portfolio_templates_is_active_idx on public.portfolio_templates (is_active);

alter table public.users enable row level security;
alter table public.portfolio_data enable row level security;
alter table public.portfolio_templates enable row level security;
