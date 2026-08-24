"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitFormSchema, type HabitFormInput, type HabitFormValues } from "../domain/schema";
import { CUSTOM_HABIT_ICON_CHOICES, HABIT_COLORS } from "../domain/types";
import { HabitIcon } from "./habit-icon";
import { HABIT_COLOR_STYLES } from "./habit-color-styles";
import { WeekdayPicker } from "@/components/shared/weekday-picker";
import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const DEFAULT_VALUES: HabitFormInput = {
  name: "",
  description: "",
  icon: "sparkles",
  color: "violet",
  scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6],
};

export interface HabitFormInitialValues {
  name?: string;
  description?: string | null;
  icon?: HabitFormInput["icon"];
  color?: HabitFormInput["color"];
  scheduledWeekdays?: number[];
}

function toFormInput(initialValues?: HabitFormInitialValues): HabitFormInput {
  return {
    ...DEFAULT_VALUES,
    ...initialValues,
    description: initialValues?.description ?? "",
  };
}

interface HabitFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValues?: HabitFormInitialValues;
  onSubmit: (values: HabitFormValues) => Promise<void> | void;
}

export function HabitFormSheet({ open, onOpenChange, mode, initialValues, onSubmit }: HabitFormSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormInput, unknown, HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: toFormInput(initialValues),
  });

  useEffect(() => {
    if (open) reset(toFormInput(initialValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // onSubmit already surfaced its own toast; keep the sheet open so the
      // user can fix the input and retry, instead of an unhandled rejection.
    }
  });

  const title = mode === "create" ? "Novo hábito" : "Editar hábito";
  const description = "Pequenas ações que você quer cumprir no dia a dia.";
  const selectedColor = watch("color");

  const formBody = (
    <form id="habit-form" onSubmit={submit} className="flex flex-col gap-4 px-4 pb-2 sm:px-0">
      <div className="flex flex-col gap-2">
        <Label htmlFor="habit-name">Nome</Label>
        <Input id="habit-name" placeholder="Ex.: Meditar por 10 minutos" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="habit-description">Descrição (opcional)</Label>
        <Input
          id="habit-description"
          placeholder="Uma frase curta"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">ÍCONE</span>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ícone do hábito">
              {CUSTOM_HABIT_ICON_CHOICES.map((iconKey) => (
                <button
                  key={iconKey}
                  type="button"
                  role="radio"
                  aria-checked={field.value === iconKey}
                  aria-label={iconKey}
                  onClick={() => field.onChange(iconKey)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
                    field.value === iconKey
                      ? `${HABIT_COLOR_STYLES[selectedColor].bg} ${HABIT_COLOR_STYLES[selectedColor].text} border-transparent ring-2 ${HABIT_COLOR_STYLES[selectedColor].ring}`
                      : "border-ink-200 bg-card text-ink-500",
                  )}
                >
                  <HabitIcon icon={iconKey} className="size-5" />
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">COR</span>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex gap-2" role="radiogroup" aria-label="Cor do hábito">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={field.value === color}
                  aria-label={color}
                  onClick={() => field.onChange(color)}
                  className={cn(
                    "size-9 rounded-full border-2 transition-transform",
                    HABIT_COLOR_STYLES[color].solid,
                    field.value === color ? "scale-110 border-ink-900" : "border-transparent",
                  )}
                />
              ))}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="scheduledWeekdays"
        render={({ field }) => <WeekdayPicker value={field.value} onChange={field.onChange} />}
      />
      <FieldError message={errors.scheduledWeekdays?.message} />
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {formBody}
          <DialogFooter>
            <Button type="submit" form="habit-form" variant="accent" block loading={isSubmitting}>
              Salvar hábito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto">{formBody}</div>
        <DrawerFooter>
          <Button type="submit" form="habit-form" variant="accent" size="lg" block loading={isSubmitting}>
            Salvar hábito
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
