import * as React from 'react';
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  tone?: 'violet'|'coral'|'mint'|'sun';
  size?: 'sm'|'md'|'lg';
  label?: string;
  /** Right-aligned readout, e.g. "3 de 4 séries". */
  valueLabel?: string;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;