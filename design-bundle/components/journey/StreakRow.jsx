import React from 'react';

export function StreakRow({days=[],labels=['S','T','Q','Q','S','S','D'],style,...rest}){
  return React.createElement('div',{style:{display:'flex',gap:'var(--space-2)',...style},...rest},
    days.map((d,i)=>{
      const bg=d==='done'?'var(--mint-500)':d==='today'?'var(--coral-500)':d==='rest'?'var(--violet-100)':'var(--surface-sunken)';
      const fg=d==='done'||d==='today'?'#fff':'var(--text-subtle)';
      return React.createElement('div',{key:i,style:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}},
        React.createElement('div',{style:{width:'100%',aspectRatio:'1',maxWidth:40,borderRadius:'var(--radius-sm)',background:bg,color:fg,
          display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'var(--weight-bold)',fontSize:14,
          border:d==='today'?'none':'none',animation:d==='today'?'trilu-pop var(--dur-base) var(--ease-bounce)':'none'}},d==='done'?'✓':''),
        React.createElement('span',{style:{fontSize:'var(--text-micro)',color:'var(--text-subtle)',fontWeight:'var(--weight-bold)'}},labels[i]));
    }));
}