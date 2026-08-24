"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, workoutSessionRepository } from "@/lib/services";
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

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    workoutSessionRepository.getActiveSession().then((session) => {
      if (!cancelled) setHasActiveSession(session !== null);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
    // Keep the dialog open (and its own loading state visible) until we
    // know whether sign-out actually succeeded — Radix would otherwise
    // close it immediately on click.
    event.preventDefault();
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      // Supabase's own signOut clears its session cookie and fires
      // onAuthStateChange, which every useCurrentUser() subscriber picks up
      // automatically — no manual local cache to clear.
      await authService.signOut();
      router.replace("/");
      router.refresh();
    } catch {
      setIsSigningOut(false);
      toast.error("Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isSigningOut && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair do TRILU?</AlertDialogTitle>
          <AlertDialogDescription>
            Você precisará entrar novamente para acessar sua trilha e seus treinos.
            {hasActiveSession ? " Seu treino em andamento continuará salvo como rascunho." : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="accent" disabled={isSigningOut} onClick={handleConfirm}>
            {isSigningOut ? "Saindo..." : "Sair"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
