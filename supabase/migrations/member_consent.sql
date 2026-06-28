-- ============================================================================
-- Per-person consent for family members
--
-- Non-negotiable rule: capture consent BEFORE processing a family member's
-- health data. Each added member records when consent was granted (consent_at).
--
-- ⚠️  REVIEW BEFORE APPLYING. Additive + idempotent. Safe to re-run.
-- Depends on: family_members.sql (the `members` table).
-- ============================================================================
begin;

alter table public.members
  add column if not exists consent_at timestamptz;

-- The account owner's own "self" member is implicitly consented at creation
-- (it's their own data). Backfill those so the column is meaningful for self.
update public.members
  set consent_at = created_at
  where relationship = 'self' and consent_at is null;

-- NOTE: non-'self' members created before this migration are intentionally left
-- NULL — we will not fabricate a consent timestamp. The app captures consent_at
-- on every new family member going forward.

commit;

-- ---------------------------------------------------------------------------
-- Optional verification:
--   select relationship, count(*) filter (where consent_at is null) as without_consent
--   from public.members group by 1;   -- expect 0 for 'self'
-- ---------------------------------------------------------------------------
