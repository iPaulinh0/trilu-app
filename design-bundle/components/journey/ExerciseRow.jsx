import React from 'react';

export function ExerciseRow({name,detail,setsDone=0,setsTotal=0,done=false,onClick,right,style,...rest}){
  return React.createElement('div',{onClick,style:{display:'flex',alignItems:'center',gap:'var(--space-3)',
    background:'var(--surface-card)',borderRadius:'var(--radius-md)',padding:'var(--space-4)',cursor:onClick?'pointer':'default',
    boxShadow:'var(--shadow-sm)',opacity:done?.72:1,transition:'all var(--dur-fast) var(--ease-standard)',...style},...rest},
    React.createElement('div',{style:{width:40,height:40,borderRadius:'var(--radius-sm)',flex:'0 0 auto',
      background:done?'var(--mint-50)':'var(--violet-50)',color:done?'var(--mint-600)':'var(--violet-600)',
      display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'var(--weight-bold)',fontSize:15}},
      done?'✓':(setsDone+'/'+setsTotal)),
    React.createElement('div',{style:{flex:1,minWidth:0}},
      React.createElement('div',{style:{fontFamily:'var(--font-body)',fontWeight:'var(--weight-bold)',color:'var(--text-title)',
        fontSize:'var(--text-body-md)',textDecoration:done?'line-through':'none'}},name),
      detail&&React.createElement('div',{style:{fontSize:'var(--text-caption)',color:'var(--text-muted)',marginTop:2}},detail)),
    right);
}