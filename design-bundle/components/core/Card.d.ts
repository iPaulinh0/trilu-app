import * as React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'default'|'flat'|'sunken'|'brand'|'accent'|'success'|'celebrate';
  padding?: string;
  /** Adds hover lift + pointer. */
  interactive?: boolean;
}
/**
 * @startingPoint section="Core" subtitle="Surface container in all Trilu tones" viewport="700x260"
 */
export declare function Card(props: CardProps): JSX.Element;