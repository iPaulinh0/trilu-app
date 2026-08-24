import * as React from 'react';
export interface Milestone { label?: string; icon?: React.ReactNode }
export interface TrailPathProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ordered marcos: início → … → meta. */
  milestones?: Milestone[];
  /** Index of the user's current position; earlier nodes render mint/done. */
  currentIndex?: number;
  /** Mascot or user image shown inside the current node. */
  avatarSrc?: string;
  width?: number;
  orientation?: 'horizontal'|'vertical';
}
/**
 * The signature Trilu element — "a trilha é a interface da marca".
 * @startingPoint section="Journey" subtitle="The winding milestone trail" viewport="700x220"
 */
export declare function TrailPath(props: TrailPathProps): JSX.Element;