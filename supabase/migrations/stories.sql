-- ============================================================================
-- Stories — the community / trust feed
--
-- ⚠️  REVIEW BEFORE APPLYING. Additive + idempotent. Depends on family_members.sql.
-- Stories are opt-in and shared: the feed is world-readable; `featured` is set
-- manually (by you) to surface a story on the marketing site.
-- ============================================================================
begin;

create table if not exists public.stories (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references public.members(id) on delete cascade,
  title      text not null,
  body       text,
  image_url  text,
  likes      int  not null default 0,
  featured   boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists stories_featured_idx on public.stories(featured) where featured = true;
create index if not exists stories_created_idx on public.stories(created_at desc);

alter table public.stories enable row level security;

-- feed is public (shared, opt-in content)
drop policy if exists stories_read on public.stories;
create policy stories_read on public.stories for select using (true);

-- you can only write your own stories
drop policy if exists stories_insert on public.stories;
create policy stories_insert on public.stories for insert
  with check (public.owns_member(member_id));
drop policy if exists stories_update on public.stories;
create policy stories_update on public.stories for update
  using (public.owns_member(member_id)) with check (public.owns_member(member_id));
drop policy if exists stories_delete on public.stories;
create policy stories_delete on public.stories for delete
  using (public.owns_member(member_id));

commit;
