"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { frequencySelectionSchema, type FrequencySelection } from "../domain/schema";
import { WEEKLY_FREQUENCY_MAX, WEEKLY_FREQUENCY_MIN } from "../domain/types";
import { Button } from "@/components/ui/button";
import { NumberChip } from "@/components/shared/number-chip";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";
import { cn } from "@/lib/utils";

const frequencyFormSchema = z.object({ selection: frequencySelectionSchema });
type FrequencyFormValues = z.infer<typeof frequencyFormSchema>;

export interface FrequencyStepResult {
  weeklyFrequency: number | null;
}

interface FrequencyStepProps {
  defaultSelection?: FrequencySelection;
  onSubmit: (result: FrequencyStepResult) => void;
}

const WEEK_NUMBERS = Array.from(
  { length: WEEKLY_FREQUENCY_MAX - WEEKLY_FREQUENCY_MIN + 1 },
  (_, i) => WEEKLY_FREQUENCY_MIN + i,
);

export function FrequencyStep({ defaultSelection, onSubmit }: FrequencyStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FrequencyFormValues>({
    resolver: zodResolver(frequencyFormSchema),
    defaultValues: { selection: defaultSelection },
  });

  const submit = handleSubmit(({ selection }) => {
    onSubmit({ weeklyFrequency: selection === "unknown" ? null : Number(selection) });
  });

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">
        Quantas vezes por semana você pretende treinar?
      </h1>
      <p className="mt-2 text-base leading-relaxed text-ink-700">
        Escolha uma meta possível para a sua rotina. Você poderá mudar isso depois.
      </p>

      <Controller
        control={control}
        name="selection"
        render={({ field }) => (
          <>
            <div className="mt-6 grid grid-cols-4 gap-3" role="radiogroup" aria-label="Vezes por semana">
              {WEEK_NUMBERS.map((n) => (
                <NumberChip
                  key={n}
                  value={n}
                  selected={field.value === String(n)}
                  onSelect={() => field.onChange(String(n))}
                />
              ))}
            </div>

            <button
              type="button"
              role="radio"
              aria-checked={field.value === "unknown"}
              onClick={() => field.onChange("unknown")}
              className={cn(
                "mt-3 flex min-h-[44px] w-full items-center justify-center rounded-2xl border-2 px-4 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
                field.value === "unknown"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-ink-200 bg-card text-ink-900 hover:border-ink-300",
              )}
            >
              Ainda não sei
            </button>
          </>
        )}
      />
      <div className="mt-2">
        <FieldError message={errors.selection?.message} />
      </div>

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
