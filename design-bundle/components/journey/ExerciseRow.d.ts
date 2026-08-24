import * as React from 'react';
export interface ExerciseRowProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** e.g. "3 séries de 10 • 32 kg". */
  detail?: string;
  setsDone?: number;
  setsTotal?: number;
  done?: boolean;
  right?: React.ReactNode;
}
export declare function ExerciseRow(props: ExerciseRowProps): JSX.Element;