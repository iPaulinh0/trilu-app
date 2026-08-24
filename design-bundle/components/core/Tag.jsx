import React from 'react';

export function Tag({selected=false,onClick,children,style,...rest}){
  return React.createElement('button',{type:'button',onClick,
    style:{display:'inline-flex',alignItems:'center',gap:6,minHeight:36,padding:'0 14px',borderRadius:'var(--radius-pill)',
      cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:'var(--weight-semibold)',fontSize:'var(--text-caption)',
      transition:'all var(--dur-fast) var(--ease-standard)',
      background:selected?'var(--violet-500)':'var(--surface-card)',color:selected?'#fff':'var(--text-body)',
      border:selected?'var(--border-w-strong) solid var(--violet-500)':'var(--border-w-strong) solid var(--border-default)',...style},...rest},children);
}