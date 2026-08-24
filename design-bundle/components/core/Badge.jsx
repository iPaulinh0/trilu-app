import React from 'react';

export function Badge({tone='neutral',children,style,...rest}){
  const t={neutral:['var(--ink-100)','var(--ink-700)'],violet:['var(--violet-50)','var(--violet-600)'],coral:['var(--coral-50)','var(--coral-700)'],mint:['var(--mint-50)','var(--mint-700)'],sun:['var(--sun-50)','var(--sun-800)'],solid:['var(--violet-500)','#fff']}[tone]||['var(--ink-100)','var(--ink-700)'];
  return React.createElement('span',{style:{display:'inline-flex',alignItems:'center',gap:6,background:t[0],color:t[1],
    padding:'4px 10px',borderRadius:'var(--radius-pill)',font:'var(--type-label)',letterSpacing:'var(--tracking-wide)',
    textTransform:'uppercase',...style},...rest},children);
}