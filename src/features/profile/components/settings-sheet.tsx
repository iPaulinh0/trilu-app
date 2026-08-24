"use client";

import { useTheme } from "next-themes";
import { preferencesRepository } from "@/lib/services";
import { useMediaQuery } from "@/lib/use-media-query";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ThemePreference } from "../domain/types";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * next-themes (already wired in the root layout) is the single source of
 * truth for what's actually rendered — the switch reads/writes `useTheme()`
 * directly. PreferencesRepository is updated alongside it purely as the
 * per-user domain record the spec's UserPreferences model calls for (e.g.
 * for a future backend sync); it never drives the visible theme itself.
 */
export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  function handleToggle(checked: boolean) {
    const next: ThemePreference = checked ? "dark" : "light";
    setTheme(next);
    preferencesRepository.updateTheme(next).catch(() => {
      // Best-effort domain mirror — the theme is already applied above.
    });
  }

  const title = "Configurações";
  const description = "Tema e aparência";

  const body = (
    <div className="flex flex-col gap-4 px-4 pb-2 sm:px-0">
      <label
        htmlFor="dark-theme-switch"
        className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-card px-4 py-3"
      >
        <span className="text-sm font-bold text-ink-900">Tema escuro</span>
        <Switch id="dark-theme-switch" checked={isDark} onCheckedChange={handleToggle} aria-label="Tema escuro" />
      </label>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto pb-4">{body}</div>
      </DrawerContent>
    </Drawer>
  );
}
