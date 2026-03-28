-- ============================================================
-- Project 774 — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table profiles (
  id           uuid references auth.users on delete cascade primary key,
  full_name    text not null,
  state        text not null,
  lga          text not null,
  role         text not null default 'user', -- user | moderator | admin | super_admin
  avatar_url   text,
  created_at   timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, state, lga)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'state', ''),
    coalesce(new.raw_user_meta_data->>'lga', '')
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- NOMINEES
-- ============================================================
create table nominees (
  id               uuid default uuid_generate_v4() primary key,
  name             text not null,
  photo_url        text,
  state            text not null,
  lga              text not null,
  field            text not null,
  writeup          text not null,
  status           text not null default 'pending', -- pending | approved | rejected
  nomination_count integer default 1,
  featured         boolean default false,
  nominated_by     uuid references profiles(id),
  rejection_note   text,
  created_at       timestamptz default now()
);

-- ============================================================
-- ENDORSEMENTS (one per user per nominee)
-- ============================================================
create table endorsements (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  nominee_id  uuid references nominees(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, nominee_id)
);

-- Auto-increment nominee count on endorsement
create or replace function increment_nomination_count()
returns trigger as $$
begin
  update nominees
  set nomination_count = nomination_count + 1
  where id = new.nominee_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_endorsement_created
  after insert on endorsements
  for each row execute procedure increment_nomination_count();

-- ============================================================
-- VIDEOS (Civic Lens submissions)
-- ============================================================
create table videos (
  id           uuid default uuid_generate_v4() primary key,
  title        text not null,
  url          text not null,
  state        text not null,
  lga          text,
  category     text not null,
  description  text,
  status       text not null default 'pending', -- pending | approved | rejected
  submitted_by uuid references profiles(id),
  created_at   timestamptz default now()
);

-- ============================================================
-- VIDEO COMMENTS
-- ============================================================
create table video_comments (
  id         uuid default uuid_generate_v4() primary key,
  video_id   uuid not null references videos(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- TOPIC GROUPS (user-created)
-- ============================================================
create table topic_groups (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  description  text,
  created_by   uuid references profiles(id),
  member_count integer default 1,
  created_at   timestamptz default now()
);

-- ============================================================
-- GROUP MEMBERSHIPS
-- ============================================================
create table group_memberships (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references profiles(id) on delete cascade,
  group_type      text not null,   -- 'lga' | 'topic'
  lga_key         text,            -- '{state}:{lga}' for LGA groups
  topic_group_id  uuid references topic_groups(id),
  created_at      timestamptz default now(),
  unique(user_id, lga_key),
  unique(user_id, topic_group_id)
);

-- ============================================================
-- GROUP POSTS
-- ============================================================
create table group_posts (
  id              uuid default uuid_generate_v4() primary key,
  group_type      text not null,
  lga_key         text,
  topic_group_id  uuid references topic_groups(id),
  user_id         uuid references profiles(id) on delete cascade,
  content         text not null,
  flag_count      integer default 0,
  is_suspended    boolean default false,
  created_at      timestamptz default now()
);

-- ============================================================
-- POST COMMENTS
-- ============================================================
create table post_comments (
  id          uuid default uuid_generate_v4() primary key,
  post_id     uuid references group_posts(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now()
);

-- ============================================================
-- FLAGS
-- ============================================================
create table flags (
  id           uuid default uuid_generate_v4() primary key,
  target_type  text not null, -- 'post' | 'comment' | 'video' | 'user'
  target_id    uuid not null,
  flagged_by   uuid references profiles(id),
  reason       text,
  created_at   timestamptz default now(),
  unique(flagged_by, target_type, target_id)
);

-- Auto-increment flag count on posts
create or replace function increment_flag_count()
returns trigger as $$
begin
  if new.target_type = 'post' then
    update group_posts
    set flag_count = flag_count + 1
    where id = new.target_id;
    -- Auto-suspend at 3 flags
    update group_posts
    set is_suspended = true
    where id = new.target_id and flag_count >= 3;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_flag_created
  after insert on flags
  for each row execute procedure increment_flag_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles          enable row level security;
alter table nominees          enable row level security;
alter table endorsements      enable row level security;
alter table videos            enable row level security;
alter table video_comments    enable row level security;
alter table topic_groups      enable row level security;
alter table group_memberships enable row level security;
alter table group_posts       enable row level security;
alter table post_comments     enable row level security;
alter table flags             enable row level security;

-- Profiles: users can read all, edit only their own
create policy "Profiles are viewable by authenticated users"
  on profiles for select to authenticated using (true);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Nominees: anyone can read approved, auth users can insert, admins manage all
create policy "Anyone can view approved nominees"
  on nominees for select using (status = 'approved');
create policy "Authenticated users can nominate"
  on nominees for insert to authenticated with check (auth.uid() = nominated_by);

-- Endorsements: auth users can endorse, view their own
create policy "Users can endorse nominees"
  on endorsements for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can view all endorsements"
  on endorsements for select to authenticated using (true);
create policy "Users can remove their own endorsement"
  on endorsements for delete using (auth.uid() = user_id);

-- Videos: anyone can view approved, auth users can submit
create policy "Anyone can view approved videos"
  on videos for select using (status = 'approved');
create policy "Authenticated users can submit videos"
  on videos for insert to authenticated with check (auth.uid() = submitted_by);

-- Video comments: anyone can view on approved videos, auth users can comment
create policy "Anyone can view comments on approved videos"
  on video_comments for select using (
    exists (select 1 from videos where videos.id = video_comments.video_id and videos.status = 'approved')
  );
create policy "Authenticated users can comment on videos"
  on video_comments for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete their own video comments"
  on video_comments for delete using (auth.uid() = user_id);

-- Topic groups: visible to all authenticated users
create policy "Authenticated users can view groups"
  on topic_groups for select to authenticated using (true);
create policy "Authenticated users can create groups"
  on topic_groups for insert to authenticated with check (auth.uid() = created_by);

-- Group posts: authenticated users can read and post
create policy "Authenticated users can view posts"
  on group_posts for select to authenticated using (is_suspended = false);
create policy "Authenticated users can post"
  on group_posts for insert to authenticated with check (auth.uid() = user_id);

-- Comments: authenticated users
create policy "Authenticated users can view comments"
  on post_comments for select to authenticated using (true);
create policy "Authenticated users can comment"
  on post_comments for insert to authenticated with check (auth.uid() = user_id);

-- Flags: auth users can flag
create policy "Authenticated users can flag content"
  on flags for insert to authenticated with check (auth.uid() = flagged_by);

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index nominees_state_lga_idx on nominees(state, lga);
create index nominees_status_idx on nominees(status);
create index nominees_count_idx on nominees(nomination_count desc);
create index videos_status_idx on videos(status);
create index group_posts_lga_key_idx on group_posts(lga_key);
create index flags_target_idx on flags(target_type, target_id);

-- ============================================================
-- STORAGE — nominee photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('nominee-photos', 'nominee-photos', true)
on conflict do nothing;

-- Anyone can view photos (bucket is public)
create policy "Public read nominee photos"
  on storage.objects for select
  using (bucket_id = 'nominee-photos');

-- Authenticated users can upload
create policy "Authenticated users can upload nominee photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'nominee-photos');

-- ============================================================
-- STORAGE — user avatars
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars');

create policy "Users can update their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars');

-- ============================================================
-- BACKFILL: create profiles for users who signed up before
-- schema was run (safe to re-run)
-- ============================================================
insert into profiles (id, full_name, state, lga)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'state', 'Unknown'),
  coalesce(u.raw_user_meta_data->>'lga',   'Unknown')
from auth.users u
where not exists (select 1 from profiles p where p.id = u.id)
on conflict do nothing;
