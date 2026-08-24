import {
  Brain,
  BookOpen,
  Bookmark,
  Activity,
  Droplet,
  Footprints,
  Moon,
  UtensilsCrossed,
  ListChecks,
  Pill,
  Sparkles,
  Star,
  Target,
  Heart,
  Flame,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { HabitIconKey } from "../domain/types";

const ICON_REGISTRY: Record<HabitIconKey, LucideIcon> = {
  brain: Brain,
  bookOpen: BookOpen,
  bookmark: Bookmark,
  activity: Activity,
  droplet: Droplet,
  footprints: Footprints,
  moon: Moon,
  utensils: UtensilsCrossed,
  listChecks: ListChecks,
  pill: Pill,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  heart: Heart,
  flame: Flame,
  sun: Sun,
};

interface HabitIconProps {
  icon: HabitIconKey;
  className?: string;
}

export function HabitIcon({ icon, className }: HabitIconProps) {
  const Icon = ICON_REGISTRY[icon] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
