"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { workoutTemplateFormSchema, type WorkoutTemplateFormInput, type WorkoutTemplateFormValues } from "../domain/schema";
import type { WorkoutTemplateExerciseInput, WorkoutTemplateInput } from "../domain/workout-repository";
import type { ExerciseSource } from "../domain/types";
import { WorkoutExerciseRow } from "./workout-exercise-row";
import { MuscleGroupPicker } from "./muscle-group-picker";
import { ExercisePickerSheet, type AddedExercise } from "@/features/exercises/components/exercise-picker-sheet";
import { ExerciseConfigForm } from "@/features/exercises/components/exercise-config-form";
import { recordExerciseUsage } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export interface WorkoutExerciseDraft {
  key: string;
  exerciseSource: ExerciseSource;
  providerExerciseId: string | null;
  customExerciseId: string | null;
  exerciseNameSnapshot: string;
  gifUrl: string | null;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  notes: string | null;
}

let draftKeyCounter = 0;
function nextDraftKey() {
  draftKeyCounter += 1;
  return `draft-${draftKeyCounter}`;
}

interface WorkoutTemplateFormProps {
  initialValues?: Partial<WorkoutTemplateFormInput>;
  initialExercises?: WorkoutExerciseDraft[];
  onSubmit: (input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]) => Promise<void>;
  submitLabel: string;
}

export function WorkoutTemplateForm({ initialValues, initialExercises = [], onSubmit, submitLabel }: WorkoutTemplateFormProps) {
  const [exercises, setExercises] = useState<WorkoutExerciseDraft[]>(initialExercises);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [exercisesDirty, setExercisesDirty] = useState(false);
  const [groupCount, setGroupCount] = useState<number | undefined>(initialValues?.muscleGroups?.length);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<WorkoutTemplateFormInput, unknown, WorkoutTemplateFormValues>({
    resolver: zodResolver(workoutTemplateFormSchema),
    defaultValues: {
      name: "",
      description: undefined,
      muscleGroups: [],
      ...initialValues,
    },
  });

  const hasUnsavedChanges = isDirty || exercisesDirty;

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const editingExercise = exercises.find((e) => e.key === editingKey) ?? null;

  function handleAddExercise({ exercise, config }: AddedExercise) {
    recordExerciseUsage(exercise);
    setExercises((prev) => [
      ...prev,
      {
        key: nextDraftKey(),
        exerciseSource: exercise.provider,
        providerExerciseId: exercise.provider === "exercisedb" ? exercise.providerId : null,
        customExerciseId: exercise.provider === "custom" ? exercise.providerId : null,
        exerciseNameSnapshot: exercise.displayName,
        gifUrl: exercise.gifUrl,
        defaultSets: config.defaultSets,
        targetRepMin: config.targetRepMin,
        targetRepMax: config.targetRepMax,
        defaultRestSeconds: config.defaultRestSeconds,
        notes: config.notes,
      },
    ]);
    setExercisesDirty(true);
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setExercises((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setExercisesDirty(true);
  }

  function removeExercise(key: string) {
    setExercises((prev) => prev.filter((e) => e.key !== key));
    setExercisesDirty(true);
  }

  const [exerciseListError, setExerciseListError] = useState<string | null>(null);
  const [muscleGroupsError, setMuscleGroupsError] = useState<string | null>(null);

  const submit = handleSubmit(async (values) => {
    let hasError = false;
    if (groupCount !== undefined && values.muscleGroups.length !== groupCount) {
      setMuscleGroupsError(`Selecione mais ${groupCount - values.muscleGroups.length} grupo(s) muscular(es).`);
      hasError = true;
    } else {
      setMuscleGroupsError(null);
    }
    if (exercises.length === 0) {
      setExerciseListError("Adicione pelo menos um exercício.");
      hasError = true;
    } else {
      setExerciseListError(null);
    }
    if (hasError) return;
    setIsSaving(true);
    try {
      const input: WorkoutTemplateInput = {
        name: values.name,
        description: values.description,
        muscleGroups: values.muscleGroups,
      };
      const exerciseInputs: WorkoutTemplateExerciseInput[] = exercises.map((e) => ({
        exerciseSource: e.exerciseSource,
        providerExerciseId: e.providerExerciseId,
        customExerciseId: e.customExerciseId,
        exerciseNameSnapshot: e.exerciseNameSnapshot,
        defaultSets: e.defaultSets,
        targetRepMin: e.targetRepMin,
        targetRepMax: e.targetRepMax,
        defaultRestSeconds: e.defaultRestSeconds,
        notes: e.notes,
      }));
      await onSubmit(input, exerciseInputs);
      setExercisesDirty(false);
    } catch {
      toast.error("Não foi possível salvar o treino. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col gap-5 pb-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="workout-name">Nome do treino</Label>
        <Input id="workout-name" placeholder="Ex.: Treino A · Peito" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="workout-description">Descrição (opcional)</Label>
        <Input id="workout-description" placeholder="Ex.: Peito e tríceps" {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="muscleGroups"
          render={({ field }) => (
            <MuscleGroupPicker
              count={groupCount}
              onCountChange={setGroupCount}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
        <FieldError message={errors.muscleGroups?.message ?? muscleGroupsError ?? undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">EXERCÍCIOS</span>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="min-h-9 rounded-full bg-violet-50 px-3 text-sm font-bold text-violet-600 hover:bg-violet-100"
          >
            + Adicionar exercício
          </button>
        </div>

        {exercises.length === 0 ? (
          <p className="rounded-2xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
            Nenhum exercício adicionado ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {exercises.map((exercise, index) => (
              <WorkoutExerciseRow
                key={exercise.key}
                name={exercise.exerciseNameSnapshot}
                defaultSets={exercise.defaultSets}
                targetRepMin={exercise.targetRepMin}
                targetRepMax={exercise.targetRepMax}
                defaultRestSeconds={exercise.defaultRestSeconds}
                canMoveUp={index > 0}
                canMoveDown={index < exercises.length - 1}
                onMoveUp={() => moveExercise(index, -1)}
                onMoveDown={() => moveExercise(index, 1)}
                onEdit={() => setEditingKey(exercise.key)}
                onRemove={() => removeExercise(exercise.key)}
              />
            ))}
          </div>
        )}
        <FieldError message={exerciseListError ?? undefined} />
      </div>

      <Button type="submit" variant="accent" size="lg" block loading={isSaving} className="mt-2">
        {submitLabel}
      </Button>

      <ExercisePickerSheet open={pickerOpen} onOpenChange={setPickerOpen} onAdd={handleAddExercise} />

      <Dialog open={editingExercise !== null} onOpenChange={(open) => !open && setEditingKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar exercício</DialogTitle>
          </DialogHeader>
          {editingExercise ? (
            <ExerciseConfigForm
              formId="edit-exercise-config-form"
              exercise={{ displayName: editingExercise.exerciseNameSnapshot, gifUrl: editingExercise.gifUrl }}
              initialValues={{
                defaultSets: editingExercise.defaultSets,
                targetRepMin: editingExercise.targetRepMin,
                targetRepMax: editingExercise.targetRepMax,
                defaultRestSeconds: editingExercise.defaultRestSeconds,
                notes: editingExercise.notes ?? "",
              }}
              onSubmit={(config) => {
                setExercises((prev) =>
                  prev.map((e) => (e.key === editingExercise.key ? { ...e, ...config } : e)),
                );
                setExercisesDirty(true);
                setEditingKey(null);
              }}
            />
          ) : null}
          <DialogFooter>
            <Button type="submit" form="edit-exercise-config-form" variant="accent" block>
              Salvar configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
