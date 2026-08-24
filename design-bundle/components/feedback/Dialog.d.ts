import * as React from 'react';
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  /** Action row, usually one or two Buttons. */
  footer?: React.ReactNode;
  onClose?: () => void;
}
export declare function Dialog(props: DialogProps): JSX.Element;