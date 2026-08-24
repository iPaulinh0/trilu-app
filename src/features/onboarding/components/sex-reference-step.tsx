"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sexForBmrStepSchema, type SexForBmrStepInput } from "../domain/schema";
import { Button } from "@/components/ui/button";
import { OptionCard } from "@/components/shared/option-card";
import { FieldError } from "@/components/shared/field-error";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface SexReferenceStepProps {
  defaultValues: Partial<SexForBmrStepInput>;
  onSubmit: (values: SexForBmrStepInput) => void;
}

export function SexReferenceStep({ defaultValues, onSubmit }: SexReferenceStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SexForBmrStepInput>({
    resolver: zodResolver(sexForBmrStepSchema),
    defaultValues: { sexForBmr: defaultValues.sexForBmr },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold leading-snug text-ink-900">
        Qual referência devemos usar no cálculo?
      </h1>
      <p className="mt-2 text-base leading-relaxed text-ink-700">
        A equação metabólica utiliza referências feminina ou masculina. Essa informação será
        usada apenas para gerar a estimativa.
      </p>

      <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="Referência do cálculo">
        <Controller
          control={control}
          name="sexForBmr"
          render={({ field }) => (
            <>
              <OptionCard
                name="sexForBmr"
                title="Referência feminina"
                selected={field.value === "female"}
                onSelect={() => field.onChange("female")}
              />
              <OptionCard
                name="sexForBmr"
                title="Referência masculina"
                selected={field.value === "male"}
                onSelect={() => field.onChange("male")}
              />
            </>
          )}
        />
      </div>
      <FieldError message={errors.sexForBmr?.message} />

      <BottomActionArea>
        <Button type="submit" variant="accent" size="lg" block>
          Continuar
        </Button>
      </BottomActionArea>
    </form>
  );
}
