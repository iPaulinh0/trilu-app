"use client";

import { FlameIcon, ActivityIcon } from "lucide-react";
import type { OnboardingDraft } from "../domain/types";
import { roundKcal } from "../domain/metabolism";
import { formatWeeklyFrequency, getActivityLevelTitle, getGoalLabel } from "../domain/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/shared/mascot";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

interface ResultStepProps {
  draft: OnboardingDraft;
  onEdit: () => void;
  onContinue: () => void;
}

export function ResultStep({ draft, onEdit, onContinue }: ResultStepProps) {
  const bmr = draft.bmr !== null ? roundKcal(draft.bmr) : null;
  const tdee = draft.tdee !== null ? roundKcal(draft.tdee) : null;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-center py-2">
        <Mascot size={120} priority />
      </div>

      <h1 className="text-center text-2xl font-bold leading-snug text-ink-900">
        Seu ponto de partida está pronto!
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        <Card className="gap-2 border-none px-5">
          <div className="flex items-center gap-2 text-violet-600">
            <FlameIcon className="size-5" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-ink-900">Metabolismo basal</h2>
          </div>
          <p className="font-display text-3xl font-extrabold text-ink-900">
            {bmr !== null ? `${bmr} kcal/dia` : "-"}
          </p>
          <p className="text-sm leading-relaxed text-ink-500">
            Estimativa do que seu corpo utiliza em repouso.
          </p>
        </Card>

        <Card className="gap-2 border-none px-5">
          <div className="flex items-center gap-2 text-coral-600">
            <ActivityIcon className="size-5" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-ink-900">Gasto diário estimado</h2>
          </div>
          <p className="font-display text-3xl font-extrabold text-ink-900">
            {tdee !== null ? `${tdee} kcal/dia` : "-"}
          </p>
          <p className="text-sm leading-relaxed text-ink-500">
            Estimativa considerando sua rotina de atividade.
          </p>
        </Card>

        <Card className="gap-3 border-none bg-violet-50 px-5 shadow-none">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Objetivo</dt>
              <dd className="text-right font-semibold text-ink-900">
                {getGoalLabel(draft.goal, draft.customGoal)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Frequência pretendida</dt>
              <dd className="text-right font-semibold text-ink-900">
                {formatWeeklyFrequency(draft.weeklyFrequency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-500">Nível de atividade</dt>
              <dd className="text-right font-semibold text-ink-900">
                {getActivityLevelTitle(draft.activityLevel)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Esses valores são estimativas educativas e não substituem a avaliação de um médico ou
        nutricionista.
      </p>

      <BottomActionArea>
        <Button type="button" variant="outline" size="lg" block onClick={onEdit}>
          Editar respostas
        </Button>
        <Button type="button" variant="accent" size="lg" block onClick={onContinue}>
          Criar minha trilha
        </Button>
      </BottomActionArea>
    </div>
  );
}
