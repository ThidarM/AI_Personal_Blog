-- Supabase schema for personal blog
-- Run this in your Supabase SQL editor or psql connected to the project

-- enable uuid generator
create extension if not exists "pgcrypto";

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  author_id uuid references auth.users(id) on delete set null,
  status text default 'draft',
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_posts_slug on posts(slug);
