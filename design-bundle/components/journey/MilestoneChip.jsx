import React from 'react';

export function MilestoneChip({label,caption,state='locked',icon,style,...rest}){
  const map={done:['var(--mint-50)','var(--mint-600)','var(--mint-700)'],current:['var(--coral-50)','var(--coral-500)','var(--coral-700)'],goal:['var(--sun-50)','var(--sun-500)','var(--sun-800)'],locked:['var(--ink-100)','var(--ink-300)','var(--text-muted)']}[state];
  return React.createElement('div',{style:{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',
    background:map[0],borderRadius:'var(--radius-pill)',padding:'8px 16px 8px 8px',...style},...rest},
    React.createElement('span',{style:{width:32,height:32,borderRadius:'var(--radius-pill)',background:map[1],
      display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'var(--weight-bold)',fontSize:14}},icon||(state==='done'?'✓':'')),
    React.createElement('span',null,
      React.createElement('span',{style:{display:'block',fontFamily:'var(--font-display)',fontWeight:'var(--weight-bold)',fontSize:'var(--text-body-sm)',color:map[2]}},label),
      caption&&React.createElement('span',{style:{display:'block',fontSize:'var(--text-caption-sm)',color:'var(--text-muted)'}},caption)));
}