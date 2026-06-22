-- ============================================================================
-- Family (multi-profile) — `members` + member scoping
--
-- ⚠️  REVIEW BEFORE APPLYING. Not yet applied to the database.
-- Safe to re-run (idempotent where practical). One transaction.
--
-- Member-scoped tables (each currently keyed by user_id = auth.uid()):
--   reports, health_protocols, protocol_habits, daily_checkins, health_chat_messages
-- NOT touched: profiles (account-level), patients (clinician surface).
-- ============================================================================
begin;

-- 1. members -----------------------------------------------------------------
create table if not exists public.members (
  id            uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  relationship  text not null default 'self'
                  check (relationship in ('self','partner','child','parent','other')),
  dob           date,
  age           int,
  sex           text,
  color         text not null default '#F5A623',   -- brand accent for the member
  created_at    timestamptz not null default now()
);
create index if not exists members_owner_idx on public.members(owner_user_id);
-- exactly one "self" member per account
create unique index if not exists members_one_self_per_owner
  on public.members(owner_user_id) where relationship = 'self';

alter table public.members enable row level security;
drop policy if exists members_select_own on public.members;
drop policy if exists members_insert_own on public.members;
drop policy if exists members_update_own on public.members;
drop policy if exists members_delete_own on public.members;
create policy members_select_own on public.members for select using (auth.uid() = owner_user_id);
create policy members_insert_own on public.members for insert with check (auth.uid() = owner_user_id);
create policy members_update_own on public.members for update using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy members_delete_own on public.members for delete using (auth.uid() = owner_user_id);

-- 2. member_id on every member-scoped table ----------------------------------
--    ON DELETE CASCADE  =>  removing a member deletes that member's data.
alter table public.reports              add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table public.health_protocols     add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table public.protocol_habits      add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table public.daily_checkins       add column if not exists member_id uuid references public.members(id) on delete cascade;
alter table public.health_chat_messages add column if not exists member_id uuid references public.members(id) on delete cascade;

create index if not exists reports_member_idx              on public.reports(member_id);
create index if not exists health_protocols_member_idx     on public.health_protocols(member_id);
create index if not exists protocol_habits_member_idx      on public.protocol_habits(member_id);
create index if not exists daily_checkins_member_idx       on public.daily_checkins(member_id);
create index if not exists health_chat_messages_member_idx on public.health_chat_messages(member_id);

-- 3. BACKFILL (critical — no row left behind) --------------------------------
-- 3a. one "self" member per existing account; name + age/sex seeded from profile.
insert into public.members (owner_user_id, name, relationship, age, sex, color)
select u.id,
       coalesce(nullif(p.full_name, ''), nullif(split_part(coalesce(p.email, u.email, ''), '@', 1), ''), 'Me'),
       'self', p.age, p.biological_sex, '#F5A623'
from auth.users u
left join public.profiles p on p.id = u.id
where not exists (select 1 from public.members m where m.owner_user_id = u.id and m.relationship = 'self');

-- 3b. attach every existing member-scoped row to its owner's "self" member.
update public.reports r              set member_id = m.id from public.members m
  where m.owner_user_id = r.user_id  and m.relationship = 'self' and r.member_id  is null and r.patient_id is null;  -- clinician reports keep patient_id, member_id stays NULL
update public.health_protocols hp    set member_id = m.id from public.members m
  where m.owner_user_id = hp.user_id and m.relationship = 'self' and hp.member_id is null;
update public.protocol_habits ph     set member_id = m.id from public.members m
  where m.owner_user_id = ph.user_id and m.relationship = 'self' and ph.member_id is null;
update public.daily_checkins dc      set member_id = m.id from public.members m
  where m.owner_user_id = dc.user_id and m.relationship = 'self' and dc.member_id is null;
update public.health_chat_messages hm set member_id = m.id from public.members m
  where m.owner_user_id = hm.user_id and m.relationship = 'self' and hm.member_id is null;

-- 4. RLS hardening: you can only attach a row to a member you own -------------
-- Cross-ACCOUNT isolation already holds (existing user_id = auth.uid() policies).
-- These add member-OWNERSHIP integrity to writes so you cannot point a row at
-- another account's member. SELECT/DELETE stay user_id-scoped (unchanged).
create or replace function public.owns_member(m uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select m is null or exists (select 1 from public.members x where x.id = m and x.owner_user_id = auth.uid());
$$;

-- reports (only had SELECT + INSERT policies)
drop policy if exists "own insert" on public.reports;
create policy "own insert" on public.reports for insert
  with check (auth.uid() = user_id and public.owns_member(member_id));

-- health_protocols
drop policy if exists "Users can insert their own health_protocols" on public.health_protocols;
create policy "Users can insert their own health_protocols" on public.health_protocols for insert
  with check (auth.uid() = user_id and public.owns_member(member_id));
drop policy if exists "Users can update their own health_protocols" on public.health_protocols;
create policy "Users can update their own health_protocols" on public.health_protocols for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_member(member_id));

-- protocol_habits
drop policy if exists "Users can insert their own protocol_habits" on public.protocol_habits;
create policy "Users can insert their own protocol_habits" on public.protocol_habits for insert
  with check (auth.uid() = user_id and public.owns_member(member_id));
drop policy if exists "Users can update their own protocol_habits" on public.protocol_habits;
create policy "Users can update their own protocol_habits" on public.protocol_habits for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_member(member_id));

-- daily_checkins
drop policy if exists "Users can insert their own daily_checkins" on public.daily_checkins;
create policy "Users can insert their own daily_checkins" on public.daily_checkins for insert
  with check (auth.uid() = user_id and public.owns_member(member_id));
drop policy if exists "Users can update their own daily_checkins" on public.daily_checkins;
create policy "Users can update their own daily_checkins" on public.daily_checkins for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_member(member_id));

-- health_chat_messages
drop policy if exists "Users can insert their own health_chat_messages" on public.health_chat_messages;
create policy "Users can insert their own health_chat_messages" on public.health_chat_messages for insert
  with check (auth.uid() = user_id and public.owns_member(member_id));
drop policy if exists "Users can update their own health_chat_messages" on public.health_chat_messages;
create policy "Users can update their own health_chat_messages" on public.health_chat_messages for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_member(member_id));

-- NOTE: member_id is left NULLABLE on purpose:
--   • reports keep member_id NULL for clinician/patient rows (patient_id set);
--   • staying nullable avoids breaking any insert path not yet updated to send it.
-- App + edge functions will set member_id going forward (next step, after this
-- migration is applied).

-- 5. per-member daily check-in uniqueness ----------------------------------
-- (was unique(user_id, checkin_date), which blocked two family members from
--  checking in on the same date). Existing rows are one-per-(self member,date).
create unique index if not exists daily_checkins_member_date_key
  on public.daily_checkins(member_id, checkin_date);
alter table public.daily_checkins drop constraint if exists daily_checkins_user_id_checkin_date_key;

commit;

-- ---------------------------------------------------------------------------
-- Optional verification (run after applying):
--   select count(*) filter (where member_id is null) as personal_reports_without_member
--   from public.reports where patient_id is null;            -- expect 0
--   select relationship, count(*) from public.members group by 1;  -- one 'self' per user
-- ---------------------------------------------------------------------------
