import * as React from 'react';
export interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
export declare function Tag(props: TagProps): JSX.Element;