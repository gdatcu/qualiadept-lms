-- ==============================================================================
-- QualiAdept LMS - Supabase Database Schema for Article Reactions & Comments
-- ==============================================================================
-- Safe & Idempotent: You can run this script multiple times without errors.
-- ==============================================================================

-- 1. Create Article Reactions Table
create table if not exists public.article_reactions (
    id uuid default gen_random_uuid() primary key,
    article_id text not null,
    reaction_id text not null,
    user_identifier text not null,
    created_at timestamp with time zone default now(),
    constraint unique_article_reaction_user unique (article_id, reaction_id, user_identifier)
);

-- 2. Create Article Comments Table
create table if not exists public.article_comments (
    id uuid default gen_random_uuid() primary key,
    article_id text not null,
    author text not null,
    author_email text default '',
    text text not null,
    is_verified boolean default false,
    likes integer default 0,
    created_at timestamp with time zone default now()
);

-- 3. Create Indexes for High Performance
create index if not exists idx_article_reactions_lookup 
    on public.article_reactions(article_id, reaction_id);

create index if not exists idx_article_comments_lookup 
    on public.article_comments(article_id, created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.article_reactions enable row level security;
alter table public.article_comments enable row level security;

-- 5. Safe Policy Creation (Drop existing first if they exist)
-- Reactions Policies
drop policy if exists "Allow public read on article_reactions" on public.article_reactions;
create policy "Allow public read on article_reactions" 
    on public.article_reactions for select using (true);

drop policy if exists "Allow public insert on article_reactions" on public.article_reactions;
create policy "Allow public insert on article_reactions" 
    on public.article_reactions for insert with check (true);

drop policy if exists "Allow public delete on article_reactions" on public.article_reactions;
create policy "Allow public delete on article_reactions" 
    on public.article_reactions for delete using (true);

-- Comments Policies
drop policy if exists "Allow public read on article_comments" on public.article_comments;
create policy "Allow public read on article_comments" 
    on public.article_comments for select using (true);

drop policy if exists "Allow public insert on article_comments" on public.article_comments;
create policy "Allow public insert on article_comments" 
    on public.article_comments for insert with check (true);

drop policy if exists "Allow public update on article_comments" on public.article_comments;
create policy "Allow public update on article_comments" 
    on public.article_comments for update using (true);

drop policy if exists "Allow public delete on article_comments" on public.article_comments;
create policy "Allow public delete on article_comments" 
    on public.article_comments for delete using (true);

-- 6. Enable Realtime Replication
do $$
begin
    if not exists (
        select 1 from pg_publication_tables 
        where pubname = 'supabase_realtime' and tablename = 'article_reactions'
    ) then
        alter publication supabase_realtime add table public.article_reactions;
    end if;

    if not exists (
        select 1 from pg_publication_tables 
        where pubname = 'supabase_realtime' and tablename = 'article_comments'
    ) then
        alter publication supabase_realtime add table public.article_comments;
    end if;
end $$;

-- ==============================================================================
-- 7. Create Challenge Progress Table (Python Practice Challenges)
-- ==============================================================================
create table if not exists public.challenge_progress (
    id uuid default gen_random_uuid() primary key,
    challenge_id text not null,
    visitor_id text not null,
    user_email text default null,
    status text not null default 'completed',
    code_snippet text default null,
    title text default null,
    duration_ms integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint unique_visitor_challenge unique (visitor_id, challenge_id)
);

-- Indexes for Fast Lookup & Course Analytics
create index if not exists idx_challenge_progress_visitor 
    on public.challenge_progress(visitor_id, challenge_id);

create index if not exists idx_challenge_progress_analytics 
    on public.challenge_progress(challenge_id, status);

-- Enable Row Level Security (RLS)
alter table public.challenge_progress enable row level security;

-- Policies for Challenge Progress
drop policy if exists "Allow public read on challenge_progress" on public.challenge_progress;
create policy "Allow public read on challenge_progress" 
    on public.challenge_progress for select using (true);

drop policy if exists "Allow public insert on challenge_progress" on public.challenge_progress;
create policy "Allow public insert on challenge_progress" 
    on public.challenge_progress for insert with check (true);

drop policy if exists "Allow public update on challenge_progress" on public.challenge_progress;
create policy "Allow public update on challenge_progress" 
    on public.challenge_progress for update using (true);

-- Realtime Replication for Challenge Progress
do $$
begin
    if not exists (
        select 1 from pg_publication_tables 
        where pubname = 'supabase_realtime' and tablename = 'challenge_progress'
    ) then
        alter publication supabase_realtime add table public.challenge_progress;
    end if;
end $$;

