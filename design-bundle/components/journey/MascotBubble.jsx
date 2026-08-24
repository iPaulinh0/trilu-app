import React from 'react';

export function MascotBubble({message,mascotSrc='assets/mascot-tilu.png',size=72,align='left',children,style,...rest}){
  return React.createElement('div',{style:{display:'flex',alignItems:'flex-end',gap:'var(--space-3)',
    flexDirection:align==='right'?'row-reverse':'row',...style},...rest},
    React.createElement('img',{src:mascotSrc,alt:'Tilu',style:{width:size,height:size,objectFit:'contain',flex:'0 0 auto'}}),
    React.createElement('div',{style:{position:'relative',background:'var(--surface-card)',borderRadius:'var(--radius-lg)',
      padding:'var(--space-4)',boxShadow:'var(--shadow-card)',maxWidth:320,
      fontFamily:'var(--font-display)',fontWeight:'var(--weight-semibold)',fontSize:'var(--text-body-md)',
      color:'var(--text-title)',lineHeight:'var(--leading-snug)'}},message||children));
}