-- ============================================================================
-- Waitlist · audience segmentation
--
-- ⚠️  REVIEW BEFORE APPLYING. Do not auto-run against the remote DB.
--
-- Evolves the existing pre-launch `waitlist` table (id, email, created_at) so
-- each signup carries which page it came from. NON-DESTRUCTIVE: additive
-- columns + a backfill, so the rows already collected are preserved.
--
--   • audience   — 'individual' (/), 'doctor' (/for-doctors), 'clinic' (/for-clinics)
--   • source     — ?ref= value, else referrer hostname, else 'direct'
--   • user_agent — the submitting browser UA
--
-- Uniqueness moves from (email) → (email, audience): the same person can
-- legitimately join as both an individual and a doctor. A repeat submit for the
-- same (email, audience) raises 23505, which the form treats as success.
--
-- Anyone (anon key) may INSERT; nobody may read the list back through the API.
-- ============================================================================
begin;

-- Base shape for fresh environments. Existing deploys already have this table
-- (from the earlier waitlist.sql migration) — `if not exists` makes this a no-op
-- there and lets the ALTERs below do the real work.
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  created_at timestamptz not null default now()
);

-- Additive columns.
alter table public.waitlist add column if not exists audience   text;
alter table public.waitlist add column if not exists source     text;
alter table public.waitlist add column if not exists user_agent text;

-- Backfill rows collected before segmentation: they came from the "/" page.
update public.waitlist set audience = 'individual' where audience is null;

-- Now enforce audience.
alter table public.waitlist alter column audience set not null;
alter table public.waitlist drop constraint if exists waitlist_audience_check;
alter table public.waitlist add constraint waitlist_audience_check
  check (audience in ('individual', 'doctor', 'clinic'));

-- Swap uniqueness (email) → (email, audience). `waitlist_email_key` is the
-- name Postgres gave the old `email … unique` column constraint.
alter table public.waitlist drop constraint if exists waitlist_email_key;
alter table public.waitlist drop constraint if exists waitlist_email_audience_key;
alter table public.waitlist add constraint waitlist_email_audience_key
  unique (email, audience);

-- RLS: insert-only for anon + authenticated, no read/update/delete policy.
alter table public.waitlist enable row level security;
drop policy if exists waitlist_insert on public.waitlist;
drop policy if exists "anyone can join the waitlist" on public.waitlist;
create policy "anyone can join the waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

commit;
