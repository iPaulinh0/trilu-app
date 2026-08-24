"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalStepSchema, type GoalStepInput } from "../domain/schema";
import { GOAL_OPTIONS } from "../domain/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionCard } from "@/components/shared/option-card";
import { FieldError } from "@/components/shared/field-error";
import { MascotBubble } from "@/components/shared/mascot-bubble";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface GoalStepProps {
  defaultValues: Partial<GoalStepInput>;
  onSubmit: (values: GoalStepInput) => void;
}

export function GoalStep({ defaultValues, onSubmit }: GoalStepProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GoalStepInput>({
    resolver: zodResolver(goalStepSchema),
    defaultValues: { goal: defaultValues.goal, customGoal: defaultValues.customGoal ?? "" },
  });

  const goal = watch("goal");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">
        Qual é o seu próximo objetivo?
      </h1>

      <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="Objetivo">
        <Controller
          control={control}
          name="goal"
          render={({ field }) => (
            <>
              {GOAL_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  name="goal"
                  title={option.label}
                  selected={field.value === option.value}
                  onSelect={() => field.onChange(option.value)}
                />
              ))}
            </>
          )}
        />
      </div>
      <FieldError message={errors.goal?.message} />

      {goal === "outro" ? (
        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor="customGoal">Qual é o seu objetivo?</Label>
          <Controller
            control={control}
            name="customGoal"
            render={({ field }) => (
              <Input id="customGoal" placeholder="Conte com suas palavras" {...field} />
            )}
          />
          <FieldError message={errors.customGoal?.message} />
        </div>
      ) : null}

      <div className="mt-6">
        <MascotBubble message="Dá pra mudar depois. Comece pelo que cabe hoje." />
      </div>

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
