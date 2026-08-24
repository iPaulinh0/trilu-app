-- public.profiles: one row per auth.users row, created automatically by the
-- trigger below. Holds only what the app's UI needs beyond what auth.users
-- already has (email lives there, not here).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Read/update your own row only — no policy at all for insert/delete, since
-- rows are created solely by the trigger (as its own security-definer
-- owner, bypassing RLS) and removed only via the auth.users cascade.
create policy "Profiles are viewable by their owner"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- security definer + empty search_path: runs with the function owner's
-- privileges (needed to insert past RLS on behalf of a user who isn't
-- "logged in" yet during signup) and never resolves an unqualified
-- identifier against a schema an attacker could hijack — every reference
-- below is fully qualified (public.profiles, auth.users) for that reason.
--
-- ON CONFLICT DO NOTHING is deliberate: a retried/duplicate trigger firing
-- (e.g. a Postgres retry, or a manual re-run) must never overwrite a row
-- the user has since edited. Test this trigger carefully before relying on
-- it in production — a bug here can block every new signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
