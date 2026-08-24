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

interface DeleteWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutName: string;
  onConfirm: () => void;
}

export function DeleteWorkoutDialog({ open, onOpenChange, workoutName, onConfirm }: DeleteWorkoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{workoutName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            O histórico de treinos já concluídos com esse nome continua guardado. Só o treino deixa de
            aparecer na sua lista.
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
