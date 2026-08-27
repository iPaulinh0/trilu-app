-- Workouts (treinos): a user-created plan of exercises, each exercise
-- carrying its own list of planned/target sets (weight + reps per set,
-- not a min/max range) so the workout page can show and edit each set
-- individually, per the inline-expansion UX.
--
-- Execution history (starting a workout, logging what was actually done,
-- rest timers, personal records, the training calendar and streak/trail
-- integration) is intentionally NOT part of this migration — that system
-- already exists and works against local storage
-- (features/workouts/data/local-workout-session-repository.ts) and stays
-- there for this stage; the exercise evolution chart keeps reading real
-- history from it. Only workout *planning* (create/list/configure) moves
-- to Supabase here.

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  description text,
  muscle_groups text[] not null default '{}'
    check (
      muscle_groups <@ array[
        'chest','back','shoulders','biceps','triceps','forearms',
        'quadriceps','hamstrings','glutes','calves','core','fullBody','cardio','other'
      ]::text[]
    ),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workouts_user_id_idx on public.workouts (user_id) where archived_at is null;

alter table public.workouts enable row level security;

create policy "Workouts are viewable by their owner"
  on public.workouts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Workouts are insertable by their owner"
  on public.workouts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Workouts are updatable by their owner"
  on public.workouts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- No delete policy: "excluir" is a soft delete (archived_at) so history
-- referencing a workout by id (local session records, in this stage) never
-- dangles. Hard delete is simply not offered by the app.

-- workout_exercises: one row per exercise added to a workout. Provider
-- catalog fields (name/muscle group/equipment/media) are snapshotted here
-- at add-time — the exercise API remains the source of truth for the
-- catalog itself, this is just enough to keep rendering the card without
-- refetching, and to survive the provider's catalog changing later.
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts (id) on delete cascade,
  exercise_source text not null check (exercise_source in ('exercisedb', 'custom')),
  provider_exercise_id text,
  custom_exercise_id text,
  exercise_key text generated always as (coalesce(provider_exercise_id, custom_exercise_id)) stored,
  exercise_name_snapshot text not null,
  muscle_group text
    check (
      muscle_group is null or muscle_group in (
        'chest','back','shoulders','biceps','triceps','forearms',
        'quadriceps','hamstrings','glutes','calves','core','fullBody','cardio','other'
      )
    ),
  equipment text,
  media_url text,
  position integer not null check (position >= 0),
  rest_seconds integer not null default 60 check (rest_seconds >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_exercises_source_id_pairing check (
    (exercise_source = 'exercisedb' and provider_exercise_id is not null and custom_exercise_id is null)
    or
    (exercise_source = 'custom' and custom_exercise_id is not null and provider_exercise_id is null)
  ),
  -- Prevents adding the same catalog/custom exercise twice to one workout.
  constraint workout_exercises_unique_per_workout unique (workout_id, exercise_source, exercise_key)
);

create index if not exists workout_exercises_workout_id_position_idx
  on public.workout_exercises (workout_id, position);

alter table public.workout_exercises enable row level security;

create policy "Workout exercises are viewable by the workout owner"
  on public.workout_exercises for select
  to authenticated
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Workout exercises are insertable by the workout owner"
  on public.workout_exercises for insert
  to authenticated
  with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Workout exercises are updatable by the workout owner"
  on public.workout_exercises for update
  to authenticated
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()))
  with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

create policy "Workout exercises are deletable by the workout owner"
  on public.workout_exercises for delete
  to authenticated
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));

-- workout_exercise_sets: the planned/target configuration — one row per
-- individual set, each with its own target weight and reps (not a
-- min/max range), so "Série 1: 20kg x 12, Série 2: 22kg x 10" is
-- representable directly.
create table if not exists public.workout_exercise_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises (id) on delete cascade,
  set_number integer not null check (set_number >= 1),
  target_weight_kg numeric(6, 2) check (target_weight_kg is null or target_weight_kg >= 0),
  target_repetitions integer not null check (target_repetitions >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_exercise_sets_unique_number unique (workout_exercise_id, set_number)
);

create index if not exists workout_exercise_sets_exercise_id_number_idx
  on public.workout_exercise_sets (workout_exercise_id, set_number);

alter table public.workout_exercise_sets enable row level security;

create policy "Workout exercise sets are viewable by the workout owner"
  on public.workout_exercise_sets for select
  to authenticated
  using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

create policy "Workout exercise sets are insertable by the workout owner"
  on public.workout_exercise_sets for insert
  to authenticated
  with check (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

create policy "Workout exercise sets are updatable by the workout owner"
  on public.workout_exercise_sets for update
  to authenticated
  using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

create policy "Workout exercise sets are deletable by the workout owner"
  on public.workout_exercise_sets for delete
  to authenticated
  using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- RPCs: each one groups a multi-row write into a single transaction so a
-- half-applied save (e.g. the workout row updated but exercises not yet
-- replaced) can never happen. All run as SECURITY INVOKER (the default —
-- no "security definer" below) so every statement inside is still subject
-- to the RLS policies above; the explicit ownership checks are defense in
-- depth, not the only guard.
-- ---------------------------------------------------------------------

-- Creates a workout (p_workout_id null) or fully replaces one (its
-- exercises and their sets are dropped and reinserted from p_exercises).
-- Used by create() and by the "Editar treino" whole-form save — matching
-- the same replace-everything semantics the previous local implementation
-- already had for update(), so this isn't a new behavior, just persisted.
create or replace function public.save_workout(
  p_workout_id uuid,
  p_name text,
  p_description text,
  p_muscle_groups text[],
  p_exercises jsonb
) returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_workout_id uuid;
  v_exercise jsonb;
  v_exercise_id uuid;
  v_position integer := 0;
begin
  if p_workout_id is null then
    insert into public.workouts (name, description, muscle_groups)
    values (p_name, p_description, p_muscle_groups)
    returning id into v_workout_id;
  else
    update public.workouts
    set name = p_name, description = p_description, muscle_groups = p_muscle_groups, updated_at = now()
    where id = p_workout_id and user_id = auth.uid()
    returning id into v_workout_id;

    if v_workout_id is null then
      raise exception 'Treino não encontrado.';
    end if;

    delete from public.workout_exercises where workout_id = v_workout_id;
  end if;

  for v_exercise in select * from jsonb_array_elements(coalesce(p_exercises, '[]'::jsonb))
  loop
    insert into public.workout_exercises (
      workout_id, exercise_source, provider_exercise_id, custom_exercise_id,
      exercise_name_snapshot, muscle_group, equipment, media_url, position, rest_seconds, notes
    ) values (
      v_workout_id,
      v_exercise ->> 'exerciseSource',
      v_exercise ->> 'providerExerciseId',
      v_exercise ->> 'customExerciseId',
      v_exercise ->> 'exerciseNameSnapshot',
      v_exercise ->> 'muscleGroup',
      v_exercise ->> 'equipment',
      v_exercise ->> 'mediaUrl',
      v_position,
      (v_exercise ->> 'restSeconds')::integer,
      v_exercise ->> 'notes'
    ) returning id into v_exercise_id;

    insert into public.workout_exercise_sets (workout_exercise_id, set_number, target_weight_kg, target_repetitions)
    select
      v_exercise_id,
      (s ->> 'setNumber')::integer,
      nullif(s ->> 'targetWeightKg', '')::numeric,
      (s ->> 'targetRepetitions')::integer
    from jsonb_array_elements(coalesce(v_exercise -> 'sets', '[]'::jsonb)) s;

    v_position := v_position + 1;
  end loop;

  return v_workout_id;
end;
$$;

revoke all on function public.save_workout(uuid, text, text, text[], jsonb) from public;
grant execute on function public.save_workout(uuid, text, text, text[], jsonb) to authenticated;

-- Appends one exercise (with its bootstrap sets) to an existing workout,
-- at the next position — used by "Adicionar exercício" on the workout
-- detail page. Never touches any other exercise's rows, so it can't lose
-- per-set edits the user already made elsewhere on the page.
create or replace function public.add_workout_exercise(
  p_workout_id uuid,
  p_exercise_source text,
  p_provider_exercise_id text,
  p_custom_exercise_id text,
  p_exercise_name_snapshot text,
  p_muscle_group text,
  p_equipment text,
  p_media_url text,
  p_rest_seconds integer,
  p_notes text,
  p_sets jsonb
) returns uuid
language plpgsql
set search_path = ''
as $$
declare
  v_position integer;
  v_exercise_id uuid;
begin
  if not exists (select 1 from public.workouts where id = p_workout_id and user_id = auth.uid()) then
    raise exception 'Treino não encontrado.';
  end if;

  select coalesce(max(position) + 1, 0) into v_position
  from public.workout_exercises where workout_id = p_workout_id;

  insert into public.workout_exercises (
    workout_id, exercise_source, provider_exercise_id, custom_exercise_id,
    exercise_name_snapshot, muscle_group, equipment, media_url, position, rest_seconds, notes
  ) values (
    p_workout_id, p_exercise_source, p_provider_exercise_id, p_custom_exercise_id,
    p_exercise_name_snapshot, p_muscle_group, p_equipment, p_media_url, v_position, p_rest_seconds, p_notes
  ) returning id into v_exercise_id;

  insert into public.workout_exercise_sets (workout_exercise_id, set_number, target_weight_kg, target_repetitions)
  select
    v_exercise_id,
    (s ->> 'setNumber')::integer,
    nullif(s ->> 'targetWeightKg', '')::numeric,
    (s ->> 'targetRepetitions')::integer
  from jsonb_array_elements(coalesce(p_sets, '[]'::jsonb)) s;

  update public.workouts set updated_at = now() where id = p_workout_id;

  return v_exercise_id;
end;
$$;

revoke all on function public.add_workout_exercise(uuid, text, text, text, text, text, text, text, integer, text, jsonb) from public;
grant execute on function public.add_workout_exercise(uuid, text, text, text, text, text, text, text, integer, text, jsonb) to authenticated;

-- Atomically replaces one exercise's planned sets and rest time — used by
-- the inline set editor (both are edited and saved together there).
-- Deletes and reinserts sets within a single transaction so a failed
-- insert never leaves the exercise with zero sets.
create or replace function public.save_workout_exercise_configuration(
  p_workout_exercise_id uuid,
  p_rest_seconds integer,
  p_sets jsonb
) returns void
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = p_workout_exercise_id and w.user_id = auth.uid()
  ) then
    raise exception 'Exercício não encontrado.';
  end if;

  if not exists (select 1 from jsonb_array_elements(coalesce(p_sets, '[]'::jsonb))) then
    raise exception 'O exercício precisa de pelo menos uma série.';
  end if;

  delete from public.workout_exercise_sets where workout_exercise_id = p_workout_exercise_id;

  insert into public.workout_exercise_sets (workout_exercise_id, set_number, target_weight_kg, target_repetitions)
  select
    p_workout_exercise_id,
    (s ->> 'setNumber')::integer,
    nullif(s ->> 'targetWeightKg', '')::numeric,
    (s ->> 'targetRepetitions')::integer
  from jsonb_array_elements(p_sets) s;

  update public.workout_exercises
  set rest_seconds = p_rest_seconds, updated_at = now()
  where id = p_workout_exercise_id;
end;
$$;

revoke all on function public.save_workout_exercise_configuration(uuid, integer, jsonb) from public;
grant execute on function public.save_workout_exercise_configuration(uuid, integer, jsonb) to authenticated;
