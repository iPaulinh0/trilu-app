import * as React from 'react';
export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  content: React.ReactNode;
  placement?: 'top'|'bottom';
}
export declare function Tooltip(props: TooltipProps): JSX.Element;