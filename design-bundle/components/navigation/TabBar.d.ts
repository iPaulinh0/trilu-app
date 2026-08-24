import * as React from 'react';
export interface TabBarItem { value: string; label: string; icon?: React.ReactNode }
export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {
  items?: TabBarItem[];
  value?: string;
  onChange?: (value: string) => void;
}
export declare function TabBar(props: TabBarProps): JSX.Element;