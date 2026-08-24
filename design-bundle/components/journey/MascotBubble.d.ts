import * as React from 'react';
export interface MascotBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: React.ReactNode;
  /** Path to the Tilu artwork; copy assets/mascot-tilu.png into your project. */
  mascotSrc?: string;
  size?: number;
  align?: 'left'|'right';
}
/**
 * @startingPoint section="Journey" subtitle="Tilu speaking to the user" viewport="700x180"
 */
export declare function MascotBubble(props: MascotBubbleProps): JSX.Element;