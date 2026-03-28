-- Migration: add video_comments table
-- Run this against your Supabase database

create table if not exists video_comments (
  id         uuid default uuid_generate_v4() primary key,
  video_id   uuid not null references videos(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

alter table video_comments enable row level security;

create policy "Anyone can view comments on approved videos"
  on video_comments for select using (
    exists (select 1 from videos where videos.id = video_comments.video_id and videos.status = 'approved')
  );

create policy "Authenticated users can comment on videos"
  on video_comments for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can delete their own video comments"
  on video_comments for delete using (auth.uid() = user_id);

create index video_comments_video_id_idx on video_comments(video_id);
