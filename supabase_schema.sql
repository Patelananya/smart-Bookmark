-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create bookmarks table
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table bookmarks enable row level security;

-- Policies

-- 1. Select Policy: User can only see their own bookmarks
create policy "User can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- 2. Insert Policy: User can only insert bookmarks for themselves
create policy "User can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- 3. Delete Policy: User can only delete their own bookmarks
create policy "User can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime for this table (optional but good for explicit enabling if needed, though usually enabled by default on new tables if replica identity is set)
alter publication supabase_realtime add table bookmarks;
