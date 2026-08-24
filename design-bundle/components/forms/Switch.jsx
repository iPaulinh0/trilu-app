import React from 'react';

export function Switch({checked,onChange,label,disabled,style,...rest}){
  return React.createElement('label',{style:{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',
    minHeight:'var(--tap-min)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,...style}},
    React.createElement('input',{type:'checkbox',role:'switch',checked,onChange,disabled,style:{position:'absolute',opacity:0,width:0,height:0},...rest}),
    React.createElement('span',{style:{width:52,height:32,borderRadius:'var(--radius-pill)',padding:3,flex:'0 0 auto',
      background:checked?'var(--violet-500)':'var(--ink-200)',transition:'background var(--dur-base) var(--ease-standard)'}},
      React.createElement('span',{style:{display:'block',width:26,height:26,borderRadius:'var(--radius-pill)',background:'#fff',
        boxShadow:'var(--shadow-xs)',transform:'translateX('+(checked?20:0)+'px)',transition:'transform var(--dur-base) var(--ease-bounce)'}})),
    label&&React.createElement('span',{style:{fontSize:'var(--text-body-md)',color:'var(--text-title)'}},label));
}