"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useExerciseSearch } from "../hooks/use-exercise-search";
import type { ExerciseConfigValues } from "@/features/workouts/domain/schema";
import { MUSCLE_GROUP_LABELS, TRILU_MUSCLE_GROUPS, EXERCISE_SEARCH_MIN_LENGTH, type ExerciseCatalogItem, type TriluMuscleGroup } from "../domain/types";
import { ExerciseResultRow } from "./exercise-result-row";
import { ExerciseConfigForm } from "./exercise-config-form";
import { CustomExerciseForm } from "./custom-exercise-form";
import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

export interface AddedExercise {
  exercise: ExerciseCatalogItem;
  config: ExerciseConfigValues;
}

interface ExercisePickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (added: AddedExercise) => void;
}

type Phase = { step: "search" } | { step: "configure"; exercise: ExerciseCatalogItem } | { step: "customCreate" };

export function ExercisePickerSheet({ open, onOpenChange, onAdd }: ExercisePickerSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [phase, setPhase] = useState<Phase>({ step: "search" });
  const { query, setQuery, muscleGroup, setMuscleGroup, items, status, errorMessage, hasMore, loadMore, retry } =
    useExerciseSearch();

  function reset() {
    setPhase({ step: "search" });
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleConfirmConfig(config: ExerciseConfigValues) {
    if (phase.step !== "configure") return;
    onAdd({ exercise: phase.exercise, config });
    toast.success(`"${phase.exercise.displayName}" adicionado ao treino.`);
    setPhase({ step: "search" });
  }

  const title =
    phase.step === "configure" ? "Configurar exercício" : phase.step === "customCreate" ? "Criar exercício" : "Adicionar exercício";

  const body = (
    <div className="flex flex-col gap-4 px-4 pb-2 sm:px-0">
      {phase.step === "search" ? (
        <>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar exercício (ex.: supino)"
              className="pl-9"
              aria-label="Pesquisar exercício"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por grupo muscular">
            {TRILU_MUSCLE_GROUPS.map((group: TriluMuscleGroup) => (
              <button
                key={group}
                type="button"
                aria-pressed={muscleGroup === group}
                onClick={() => setMuscleGroup(muscleGroup === group ? undefined : group)}
                className={cn(
                  "shrink-0 rounded-full border-2 px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  muscleGroup === group ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 bg-card text-ink-600",
                )}
              >
                {MUSCLE_GROUP_LABELS[group]}
              </button>
            ))}
          </div>

          {status === "idle" ? (
            <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
              Digite pelo menos {EXERCISE_SEARCH_MIN_LENGTH} letras ou escolha um grupo muscular.
            </p>
          ) : status === "loading" ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-18 w-full rounded-2xl" />
              ))}
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-ink-50 px-4 py-6 text-center">
              <p className="text-sm text-ink-500">{errorMessage}</p>
              <Button type="button" variant="outline" onClick={retry}>
                Tentar novamente
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-ink-50 px-4 py-6 text-center">
              <p className="text-sm text-ink-500">Não encontrou o exercício?</p>
              <Button type="button" variant="accent" onClick={() => setPhase({ step: "customCreate" })}>
                Criar exercício personalizado
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <ExerciseResultRow
                  key={`${item.provider}:${item.providerId}`}
                  exercise={item}
                  onSelect={() => setPhase({ step: "configure", exercise: item })}
                />
              ))}
              {hasMore ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadMore}
                  loading={status === "loadingMore"}
                  className="mt-1"
                >
                  Carregar mais
                </Button>
              ) : null}
              <button
                type="button"
                onClick={() => setPhase({ step: "customCreate" })}
                className="mt-1 text-center text-sm font-bold text-violet-600 hover:underline"
              >
                Não encontrou? Criar exercício personalizado
              </button>
            </div>
          )}
        </>
      ) : phase.step === "configure" ? (
        <ExerciseConfigForm
          formId="exercise-config-form"
          exercise={{
            displayName: phase.exercise.displayName,
            gifUrl: phase.exercise.gifUrl,
            subtitle: MUSCLE_GROUP_LABELS[phase.exercise.primaryMuscleGroup],
          }}
          onSubmit={handleConfirmConfig}
        />
      ) : (
        <CustomExerciseForm
          defaultName={query}
          onCreated={(item) => setPhase({ step: "configure", exercise: item })}
        />
      )}
    </div>
  );

  const footer =
    phase.step === "configure" ? (
      <Button type="submit" form="exercise-config-form" variant="accent" size="lg" block>
        Adicionar ao treino
      </Button>
    ) : phase.step === "customCreate" ? null : null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Escolha um exercício para adicionar ao seu treino.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">{body}</div>
          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>Escolha um exercício para adicionar ao seu treino.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto">{body}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  );
}
