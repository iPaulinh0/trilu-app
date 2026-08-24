import * as React from 'react';
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'success'|'celebrate'|'info'|'danger';
  title: string;
  message?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}
export declare function Toast(props: ToastProps): JSX.Element;