"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ageStepSchema, type AgeStepFormValues, type AgeStepInput } from "../domain/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuffixedInput } from "@/components/shared/suffixed-input";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface AgeStepProps {
  defaultValues: Partial<AgeStepInput>;
  onSubmit: (values: AgeStepInput) => void;
}

export function AgeStep({ defaultValues, onSubmit }: AgeStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgeStepFormValues, unknown, AgeStepInput>({
    resolver: zodResolver(ageStepSchema),
    defaultValues: { age: defaultValues.age as AgeStepFormValues["age"] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">Qual é a sua idade?</h1>
      <p className="mt-2 text-base leading-relaxed text-ink-700">
        A idade é necessária para estimarmos seu metabolismo.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="age">Idade</Label>
        <SuffixedInput
          id="age"
          suffix="anos"
          type="number"
          inputMode="numeric"
          step={1}
          aria-invalid={!!errors.age}
          aria-describedby={errors.age ? "age-error" : undefined}
          {...register("age")}
        />
        <FieldError id="age-error" message={errors.age?.message} />
      </div>

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
