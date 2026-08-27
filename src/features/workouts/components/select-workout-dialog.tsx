"use client";

import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type { WorkoutListItem } from "../hooks/use-workouts";

interface SelectWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WorkoutListItem[];
}

/** Lets the user pick another registered workout to do — opened from the "start another workout today" FAB. */
export function SelectWorkoutDialog({ open, onOpenChange, items }: SelectWorkoutDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const router = useRouter();

  function selectWorkout(id: string) {
    onOpenChange(false);
    router.push(`/treinos/${id}`);
  }

  const body = (
    <div className="px-4 pb-2 sm:px-0">
      {items.length === 0 ? (
        <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
          Você ainda não tem outros treinos cadastrados.
        </p>
      ) : (
        <div className="flex flex-col rounded-2xl bg-ink-50 px-2">
          {items.map((item, index) => (
            <div key={item.template.id}>
              {index > 0 ? <Separator /> : null}
              <button
                type="button"
                onClick={() => selectWorkout(item.template.id)}
                className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-2 py-3 text-left active:bg-card focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-bold text-ink-900">{item.template.name}</p>
                  <p className="text-xs text-ink-500">
                    {item.exerciseCount} {item.exerciseCount === 1 ? "exercício" : "exercícios"}
                  </p>
                </div>
                <ChevronRightIcon className="size-4 shrink-0 text-ink-300" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escolher treino</DialogTitle>
            <DialogDescription>Selecione um treino para fazer agora.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">{body}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Escolher treino</DrawerTitle>
          <DrawerDescription>Selecione um treino para fazer agora.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto">{body}</div>
      </DrawerContent>
    </Drawer>
  );
}
