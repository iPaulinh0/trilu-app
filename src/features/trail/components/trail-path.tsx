import type { TrailGoal } from "../domain/types";
import { Mascot } from "@/components/shared/mascot";
import { cn } from "@/lib/utils";

interface TrailPathProps {
  goal: TrailGoal;
}

interface TrailNode {
  value: number;
  x: number;
  y: number;
  isGoal: boolean;
}

const SEGMENT_WIDTH = 56;
const WAVE_AMPLITUDE = 22;
const BASE_Y = 60;
const VIEW_HEIGHT = 120;

function buildNodes(goal: TrailGoal): TrailNode[] {
  const values = [0, ...goal.milestones];
  return values.map((value, index) => ({
    value,
    x: 24 + index * SEGMENT_WIDTH,
    y: BASE_Y + Math.sin(index * 1.1) * WAVE_AMPLITUDE,
    isGoal: value === goal.targetSteps,
  }));
}

function buildPathD(nodes: TrailNode[]): string {
  if (nodes.length === 0) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i += 1) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const controlX = (prev.x + curr.x) / 2;
    const controlY = i % 2 === 0 ? prev.y : curr.y;
    d += ` Q ${controlX} ${controlY} ${curr.x} ${curr.y}`;
  }
  return d;
}

export function TrailPath({ goal }: TrailPathProps) {
  const nodes = buildNodes(goal);
  const lastNode = nodes[nodes.length - 1];
  const progressPercent = Math.max(0, Math.min(100, (goal.currentSteps / goal.targetSteps) * 100));
  const pathD = buildPathD(nodes);
  const viewWidth = lastNode.x + 24;

  // Current position: linear-interpolate between the two nodes bracketing currentSteps.
  let markerIndex = 0;
  for (let i = 0; i < nodes.length - 1; i += 1) {
    if (goal.currentSteps >= nodes[i].value) markerIndex = i;
  }
  const lower = nodes[markerIndex];
  const upper = nodes[Math.min(markerIndex + 1, nodes.length - 1)];
  const segmentRange = upper.value - lower.value || 1;
  const segmentFraction = Math.max(0, Math.min(1, (goal.currentSteps - lower.value) / segmentRange));
  const markerX = lower.x + (upper.x - lower.x) * segmentFraction;
  const markerY = lower.y + (upper.y - lower.y) * segmentFraction;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
        className="h-[120px] w-full min-w-[320px]"
        role="img"
        aria-label={`Trilha: ${goal.currentSteps} de ${goal.targetSteps} passos concluídos`}
      >
        <path
          d={pathD}
          fill="none"
          stroke="var(--ink-200)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="1 8"
        />
        <path
          d={pathD}
          fill="none"
          stroke="var(--mint-500)"
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - progressPercent}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-out)]"
        />

        {nodes.map((node) => {
          const done = goal.currentSteps >= node.value;
          const isFuture = !done && node.value !== 0;
          return (
            <g key={node.value}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.isGoal ? 12 : 9}
                fill={node.isGoal ? "var(--sun-500)" : done ? "var(--mint-500)" : "var(--ink-300)"}
                stroke="var(--trilu-white)"
                strokeWidth={3}
              />
              {isFuture ? null : (
                <title>
                  {node.isGoal ? `Meta final: ${node.value} passos` : `Marco: ${node.value} passos`}
                </title>
              )}
            </g>
          );
        })}

        <g
          className={cn(
            "motion-safe:transition-[transform] motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-out)]",
          )}
          style={{ transform: `translate(${markerX}px, ${markerY}px)` }}
        >
          <circle r={16} fill="var(--coral-500)" className="motion-safe:animate-[trilu-pulse_2.4s_ease-out_infinite]" />
          <foreignObject x={-16} y={-16} width={32} height={32}>
            <Mascot size={32} className="pointer-events-none" />
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}
