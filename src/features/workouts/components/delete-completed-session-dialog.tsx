"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCompletedSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  onConfirm: () => void;
}

/** Deleting a completed session is destructive — unlike archiving a workout template, this removes real history and reverts the trail step it earned. */
export function DeleteCompletedSessionDialog({ open, onOpenChange, workoutName, onConfirm }: DeleteCompletedSessionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{workoutName}” de hoje?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso remove esse registro do seu histórico e desfaz o passo que ele rendeu na sua trilha. Essa
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="accent" onClick={onConfirm}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
