import * as React from 'react';
export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  tone?: 'plain'|'brand';
}
export declare function AppHeader(props: AppHeaderProps): JSX.Element;