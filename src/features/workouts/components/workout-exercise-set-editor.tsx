"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { workoutExerciseSetSchema, workoutExerciseSetCountSchema } from "../domain/schema";
import { REST_PRESETS_SECONDS, WORKOUT_EXERCISE_SET_COUNT_MAX, WORKOUT_EXERCISE_SET_COUNT_MIN } from "../domain/types";
import type { WorkoutTemplateExercise } from "../domain/types";
import { workoutRepository } from "@/lib/services";
import { TargetSetRow } from "./target-set-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const setsFormSchema = z.object({
  sets: z.array(workoutExerciseSetSchema).min(1, "Adicione pelo menos uma série."),
});
type SetsFormInput = z.input<typeof setsFormSchema>;
type SetsFormValues = z.output<typeof setsFormSchema>;

interface WorkoutExerciseSetEditorProps {
  exercise: WorkoutTemplateExercise;
  onSaved: (exercise: WorkoutTemplateExercise) => void;
}

function toFieldDefault(weight: number | null | undefined, reps: number) {
  return { targetWeightKg: weight != null ? String(weight) : "", targetRepetitions: String(reps) };
}

export function WorkoutExerciseSetEditor({ exercise, onSaved }: WorkoutExerciseSetEditorProps) {
  const fallbackReps = exercise.targetRepMax || 10;
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SetsFormInput, unknown, SetsFormValues>({
    resolver: zodResolver(setsFormSchema),
    defaultValues: {
      sets:
        exercise.sets.length > 0
          ? exercise.sets.map((s) => toFieldDefault(s.targetWeightKg, s.targetRepetitions))
          : [toFieldDefault(null, fallbackReps)],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "sets" });

  const [restSeconds, setRestSeconds] = useState(exercise.defaultRestSeconds);
  const [customRest, setCustomRest] = useState(String(exercise.defaultRestSeconds));
  const [isSaving, setIsSaving] = useState(false);
  const [countInput, setCountInput] = useState(String(fields.length));
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  function applyCount(nextCount: number) {
    const clamped = Math.min(WORKOUT_EXERCISE_SET_COUNT_MAX, Math.max(WORKOUT_EXERCISE_SET_COUNT_MIN, nextCount));
    const current = fields.length;
    if (clamped > current) {
      const lastReps = getValues(`sets.${current - 1}.targetRepetitions`) ?? String(fallbackReps);
      for (let i = current; i < clamped; i++) append({ targetWeightKg: "", targetRepetitions: lastReps });
    } else if (clamped < current) {
      for (let i = current - 1; i >= clamped; i--) remove(i);
    }
    setCountInput(String(clamped));
  }

  function handleCountChange(raw: string) {
    setCountInput(raw);
    const parsed = workoutExerciseSetCountSchema.safeParse(raw);
    if (!parsed.success) return;
    if (parsed.data < fields.length) {
      setPendingCount(parsed.data);
      return;
    }
    applyCount(parsed.data);
  }

  const isCustomRest = !(REST_PRESETS_SECONDS as readonly number[]).includes(restSeconds);

  const submit = handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const sets = values.sets.map((s, index) => ({
        setNumber: index + 1,
        targetWeightKg: s.targetWeightKg,
        targetRepetitions: s.targetRepetitions,
      }));
      const updated = await workoutRepository.updateExerciseConfiguration({
        workoutExerciseId: exercise.id,
        restSeconds,
        sets,
      });
      toast.success("Configuração salva.");
      onSaved(updated);
    } catch {
      toast.error("Não foi possível salvar agora. Seus dados continuam aqui — tente novamente.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${exercise.id}-set-count`}>Quantidade de séries</Label>
        <Input
          id={`${exercise.id}-set-count`}
          type="number"
          inputMode="numeric"
          min={WORKOUT_EXERCISE_SET_COUNT_MIN}
          max={WORKOUT_EXERCISE_SET_COUNT_MAX}
          value={countInput}
          onChange={(e) => handleCountChange(e.target.value)}
          className="w-24"
        />
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <TargetSetRow
            key={field.id}
            index={index}
            weightProps={register(`sets.${index}.targetWeightKg`)}
            repsProps={register(`sets.${index}.targetRepetitions`)}
            weightError={errors.sets?.[index]?.targetWeightKg?.message}
            repsError={errors.sets?.[index]?.targetRepetitions?.message}
            onRemove={fields.length > WORKOUT_EXERCISE_SET_COUNT_MIN ? () => remove(index) : undefined}
          />
        ))}
      </div>
      <FieldError message={errors.sets?.message} />

      <div className="flex flex-col gap-2">
        <Label>Descanso entre séries</Label>
        <div className="flex flex-wrap items-center gap-2">
          {REST_PRESETS_SECONDS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              aria-pressed={restSeconds === seconds}
              onClick={() => setRestSeconds(seconds)}
              className={cn(
                "min-h-9 rounded-full border-2 px-3 text-sm font-semibold",
                restSeconds === seconds ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 bg-card text-ink-600",
              )}
            >
              {seconds}s
            </button>
          ))}
          <div className="flex items-center gap-1">
            <Input
              type="number"
              inputMode="numeric"
              aria-label="Descanso personalizado, em segundos"
              min={0}
              placeholder="Outro"
              value={isCustomRest ? customRest : ""}
              onChange={(e) => {
                setCustomRest(e.target.value);
                const parsed = Number(e.target.value);
                if (Number.isInteger(parsed) && parsed >= 0) setRestSeconds(parsed);
              }}
              className="h-9 w-20"
            />
            <span className="text-sm text-ink-500">s</span>
          </div>
        </div>
      </div>

      <Button type="button" variant="accent" loading={isSaving} onClick={submit}>
        Salvar configuração
      </Button>

      <AlertDialog open={pendingCount !== null} onOpenChange={(open) => !open && setPendingCount(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover séries?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso remove {fields.length - (pendingCount ?? 0)} série(s) do fim da lista — a carga e as repetições
              configuradas nelas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCountInput(String(fields.length))}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="accent"
              onClick={() => {
                if (pendingCount !== null) applyCount(pendingCount);
                setPendingCount(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
