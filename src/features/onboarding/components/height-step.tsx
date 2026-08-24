"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heightStepSchema, type HeightStepFormValues, type HeightStepInput } from "../domain/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuffixedInput } from "@/components/shared/suffixed-input";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface HeightStepProps {
  defaultValues: Partial<HeightStepInput>;
  onSubmit: (values: HeightStepInput) => void;
}

export function HeightStep({ defaultValues, onSubmit }: HeightStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeightStepFormValues, unknown, HeightStepInput>({
    resolver: zodResolver(heightStepSchema),
    defaultValues: { heightCm: defaultValues.heightCm as HeightStepFormValues["heightCm"] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">Qual é a sua altura?</h1>

      <div className="mt-6 flex flex-col gap-2">
        <Label htmlFor="heightCm">Altura</Label>
        <SuffixedInput
          id="heightCm"
          suffix="cm"
          type="number"
          inputMode="numeric"
          step={1}
          placeholder="175"
          aria-invalid={!!errors.heightCm}
          aria-describedby={errors.heightCm ? "heightCm-error" : undefined}
          {...register("heightCm")}
        />
        <FieldError id="heightCm-error" message={errors.heightCm?.message} />
      </div>

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
