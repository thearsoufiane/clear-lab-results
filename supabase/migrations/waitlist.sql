-- ============================================================================
-- Waitlist — pre-launch email capture from the public landing page
--
-- ⚠️  REVIEW BEFORE APPLYING. Additive + idempotent. No dependencies.
-- Anyone (anonymous, using the anon key) may add their email while the app is
-- gated. Nobody can read the list back through the API — reads are for the
-- service role / dashboard only. Email is unique so a repeat submit is a no-op.
-- ============================================================================
begin;

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- anyone may join the waitlist (insert only) …
drop policy if exists waitlist_insert on public.waitlist;
create policy waitlist_insert on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- … but the list is never readable through the public API.
-- (No select/update/delete policy = denied for anon & authenticated.)

commit;
