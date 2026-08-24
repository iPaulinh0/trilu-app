import * as React from 'react';
export interface TabItem { value: string; label: string }
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
}
export declare function Tabs(props: TabsProps): JSX.Element;