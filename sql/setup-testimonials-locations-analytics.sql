-- Setup Témoignages + Clients dans le monde + Analytics (visiteurs)
-- À exécuter dans l'éditeur SQL Supabase
--
-- Prérequis:
-- - Fonction public.is_admin() disponible (voir sql/verify-is-admin-function.sql)
--
-- Tables créées:
-- - public.testimonials (témoignages clients)
-- - public.customer_locations (données pour la carte "Nos clients dans le monde")
-- - public.page_views (tracking simple des pages vues / visiteurs)

begin;

-- Extensions utiles (si non déjà présentes)
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) Témoignages
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

-- Lecture publique: seulement les témoignages approuvés
drop policy if exists "Public can read approved testimonials" on public.testimonials;
create policy "Public can read approved testimonials"
on public.testimonials
for select
to anon, authenticated
using (status = 'approved');

-- Insertion: un client authentifié peut soumettre un témoignage pour lui-même
drop policy if exists "Authenticated can insert own testimonials" on public.testimonials;
create policy "Authenticated can insert own testimonials"
on public.testimonials
for insert
to authenticated
with check (user_id = auth.uid());

-- Admin: gestion complète
drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2) Clients dans le monde (données de carte)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_locations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  count int not null default 0 check (count >= 0),
  customers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_locations enable row level security;

-- Lecture publique: ok (la carte est sur la home)
drop policy if exists "Public can read customer locations" on public.customer_locations;
create policy "Public can read customer locations"
on public.customer_locations
for select
to anon, authenticated
using (true);

-- Admin: gestion complète
drop policy if exists "Admins can manage customer locations" on public.customer_locations;
create policy "Admins can manage customer locations"
on public.customer_locations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3) Page views / Visiteurs (tracking simple)
-- ---------------------------------------------------------------------------
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  path text not null,
  user_id uuid references auth.users(id) on delete set null,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

-- Insertion: autoriser anon + authenticated (tracking client-side)
drop policy if exists "Anyone can insert page views" on public.page_views;
create policy "Anyone can insert page views"
on public.page_views
for insert
to anon, authenticated
with check (true);

-- Lecture: admin seulement (pour alimenter le dashboard)
drop policy if exists "Admins can read page views" on public.page_views;
create policy "Admins can read page views"
on public.page_views
for select
to authenticated
using (public.is_admin());

-- Admin: suppression / maintenance si besoin
drop policy if exists "Admins can delete page views" on public.page_views;
create policy "Admins can delete page views"
on public.page_views
for delete
to authenticated
using (public.is_admin());

commit;

