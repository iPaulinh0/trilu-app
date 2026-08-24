/**
 * Pure domain types for habits. No React, no DOM, no Next.js — a habit's
 * completion status is never stored on the habit itself (it changes daily);
 * see HabitEntry for that.
 */

export type { Weekday } from "@/lib/weekdays";
export { ALL_WEEKDAYS, WEEKDAY_LABELS } from "@/lib/weekdays";

export const HABIT_ICON_KEYS = [
  "brain",
  "bookOpen",
  "bookmark",
  "activity",
  "droplet",
  "footprints",
  "moon",
  "utensils",
  "listChecks",
  "pill",
  "sparkles",
  "star",
  "target",
  "heart",
  "flame",
  "sun",
] as const;
export type HabitIconKey = (typeof HABIT_ICON_KEYS)[number];

export const HABIT_COLORS = ["violet", "coral", "mint", "sun"] as const;
export type HabitColor = (typeof HABIT_COLORS)[number];


export const MAX_ACTIVE_HABITS = 8;
export const HABIT_NAME_MIN_LENGTH = 2;
export const HABIT_NAME_MAX_LENGTH = 50;

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  icon: HabitIconKey;
  color: HabitColor;
  scheduledWeekdays: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** One completion record for one habit on one calendar day (local date). */
export interface HabitEntry {
  id: string;
  habitId: string;
  userId: string;
  dateKey: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitSuggestion {
  key: string;
  name: string;
  description: string;
  icon: HabitIconKey;
  color: HabitColor;
}

/** The first-run habit setup suggestions — brand copy from the product brief. */
export const HABIT_SUGGESTIONS: HabitSuggestion[] = [
  { key: "meditar", name: "Meditar", description: "Meditar por 10 minutos", icon: "brain", color: "violet" },
  { key: "estudar", name: "Estudar", description: "Estudar inglês", icon: "bookOpen", color: "violet" },
  { key: "ler", name: "Ler", description: "Ler 15 páginas", icon: "bookmark", color: "violet" },
  { key: "alongar", name: "Alongar", description: "Alongar o corpo", icon: "activity", color: "mint" },
  { key: "beberAgua", name: "Beber água", description: "Manter-se hidratado", icon: "droplet", color: "mint" },
  { key: "caminhar", name: "Caminhar", description: "Caminhar ao ar livre", icon: "footprints", color: "coral" },
  { key: "dormirNoHorario", name: "Dormir no horário", description: "Dormir antes das 23h", icon: "moon", color: "violet" },
  { key: "prepararRefeicao", name: "Preparar uma refeição", description: "Preparar as refeições", icon: "utensils", color: "sun" },
  { key: "organizarDia", name: "Organizar o dia", description: "Planejar as prioridades", icon: "listChecks", color: "coral" },
  { key: "tomarSuplementos", name: "Tomar suplementos", description: "Tomar os suplementos do dia", icon: "pill", color: "mint" },
];

export const CUSTOM_HABIT_ICON_CHOICES: HabitIconKey[] = [
  "sparkles",
  "star",
  "target",
  "heart",
  "flame",
  "sun",
  "brain",
  "droplet",
];

export interface CreateHabitInput {
  name: string;
  description: string | null;
  icon: HabitIconKey;
  color: HabitColor;
  scheduledWeekdays: number[];
}

export type UpdateHabitInput = Partial<CreateHabitInput>;
