-- ============================================================================
-- Challenges & rewards economy
--
-- ⚠️  REVIEW BEFORE APPLYING. Additive + idempotent. Depends on family_members.sql
-- (the `members` table). Member-scoped like the rest of the app.
-- ============================================================================
begin;

-- 1. challenges — global catalog (read-only to users) -----------------------
create table if not exists public.challenges (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  length_days   int  not null,
  points_reward int  not null,
  offer_pct     int  not null,
  theme         text,
  icon          text,
  sort_order    int  not null default 0
);

-- 2. enrollments — a member's run at a challenge ----------------------------
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid not null references public.members(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  current_day  int  not null default 1,
  streak       int  not null default 0,
  status       text not null default 'active' check (status in ('active','complete','abandoned')),
  started_at   timestamptz not null default now()
);
create index if not exists enrollments_member_idx on public.enrollments(member_id);

-- 3. points_ledger — append-only points history (balance = sum) -------------
create table if not exists public.points_ledger (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references public.members(id) on delete cascade,
  points     int  not null,
  reason     text,
  created_at timestamptz not null default now()
);
create index if not exists points_ledger_member_idx on public.points_ledger(member_id);

-- 4. offers — unlocked discount tiers ---------------------------------------
create table if not exists public.offers (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members(id) on delete cascade,
  pct         int  not null,
  source      text,
  unlocked_at timestamptz,
  redeemed_at timestamptz
);
create index if not exists offers_member_idx on public.offers(member_id);

-- 5. RLS: catalog is world-readable; the rest is member-owner scoped ---------
alter table public.challenges    enable row level security;
alter table public.enrollments   enable row level security;
alter table public.points_ledger enable row level security;
alter table public.offers        enable row level security;

drop policy if exists challenges_read on public.challenges;
create policy challenges_read on public.challenges for select using (true);

-- helper: does the caller own this member? (mirrors family_members.sql)
create or replace function public.owns_member(m uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members x where x.id = m and x.owner_user_id = auth.uid());
$$;

do $$
declare t text;
begin
  foreach t in array array['enrollments','points_ledger','offers'] loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format('create policy %I_select on public.%I for select using (public.owns_member(member_id))', t, t);
    execute format('create policy %I_insert on public.%I for insert with check (public.owns_member(member_id))', t, t);
    execute format('create policy %I_update on public.%I for update using (public.owns_member(member_id)) with check (public.owns_member(member_id))', t, t);
  end loop;
end $$;

-- 6. seed the catalog (idempotent by name) ----------------------------------
insert into public.challenges (name, length_days, points_reward, offer_pct, theme, icon, sort_order)
select * from (values
  ('21-Day Iron Reset',        21, 2100, 20, 'iron',           '🩸', 1),
  ('30-Day Energy Rebuild',    30, 3000, 30, 'energy',         '⚡', 2),
  ('60-Day Metabolic',         60, 6000, 50, 'metabolic',      '🔥', 3),
  ('90-Day Transformation',    90, 9000, 90, 'transformation', '✦', 4)
) as v(name, length_days, points_reward, offer_pct, theme, icon, sort_order)
where not exists (select 1 from public.challenges c where c.name = v.name);

commit;

-- ---------------------------------------------------------------------------
-- NOTE on the 90% tier: it is earned, not given. App/edge logic gates it on
-- 3 paid months + a completed 90-day enrollment before writing the offer row.
-- ---------------------------------------------------------------------------
