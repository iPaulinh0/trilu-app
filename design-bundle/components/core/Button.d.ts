import * as React from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. primary = violet (marca), accent = coral (meta/CTA), success = mint. */
  variant?: 'primary'|'accent'|'success'|'secondary'|'outline'|'ghost';
  size?: 'sm'|'md'|'lg';
  /** Full-width — the app's single main action per screen. */
  block?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}
/**
 * Trilu's pill action button.
 * @startingPoint section="Core" subtitle="Pill buttons in every Trilu variant" viewport="700x220"
 */
export declare function Button(props: ButtonProps): JSX.Element;