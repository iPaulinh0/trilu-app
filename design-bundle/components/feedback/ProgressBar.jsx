import React from 'react';

export function ProgressBar({value=0,max=100,tone='violet',size='md',label,valueLabel,style,...rest}){
  const pct=Math.max(0,Math.min(100,(value/max)*100));
  const fills={violet:'var(--violet-500)',coral:'var(--coral-500)',mint:'var(--mint-500)',sun:'var(--sun-500)'};
  const h=size==='lg'?'var(--track-w-lg)':size==='sm'?'4px':'var(--track-w)';
  return React.createElement('div',{style:{width:'100%',...style},...rest},
    (label||valueLabel)&&React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'var(--space-2)'}},
      React.createElement('span',{style:{font:'var(--type-label)',color:'var(--text-muted)'}},label),
      React.createElement('span',{style:{font:'var(--type-label)',color:'var(--text-title)'}},valueLabel)),
    React.createElement('div',{role:'progressbar','aria-valuenow':value,'aria-valuemax':max,
      style:{height:h,borderRadius:'var(--radius-pill)',background:'var(--journey-track)',overflow:'hidden'}},
      React.createElement('div',{style:{width:pct+'%',height:'100%',borderRadius:'var(--radius-pill)',
        background:fills[tone]||fills.violet,transition:'width var(--dur-slow) var(--ease-out)'}})));
}