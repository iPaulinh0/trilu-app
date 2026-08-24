import * as React from 'react';
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  unit?: string;
  label: string;
  tone?: 'violet'|'coral'|'mint'|'sun'|'ink';
  icon?: React.ReactNode;
}
export declare function StatTile(props: StatTileProps): JSX.Element;