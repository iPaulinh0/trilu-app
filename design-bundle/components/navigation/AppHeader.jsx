import React from 'react';

export function AppHeader({title,subtitle,left,right,tone='plain',style,...rest}){
  const tones={plain:{background:'transparent',color:'var(--text-title)'},brand:{background:'var(--violet-500)',color:'#fff'}};
  return React.createElement('header',{style:{display:'flex',alignItems:'center',gap:'var(--space-3)',
    padding:'var(--space-4) var(--gutter-screen)',...(tones[tone]||tones.plain),...style},...rest},
    left,
    React.createElement('div',{style:{flex:1,minWidth:0}},
      React.createElement('div',{style:{fontFamily:'var(--font-display)',fontWeight:'var(--weight-bold)',fontSize:'var(--text-title)',letterSpacing:'var(--tracking-tight)'}},title),
      subtitle&&React.createElement('div',{style:{fontSize:'var(--text-caption)',opacity:.75,marginTop:2}},subtitle)),
    right);
}