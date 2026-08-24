import React from 'react';

export function Card({tone='default',padding='var(--gutter-card)',interactive=false,children,style,...rest}){
  const tones={
    default:{background:'var(--surface-card)',boxShadow:'var(--shadow-card)',border:'none'},
    flat:{background:'var(--surface-card)',border:'var(--border-w) solid var(--border-subtle)',boxShadow:'none'},
    sunken:{background:'var(--surface-sunken)',border:'none',boxShadow:'none'},
    brand:{background:'var(--violet-500)',color:'var(--text-on-brand)',boxShadow:'var(--shadow-brand)',border:'none'},
    accent:{background:'var(--coral-50)',border:'none',boxShadow:'none'},
    success:{background:'var(--mint-50)',border:'none',boxShadow:'none'},
    celebrate:{background:'var(--sun-50)',border:'none',boxShadow:'none'}
  };
  const [hov,setHov]=React.useState(false);
  return React.createElement('div',{
    onMouseEnter:()=>interactive&&setHov(true),onMouseLeave:()=>setHov(false),
    style:{borderRadius:'var(--radius-card)',padding,transition:'transform var(--dur-base) var(--ease-standard),box-shadow var(--dur-base) var(--ease-standard)',
      cursor:interactive?'pointer':'default',transform:hov?'translateY(var(--hover-lift))':'none',
      ...(tones[tone]||tones.default),...(hov?{boxShadow:'var(--shadow-raised)'}:null),...style},...rest},children);
}