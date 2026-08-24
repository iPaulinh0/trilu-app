"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsIcon, ChevronRightIcon, LogOutIcon } from "lucide-react";
import { useProfile } from "../hooks/use-profile";
import { profileRepository } from "@/lib/services";
import { ProfileAvatar } from "./profile-avatar";
import { EditProfileSheet } from "./edit-profile-sheet";
import { SettingsSheet } from "./settings-sheet";
import { LogoutDialog } from "./logout-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";
import type { ProfileFormValues } from "../domain/schema";

export function ProfileScreen() {
  const { profile, status, reload } = useProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (status === "loading" || !profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <Skeleton className="size-26 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="mt-4 h-12 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Mascot size={110} />
        <h1 className="text-xl font-bold text-ink-900">Não conseguimos carregar seu perfil.</h1>
        <Button type="button" variant="accent" onClick={reload}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const currentEmail = profile.email;

  async function handleUpdateProfile(values: ProfileFormValues) {
    const emailChanged = values.email !== currentEmail;
    try {
      await profileRepository.updateProfile(values);
      await reload();
      toast.success(
        emailChanged
          ? "Perfil atualizado. Confirme o novo e-mail para concluir a troca."
          : "Perfil atualizado com sucesso.",
      );
    } catch {
      toast.error("Não foi possível atualizar seu perfil agora.");
      throw new Error("update-profile-failed");
    }
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <header>
        <h1 className="text-2xl font-bold text-ink-900">Perfil</h1>
        <p className="text-sm text-ink-500">Seu espaço no TRILU.</p>
      </header>

      <ProfileAvatar profile={profile} onProfileUpdated={reload} />

      <div className="text-center">
        <p className="text-lg font-bold text-ink-900">{profile.name}</p>
        <p className="text-sm text-ink-500">{profile.email}</p>
      </div>

      <Button type="button" variant="outline" block onClick={() => setEditOpen(true)}>
        Editar perfil
      </Button>

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="flex min-h-11 items-center gap-3 rounded-2xl border border-ink-100 bg-card p-4 text-left shadow-card transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <SettingsIcon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink-900">Configurações</span>
          <span className="block text-sm text-ink-500">Tema e aparência</span>
        </span>
        <ChevronRightIcon className="size-5 shrink-0 text-ink-400" aria-hidden />
      </button>

      <Button
        type="button"
        variant="ghostDestructive"
        block
        className="h-12"
        onClick={() => setLogoutOpen(true)}
      >
        <LogOutIcon className="size-4" aria-hidden />
        Sair
      </Button>

      <EditProfileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={{ name: profile.name, email: profile.email }}
        onSubmit={handleUpdateProfile}
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}
