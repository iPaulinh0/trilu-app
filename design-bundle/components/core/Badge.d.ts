import * as React from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral'|'violet'|'coral'|'mint'|'sun'|'solid';
}
export declare function Badge(props: BadgeProps): JSX.Element;