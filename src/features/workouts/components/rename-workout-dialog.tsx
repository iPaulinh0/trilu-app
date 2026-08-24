"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WORKOUT_NAME_MAX_LENGTH, WORKOUT_NAME_MIN_LENGTH } from "../domain/types";

interface RenameWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onConfirm: (name: string) => Promise<void>;
}

export function RenameWorkoutDialog({ open, onOpenChange, currentName, onConfirm }: RenameWorkoutDialogProps) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Resets the draft to the current name whenever the dialog opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(currentName);
    setError(null);
  }, [open, currentName]);

  async function handleConfirm() {
    const trimmed = name.trim();
    if (trimmed.length < WORKOUT_NAME_MIN_LENGTH || trimmed.length > WORKOUT_NAME_MAX_LENGTH) {
      setError(`Use entre ${WORKOUT_NAME_MIN_LENGTH} e ${WORKOUT_NAME_MAX_LENGTH} caracteres.`);
      return;
    }
    setIsSaving(true);
    try {
      await onConfirm(trimmed);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear treino</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rename-workout">Nome</Label>
          <Input id="rename-workout" value={name} onChange={(e) => setName(e.target.value)} />
          <FieldError message={error ?? undefined} />
        </div>
        <DialogFooter>
          <Button type="button" variant="accent" block loading={isSaving} onClick={handleConfirm}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
