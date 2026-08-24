import React from 'react';

export function Dialog({open=true,title,children,footer,onClose,style,...rest}){
  if(!open)return null;
  return React.createElement('div',{style:{position:'absolute',inset:0,background:'var(--scrim)',backdropFilter:'var(--blur-sheet)',
    display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:50},onClick:onClose},
    React.createElement('div',{role:'dialog','aria-modal':true,onClick:e=>e.stopPropagation(),
      style:{width:'100%',maxWidth:'var(--max-content)',background:'var(--surface-card)',borderRadius:'var(--radius-sheet)',
        padding:'var(--space-6)',boxShadow:'var(--shadow-overlay)',animation:'trilu-rise var(--dur-base) var(--ease-out)',...style},...rest},
      React.createElement('div',{style:{width:40,height:4,borderRadius:'var(--radius-pill)',background:'var(--ink-200)',margin:'0 auto var(--space-5)'}}),
      title&&React.createElement('h3',{style:{font:'var(--type-title)',marginBottom:'var(--space-3)'}},title),
      React.createElement('div',{style:{color:'var(--text-body)'}},children),
      footer&&React.createElement('div',{style:{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-6)'}},footer)));
}