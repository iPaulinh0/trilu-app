import React from 'react';

export function TabBar({items=[],value,onChange,style,...rest}){
  return React.createElement('nav',{style:{display:'flex',alignItems:'center',justifyContent:'space-around',
    background:'var(--surface-card)',borderTop:'var(--border-w) solid var(--border-subtle)',
    padding:'8px 8px calc(8px + env(safe-area-inset-bottom))',...style},...rest},
    items.map(it=>{const on=it.value===value;
      return React.createElement('button',{key:it.value,onClick:()=>onChange&&onChange(it.value),
        style:{flex:1,minHeight:'var(--tap-min)',display:'flex',flexDirection:'column',alignItems:'center',gap:4,
          border:'none',background:'transparent',cursor:'pointer',color:on?'var(--violet-600)':'var(--text-subtle)',
          transition:'color var(--dur-fast) var(--ease-standard)'}},
        it.icon,
        React.createElement('span',{style:{fontSize:'var(--text-micro)',fontFamily:'var(--font-body)',fontWeight:on?'var(--weight-bold)':'var(--weight-semibold)'}},it.label));}));
}