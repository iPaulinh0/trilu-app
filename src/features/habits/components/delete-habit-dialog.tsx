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

interface DeleteHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitName: string;
  onConfirm: () => void;
}

export function DeleteHabitDialog({ open, onOpenChange, habitName, onConfirm }: DeleteHabitDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “{habitName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            Os passos que você já conquistou com esse hábito continuam na sua trilha. Só o hábito
            deixa de aparecer na sua lista.
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
