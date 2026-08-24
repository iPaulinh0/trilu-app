import type { HabitColor } from "../domain/types";

interface HabitColorStyle {
  bg: string;
  text: string;
  ring: string;
  solid: string;
}

/** Tailwind class lookup for each brand swatch a habit can use. */
export const HABIT_COLOR_STYLES: Record<HabitColor, HabitColorStyle> = {
  violet: { bg: "bg-violet-100", text: "text-violet-700", ring: "ring-violet-400", solid: "bg-violet-500" },
  coral: { bg: "bg-coral-100", text: "text-coral-700", ring: "ring-coral-400", solid: "bg-coral-500" },
  mint: { bg: "bg-mint-100", text: "text-mint-700", ring: "ring-mint-400", solid: "bg-mint-500" },
  sun: { bg: "bg-sun-100", text: "text-sun-700", ring: "ring-sun-400", solid: "bg-sun-500" },
};
