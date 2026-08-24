"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activityLevelStepSchema, type ActivityLevelStepInput } from "../domain/schema";
import { ACTIVITY_LEVEL_OPTIONS } from "../domain/types";
import { Button } from "@/components/ui/button";
import { OptionCard } from "@/components/shared/option-card";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface ActivityStepProps {
  defaultValues: Partial<ActivityLevelStepInput>;
  onSubmit: (values: ActivityLevelStepInput) => void;
}

export function ActivityStep({ defaultValues, onSubmit }: ActivityStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityLevelStepInput>({
    resolver: zodResolver(activityLevelStepSchema),
    defaultValues: { activityLevel: defaultValues.activityLevel },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">
        Como é sua rotina de atividade física?
      </h1>

      <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="Nível de atividade física">
        <Controller
          control={control}
          name="activityLevel"
          render={({ field }) => (
            <>
              {ACTIVITY_LEVEL_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="activityLevel"
                  title={option.title}
                  description={option.description}
                  selected={field.value === option.value}
                  onSelect={() => field.onChange(option.value)}
                />
              ))}
            </>
          )}
        />
      </div>
      <FieldError message={errors.activityLevel?.message} />

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
