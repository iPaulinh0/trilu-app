"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { customExerciseFormSchema, type CustomExerciseFormInput, type CustomExerciseFormValues } from "../domain/custom-exercise";
import { customExerciseToCatalogItem } from "../domain/custom-exercise-mapper";
import { customExerciseRepository } from "@/lib/services";
import { MuscleGroupSelect } from "./muscle-group-select";
import { MuscleGroupChips } from "./muscle-group-chips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import type { ExerciseCatalogItem } from "../domain/types";

interface CustomExerciseFormProps {
  defaultName?: string;
  onCreated: (item: ExerciseCatalogItem) => void;
}

export function CustomExerciseForm({ defaultName = "", onCreated }: CustomExerciseFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomExerciseFormInput, unknown, CustomExerciseFormValues>({
    resolver: zodResolver(customExerciseFormSchema),
    defaultValues: {
      name: defaultName,
      primaryMuscleGroup: undefined,
      secondaryMuscleGroups: [],
      equipment: "",
      instructions: "",
      defaultRestSeconds: 60,
    },
  });

  const primaryMuscleGroup = watch("primaryMuscleGroup");

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await customExerciseRepository.create(values);
      toast.success("Exercício personalizado criado.");
      onCreated(customExerciseToCatalogItem(created));
    } catch {
      toast.error("Não foi possível criar o exercício agora.");
    }
  });

  return (
    <form id="custom-exercise-form" onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-exercise-name">Nome</Label>
        <Input id="custom-exercise-name" placeholder="Ex.: Remada curvada na banda" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-exercise-muscle">Grupo muscular principal</Label>
        <Controller
          control={control}
          name="primaryMuscleGroup"
          render={({ field }) => (
            <MuscleGroupSelect id="custom-exercise-muscle" value={field.value} onChange={field.onChange} />
          )}
        />
        <FieldError message={errors.primaryMuscleGroup?.message} />
      </div>

      <Controller
        control={control}
        name="secondaryMuscleGroups"
        render={({ field }) => (
          <MuscleGroupChips value={field.value ?? []} onChange={field.onChange} exclude={primaryMuscleGroup} />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-exercise-equipment">Equipamento (opcional)</Label>
        <Input id="custom-exercise-equipment" placeholder="Ex.: Halteres" {...register("equipment")} />
        <FieldError message={errors.equipment?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-exercise-instructions">Instruções (opcional)</Label>
        <Input id="custom-exercise-instructions" placeholder="Como executar o movimento" {...register("instructions")} />
        <FieldError message={errors.instructions?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-exercise-rest">Descanso padrão (segundos)</Label>
        <Input id="custom-exercise-rest" type="number" inputMode="numeric" {...register("defaultRestSeconds")} />
      </div>

      <Button type="submit" form="custom-exercise-form" variant="accent" size="lg" block loading={isSubmitting}>
        Criar exercício
      </Button>
    </form>
  );
}
