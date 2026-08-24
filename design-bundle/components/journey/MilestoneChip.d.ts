import * as React from 'react';
export interface MilestoneChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  caption?: string;
  state?: 'done'|'current'|'goal'|'locked';
  icon?: React.ReactNode;
}
export declare function MilestoneChip(props: MilestoneChipProps): JSX.Element;