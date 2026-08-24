"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ExitSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAsDraft: () => void;
  onDiscard: () => void;
}

export function ExitSessionDialog({ open, onOpenChange, onSaveAsDraft, onDiscard }: ExitSessionDialogProps) {
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmingDiscard(false);
    onOpenChange(next);
  }

  return (
    <>
      <Dialog open={open && !confirmingDiscard} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sair do treino?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-ink-600">Seu progresso já está salvo. O que você quer fazer?</p>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="button" variant="accent" block onClick={() => handleOpenChange(false)}>
              Continuar treino
            </Button>
            <Button type="button" variant="outline" block onClick={onSaveAsDraft}>
              Salvar como rascunho
            </Button>
            <Button
              type="button"
              variant="ghost"
              block
              onClick={() => setConfirmingDiscard(true)}
              className="text-[var(--status-danger)]"
            >
              Descartar treino
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmingDiscard} onOpenChange={(next) => !next && setConfirmingDiscard(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar este treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Todas as séries registradas nesta sessão serão perdidas. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction variant="accent" onClick={onDiscard}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
