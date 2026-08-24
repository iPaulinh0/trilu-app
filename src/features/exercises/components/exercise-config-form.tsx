"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseConfigSchema, type ExerciseConfigFormInput, type ExerciseConfigValues } from "@/features/workouts/domain/schema";
import { ExerciseGif } from "./exercise-gif";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";

interface ExerciseConfigFormProps {
  formId: string;
  exercise: { displayName: string; gifUrl: string | null; subtitle?: string };
  initialValues?: Partial<ExerciseConfigFormInput>;
  onSubmit: (config: ExerciseConfigValues) => void;
}

const DEFAULTS: ExerciseConfigFormInput = {
  defaultSets: 3,
  targetRepMin: 8,
  targetRepMax: 12,
  defaultRestSeconds: 60,
  notes: "",
};

export function ExerciseConfigForm({ formId, exercise, initialValues, onSubmit }: ExerciseConfigFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseConfigFormInput, unknown, ExerciseConfigValues>({
    resolver: zodResolver(exerciseConfigSchema),
    defaultValues: { ...DEFAULTS, ...initialValues },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ExerciseGif gifUrl={exercise.gifUrl} alt={exercise.displayName} className="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate font-body text-base font-bold text-ink-900">{exercise.displayName}</p>
          {exercise.subtitle ? <p className="truncate text-sm text-ink-500">{exercise.subtitle}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${formId}-sets`}>Séries</Label>
          <Input id={`${formId}-sets`} type="number" inputMode="numeric" {...register("defaultSets")} />
          <FieldError message={errors.defaultSets?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${formId}-rest`}>Descanso (s)</Label>
          <Input id={`${formId}-rest`} type="number" inputMode="numeric" {...register("defaultRestSeconds")} />
          <FieldError message={errors.defaultRestSeconds?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${formId}-rep-min`}>Repetições (min)</Label>
          <Input id={`${formId}-rep-min`} type="number" inputMode="numeric" {...register("targetRepMin")} />
          <FieldError message={errors.targetRepMin?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${formId}-rep-max`}>Repetições (máx)</Label>
          <Input id={`${formId}-rep-max`} type="number" inputMode="numeric" {...register("targetRepMax")} />
          <FieldError message={errors.targetRepMax?.message} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${formId}-notes`}>Observação (opcional)</Label>
        <Input id={`${formId}-notes`} placeholder="Ex.: pegada fechada" {...register("notes")} />
      </div>
    </form>
  );
}
