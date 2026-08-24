import * as React from 'react';
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  /** Used for alt text and initials fallback. */
  name?: string;
  size?: 'xs'|'sm'|'md'|'lg'|'xl';
  /** CSS color for a 3px status ring (mint = trained today). */
  ring?: string;
}
export declare function Avatar(props: AvatarProps): JSX.Element;