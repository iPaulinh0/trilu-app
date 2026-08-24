import * as React from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message; replaces hint and turns the field red. */
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
export declare function Input(props: InputProps): JSX.Element;