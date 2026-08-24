import { Logo } from "@/components/shared/logo";
import { Mascot } from "@/components/shared/mascot";
import { MUSCLE_GROUP_LABELS, type TriluMuscleGroup } from "@/features/exercises/domain/types";
import { formatWorkoutDuration } from "../domain/format";

export interface WorkoutShareCardProps {
  ref?: React.Ref<HTMLDivElement>;
  workoutName: string;
  dateLabel: string;
  durationSeconds: number;
  muscleGroups: TriluMuscleGroup[];
  totalReps: number;
  totalVolumeKg: number;
}

/**
 * The visual surface captured into a PNG for sharing — kept deliberately
 * simple (solid gradient, no blur/filters) since it's rasterized by
 * html-to-image, which serializes styles through an SVG foreignObject.
 */
export function WorkoutShareCard({
  ref,
  workoutName,
  dateLabel,
  durationSeconds,
  muscleGroups,
  totalReps,
  totalVolumeKg,
}: WorkoutShareCardProps) {
  return (
    <div
      ref={ref}
      className="flex aspect-4/5 w-full flex-col justify-between gap-6 rounded-3xl bg-linear-to-br from-violet-600 to-coral-500 p-7 text-white"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-white px-2 py-1">
          <Logo height={18} />
        </div>
        <span className="text-xs font-bold tracking-[0.08em] uppercase opacity-80">{dateLabel}</span>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl leading-tight font-extrabold">{workoutName}</h1>

        <div className="flex flex-wrap gap-1.5">
          {muscleGroups.map((group) => (
            <span key={group} className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              {MUSCLE_GROUP_LABELS[group]}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="font-display text-2xl font-extrabold">{formatWorkoutDuration(durationSeconds)}</p>
            <p className="text-[11px] font-semibold tracking-[0.06em] uppercase opacity-80">Duração</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold">{totalReps}</p>
            <p className="text-[11px] font-semibold tracking-[0.06em] uppercase opacity-80">Repetições</p>
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold">{Math.round(totalVolumeKg)} kg</p>
            <p className="text-[11px] font-semibold tracking-[0.06em] uppercase opacity-80">Carga total</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-xs font-semibold opacity-80">Feito com Trilu</p>
        <Mascot size={64} priority />
      </div>
    </div>
  );
}
