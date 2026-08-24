import * as React from 'react';
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,'type'> {
  label?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;