"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weightStepSchema } from "../domain/schema";
import { z } from "zod";
import { useStepSubmit } from "../hooks/use-step-submit";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuffixedInput } from "@/components/shared/suffixed-input";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

type WeightFormValues = z.input<typeof weightStepSchema>;
export type WeightStepResult = z.output<typeof weightStepSchema>;

interface WeightStepProps {
  defaultValue?: number | null;
  onSubmit: (values: WeightStepResult) => void;
}

export function WeightStep({ defaultValue, onSubmit }: WeightStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeightFormValues, unknown, WeightStepResult>({
    resolver: zodResolver(weightStepSchema),
    defaultValues: { weightKg: defaultValue != null ? String(defaultValue) : "" },
  });
  const { isNavigating, handleValidSubmit } = useStepSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">Qual é o seu peso atual?</h1>

      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="weightKg">Peso</Label>
        <SuffixedInput
          id="weightKg"
          suffix="kg"
          type="text"
          inputMode="decimal"
          placeholder="70,5"
          aria-invalid={!!errors.weightKg}
          aria-describedby={errors.weightKg ? "weightKg-error" : undefined}
          {...register("weightKg")}
        />
        <FieldError id="weightKg-error" message={errors.weightKg?.message} />
      </div>

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block loading={isNavigating}>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
