-- ============================================================
-- BLOG POSTS (community blog)
-- ============================================================
create table blog_posts (
  id            uuid default uuid_generate_v4() primary key,
  title         text not null,
  slug          text not null unique,
  body          text not null,
  excerpt       text,
  cover_url     text,
  category      text not null default 'General',
  tags          text[] default '{}',
  status        text not null default 'pending', -- pending | approved | rejected
  author_id     uuid not null references profiles(id) on delete cascade,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index blog_posts_status_idx on blog_posts(status);
create index blog_posts_author_idx on blog_posts(author_id);
create index blog_posts_category_idx on blog_posts(category);
create index blog_posts_created_idx on blog_posts(created_at desc);
create index blog_posts_slug_idx on blog_posts(slug);

-- RLS
alter table blog_posts enable row level security;

create policy "Anyone can view approved blog posts"
  on blog_posts for select using (status = 'approved');

create policy "Authenticated users can create blog posts"
  on blog_posts for insert to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can update their own pending posts"
  on blog_posts for update using (
    auth.uid() = author_id and status = 'pending'
  );

-- Storage bucket for blog cover images
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict do nothing;

create policy "Public read blog covers"
  on storage.objects for select
  using (bucket_id = 'blog-covers');

create policy "Authenticated users can upload blog covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers');
