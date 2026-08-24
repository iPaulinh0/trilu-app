"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatRelativeDateKey, todayDateKey } from "@/lib/date/local-date";
import { summarizeMetric } from "../domain/progress";
import type { ExerciseProgressPoint } from "../domain/progress";
import { cn } from "@/lib/utils";

type Metric = "load" | "reps" | "volume";

interface MetricOption {
  key: Metric;
  label: string;
  unit: string;
  accessor: (point: ExerciseProgressPoint) => number;
}

function buildOptions(includeLoad: boolean): MetricOption[] {
  const options: MetricOption[] = [
    { key: "reps", label: "Repetições", unit: "reps", accessor: (p) => p.totalReps },
    { key: "volume", label: "Volume", unit: "kg", accessor: (p) => p.totalVolumeKg },
  ];
  if (includeLoad) {
    options.unshift({ key: "load", label: "Carga", unit: "kg", accessor: (p) => p.maxLoadKg });
  }
  return options;
}

const CHART_CONFIG: ChartConfig = {
  value: { label: "Valor", color: "var(--violet-500)" },
};

interface ExerciseEvolutionChartProps {
  points: ExerciseProgressPoint[];
  isBodyweightOnly: boolean;
}

export function ExerciseEvolutionChart({ points, isBodyweightOnly }: ExerciseEvolutionChartProps) {
  const options = buildOptions(!isBodyweightOnly);
  const [metric, setMetric] = useState<Metric>(options[0].key);
  const active = options.find((o) => o.key === metric) ?? options[0];

  const values = points.map(active.accessor);
  const summary = summarizeMetric(values);
  const today = todayDateKey();

  const chartData = points.map((point) => ({
    dateKey: point.dateKey,
    label: formatRelativeDateKey(point.dateKey, today),
    value: active.accessor(point),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2" role="tablist" aria-label="Métrica de evolução">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={metric === option.key}
            onClick={() => setMetric(option.key)}
            className={cn(
              "min-h-9 rounded-full border-2 px-3 text-sm font-bold transition-colors",
              metric === option.key ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 bg-card text-ink-600",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-card p-3 shadow-card">
          <p className="font-display text-lg font-extrabold text-ink-900">
            {Math.round(summary.latest)} {active.unit}
          </p>
          <p className="text-[11px] font-semibold text-ink-500">Último</p>
        </div>
        <div className="rounded-2xl bg-card p-3 shadow-card">
          <p className="font-display text-lg font-extrabold text-ink-900">
            {Math.round(summary.best)} {active.unit}
          </p>
          <p className="text-[11px] font-semibold text-ink-500">Melhor</p>
        </div>
        <div className="rounded-2xl bg-card p-3 shadow-card">
          <p
            className={cn(
              "font-display text-lg font-extrabold",
              summary.percentChange === null ? "text-ink-400" : summary.percentChange >= 0 ? "text-mint-600" : "text-coral-600",
            )}
          >
            {summary.percentChange === null ? "—" : `${summary.percentChange >= 0 ? "+" : ""}${Math.round(summary.percentChange)}%`}
          </p>
          <p className="text-[11px] font-semibold text-ink-500">Variação</p>
        </div>
      </div>

      <ChartContainer config={CHART_CONFIG} className="aspect-auto h-56 min-h-[180px] w-full">
        <AreaChart data={chartData} accessibilityLayer margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="evolutionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--violet-500)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--violet-500)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="value"
            type="monotone"
            stroke="var(--coral-500)"
            fill="url(#evolutionFill)"
            strokeWidth={3}
            dot={{ r: 3, fill: "var(--coral-500)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
