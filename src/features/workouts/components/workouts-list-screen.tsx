"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useWorkouts, type WorkoutListItem } from "../hooks/use-workouts";
import { useStartWorkoutSession } from "../hooks/use-start-workout-session";
import { WorkoutCard } from "./workout-card";
import { WorkoutCalendarStrip } from "./workout-calendar-strip";
import { RenameWorkoutDialog } from "./rename-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";
import { MUSCLE_GROUP_LABELS } from "@/features/exercises/domain/types";
import { workoutRepository } from "@/lib/services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";

export function WorkoutsListScreen() {
  const router = useRouter();
  const { items, status, reload } = useWorkouts();
  const { start } = useStartWorkoutSession();
  const [query, setQuery] = useState("");
  const [renameTarget, setRenameTarget] = useState<WorkoutListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkoutListItem | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => item.template.name.toLowerCase().includes(normalized));
  }, [items, query]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, WorkoutListItem[]>();
    for (const item of filtered) {
      const key = item.template.muscleGroups[0];
      byGroup.set(key, [...(byGroup.get(key) ?? []), item]);
    }
    return [...byGroup.entries()];
  }, [filtered]);

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-11 w-full rounded-full" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Mascot size={120} />
        <h2 className="text-xl font-bold text-ink-900">Não conseguimos carregar seus treinos</h2>
        <Button type="button" variant="accent" onClick={reload}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Meus treinos</h1>
          <p className="text-sm text-ink-500">Cada treino concluído é mais um passo na sua trilha.</p>
        </div>
        <WorkoutCalendarStrip />
        <Button type="button" variant="accent" onClick={() => router.push("/treinos/novo")}>
          Criar treino
        </Button>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar meus treinos"
            className="pl-9"
            aria-label="Pesquisar meus treinos"
          />
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-50 px-5 py-8 text-center">
          <Mascot size={96} />
          <h2 className="font-display text-lg font-semibold text-ink-900">Nenhum treino ainda</h2>
          <p className="text-sm text-ink-700">Crie seu primeiro treino para começar a acompanhar seu progresso.</p>
          <Button type="button" variant="accent" onClick={() => router.push("/treinos/novo")}>
            Criar treino
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-ink-50 px-5 py-8 text-center">
          <p className="text-sm font-semibold text-ink-700">Não encontramos esse treino.</p>
          <Button
            type="button"
            variant="accent"
            onClick={() => router.push(`/treinos/novo?nome=${encodeURIComponent(query.trim())}`)}
          >
            Criar treino “{query.trim()}”
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(([group, groupItems]) => (
            <section key={group} className="flex flex-col gap-2">
              <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">
                {MUSCLE_GROUP_LABELS[group as keyof typeof MUSCLE_GROUP_LABELS].toUpperCase()}
              </h2>
              <div className="flex flex-col gap-3">
                {groupItems.map((item) => (
                  <WorkoutCard
                    key={item.template.id}
                    item={item}
                    onStart={() => start(item.template.id)}
                    onEdit={() => router.push(`/treinos/${item.template.id}/editar`)}
                    onDuplicate={async () => {
                      try {
                        await workoutRepository.duplicate(item.template.id);
                        toast.success("Treino duplicado.");
                        reload();
                      } catch {
                        toast.error("Não foi possível duplicar agora.");
                      }
                    }}
                    onRename={() => setRenameTarget(item)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {renameTarget ? (
        <RenameWorkoutDialog
          open={renameTarget !== null}
          onOpenChange={(open) => !open && setRenameTarget(null)}
          currentName={renameTarget.template.name}
          onConfirm={async (name) => {
            try {
              await workoutRepository.rename(renameTarget.template.id, name);
              toast.success("Treino renomeado.");
              reload();
            } catch {
              toast.error("Não foi possível renomear agora.");
            }
          }}
        />
      ) : null}

      <DeleteWorkoutDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        workoutName={deleteTarget?.template.name ?? ""}
        onConfirm={async () => {
          if (!deleteTarget) return;
          const name = deleteTarget.template.name;
          try {
            await workoutRepository.archive(deleteTarget.template.id);
            toast.success(`"${name}" foi excluído.`);
            reload();
          } catch {
            toast.error("Não foi possível excluir agora.");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
