import React from 'react';

export function Tabs({items=[],value,onChange,style,...rest}){
  return React.createElement('div',{role:'tablist',style:{display:'inline-flex',gap:4,padding:4,
    background:'var(--surface-sunken)',borderRadius:'var(--radius-pill)',...style},...rest},
    items.map(it=>{const on=it.value===value;
      return React.createElement('button',{key:it.value,role:'tab','aria-selected':on,onClick:()=>onChange&&onChange(it.value),
        style:{border:'none',cursor:'pointer',padding:'0 18px',minHeight:36,borderRadius:'var(--radius-pill)',
          fontFamily:'var(--font-body)',fontWeight:'var(--weight-bold)',fontSize:'var(--text-caption)',
          background:on?'var(--surface-card)':'transparent',color:on?'var(--text-title)':'var(--text-muted)',
          boxShadow:on?'var(--shadow-xs)':'none',transition:'all var(--dur-fast) var(--ease-standard)'}},it.label);}));
}