import React from 'react';

export function Radio({label,description,checked,onChange,name,value,style,...rest}){
  return React.createElement('label',{style:{display:'flex',alignItems:'flex-start',gap:'var(--space-3)',
    padding:'var(--space-4)',borderRadius:'var(--radius-md)',cursor:'pointer',
    background:checked?'var(--violet-50)':'var(--surface-card)',
    border:'var(--border-w-strong) solid '+(checked?'var(--violet-500)':'var(--border-default)'),
    transition:'all var(--dur-fast) var(--ease-standard)',...style}},
    React.createElement('input',{type:'radio',name,value,checked,onChange,style:{position:'absolute',opacity:0,width:0,height:0},...rest}),
    React.createElement('span',{style:{width:22,height:22,flex:'0 0 auto',marginTop:1,borderRadius:'var(--radius-pill)',
      border:'var(--border-w-strong) solid '+(checked?'var(--violet-500)':'var(--border-strong)'),
      display:'inline-flex',alignItems:'center',justifyContent:'center'}},
      checked&&React.createElement('span',{style:{width:10,height:10,borderRadius:'var(--radius-pill)',background:'var(--violet-500)'}})),
    React.createElement('span',null,
      React.createElement('span',{style:{display:'block',fontWeight:'var(--weight-bold)',color:'var(--text-title)'}},label),
      description&&React.createElement('span',{style:{display:'block',fontSize:'var(--text-caption)',color:'var(--text-muted)',marginTop:2}},description)));
}