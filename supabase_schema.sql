-- ==========================================================
-- Team DeCo Portal — Supabase Schema & Seed Data
-- Run this in your Supabase project's SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==========================================================

-- 1. Create Projects Table
create table if not exists public.projects (
  id text primary key, -- e.g. 'DC-7F3K9P2Q'
  name text not null,
  status text not null default 'In progress',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  updated_label text default 'Project in active development',
  url text default 'https://vercel.com',
  update_title text default 'Development is underway',
  update_notes text default 'Milestone progress and project notes will appear here as Team DeCo publishes updates.',
  next_meeting text default 'Thursday · 4:00 PM IST',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Ensure next_meeting column exists if table is already created
alter table public.projects add column if not exists next_meeting text;

-- 2. Create Milestones Table
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects(id) on delete cascade,
  name text not null,
  phase text not null, -- e.g. 'Phase 01'
  state text not null default 'upcoming' check (state in ('done', 'active', 'upcoming')),
  detail text,
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- 3. Disable Row Level Security (RLS)
alter table public.projects disable row level security;
alter table public.milestones disable row level security;

-- 6. Insert Default Demo Project (DC-7F3K9P2Q)
insert into public.projects (id, name, status, progress, updated_label, url, update_title, update_notes)
values (
  'DC-7F3K9P2Q',
  'Website Development',
  'In progress',
  65,
  'Live database connected · Team DeCo',
  'https://vercel.com',
  'Development is underway',
  'Milestone progress and project notes will appear here as Team DeCo publishes updates.'
)
on conflict (id) do nothing;

-- 7. Insert Demo Milestones
insert into public.milestones (project_id, name, phase, state, detail, order_index)
values
  ('DC-7F3K9P2Q', 'Discovery & requirements', 'Phase 01', 'done', 'Scope and requirements confirmed', 1),
  ('DC-7F3K9P2Q', 'UI/UX design', 'Phase 02', 'done', 'Design direction approved', 2),
  ('DC-7F3K9P2Q', 'Development', 'Phase 03', 'active', 'Core features in development', 3),
  ('DC-7F3K9P2Q', 'Testing & quality assurance', 'Phase 04', 'upcoming', 'Functional and responsive testing', 4),
  ('DC-7F3K9P2Q', 'Final delivery', 'Phase 05', 'upcoming', 'Handover and launch', 5)
on conflict do nothing;
