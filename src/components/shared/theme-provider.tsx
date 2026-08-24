"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Thin wrapper around next-themes — the theme provider this project already
 * depends on (see package.json / src/components/ui/sonner.tsx, which reads
 * `useTheme()`). `enableSystem={false}` because UserPreferences only models
 * "light" | "dark" (no "system"); the Settings screen offers a single
 * light/dark switch, not a three-way choice.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="trilu.theme.v1">
      {children}
    </NextThemeProvider>
  );
}
