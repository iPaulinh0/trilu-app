import * as React from 'react';
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide SVG node (24px, stroke 2). */
  icon: React.ReactNode;
  /** Required accessible label. */
  label: string;
  variant?: 'ghost'|'soft'|'solid'|'card';
  size?: 'sm'|'md'|'lg';
}
export declare function IconButton(props: IconButtonProps): JSX.Element;