"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { CameraIcon, Loader2Icon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileImageStorage, profileRepository } from "@/lib/services";
import { validateProfileImageFile, ImageValidationError } from "../domain/image-validation";
import { processProfileImage } from "../domain/image-processing";
import { cn } from "@/lib/utils";
import type { UserProfile } from "../domain/types";

interface ProfileAvatarProps {
  profile: UserProfile;
  onProfileUpdated: () => void;
}

type PreviewState = { phase: "idle" } | { phase: "previewing"; blob: Blob; objectUrl: string } | { phase: "error"; message: string };

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function ProfileAvatar({ profile, onProfileUpdated }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewState>({ phase: "idle" });
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isBusy = isUploading || isRemoving;

  function openFilePicker() {
    if (isBusy) return; // never allow a second upload while one is in flight
    inputRef.current?.click();
  }

  function clearPreview() {
    if (preview.phase === "previewing") URL.revokeObjectURL(preview.objectUrl);
    setPreview({ phase: "idle" });
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = ""; // allow re-selecting the same file later
    if (!file || isBusy) return;

    try {
      await validateProfileImageFile(file);
      const blob = await processProfileImage(file);
      const objectUrl = URL.createObjectURL(blob);
      setPreview({ phase: "previewing", blob, objectUrl });
    } catch (error) {
      const message = error instanceof ImageValidationError ? error.message : "Não foi possível processar essa imagem.";
      setPreview({ phase: "error", message });
    }
  }

  async function confirmUpload() {
    if (preview.phase !== "previewing" || isBusy) return;
    setIsUploading(true);
    const previousKey = profile.avatarStorageKey;
    try {
      const { key } = await profileImageStorage.upload({ blob: preview.blob, contentType: preview.blob.type });
      await profileRepository.updateAvatarStorageKey(key);
      // Only remove the previous image after the new one is confirmed saved.
      if (previousKey) await profileImageStorage.remove(previousKey);
      clearPreview();
      onProfileUpdated();
      toast.success("Foto de perfil atualizada.");
    } catch {
      toast.error("Não foi possível enviar a foto agora.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    if (!profile.avatarStorageKey || isBusy) return;
    setIsRemoving(true);
    const key = profile.avatarStorageKey;
    try {
      await profileRepository.updateAvatarStorageKey(null);
      await profileImageStorage.remove(key);
      onProfileUpdated();
      toast.success("Foto de perfil removida.");
    } catch {
      toast.error("Não foi possível remover a foto agora.");
    } finally {
      setIsRemoving(false);
    }
  }

  const displaySrc = preview.phase === "previewing" ? preview.objectUrl : profile.avatarUrl;
  const initials = getInitials(profile.name);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="size-26 border-2 border-card shadow-card">
          {displaySrc ? <AvatarImage src={displaySrc} alt={`Foto de perfil de ${profile.name || "usuário"}`} /> : null}
          <AvatarFallback className="bg-violet-100 font-display text-3xl font-bold text-violet-700">
            {initials || <UserIcon className="size-10" aria-hidden />}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={openFilePicker}
          disabled={isBusy}
          aria-label="Alterar foto de perfil"
          className={cn(
            "absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border-2 border-card bg-violet-500 text-white shadow-brand transition-transform focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isUploading ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
          ) : (
            <CameraIcon className="size-4" aria-hidden />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileSelected}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {preview.phase === "error" ? (
        <p role="alert" className="text-sm font-semibold text-[var(--status-danger)]">
          {preview.message}
        </p>
      ) : null}

      {preview.phase === "previewing" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearPreview}
            disabled={isUploading}
            className="min-h-11 rounded-full border-2 border-ink-200 px-4 text-sm font-bold text-ink-700 hover:bg-ink-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmUpload}
            disabled={isUploading}
            className="flex min-h-11 items-center gap-2 rounded-full bg-coral-500 px-4 text-sm font-bold text-white shadow-coral disabled:opacity-60"
          >
            {isUploading ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
            Salvar foto
          </button>
        </div>
      ) : profile.avatarStorageKey ? (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isBusy}
          className="min-h-11 px-2 text-sm font-bold text-[var(--status-danger)] hover:underline disabled:opacity-50"
        >
          {isRemoving ? "Removendo..." : "Remover foto"}
        </button>
      ) : null}
    </div>
  );
}
