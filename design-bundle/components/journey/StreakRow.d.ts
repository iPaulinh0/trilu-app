import * as React from 'react';
export type StreakDay = 'done'|'today'|'rest'|'empty';
export interface StreakRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** One entry per weekday. */
  days?: StreakDay[];
  labels?: string[];
}
export declare function StreakRow(props: StreakRowProps): JSX.Element;