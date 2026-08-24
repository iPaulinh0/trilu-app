import React from 'react';

/** Organic left-right winding trail. Nodes are laid out along a smooth cubic path. */
export function TrailPath({milestones=[],currentIndex=0,avatarSrc,width=320,orientation='horizontal',style,...rest}){
  const n=Math.max(milestones.length,2);
  const LABEL_BAND=34;
  const H=orientation==='vertical'?Math.max(220,n*104):160;
  const W=width;
  const midY=(H-LABEL_BAND)/2;
  const amp=(H-LABEL_BAND)*0.26;
  const pts=milestones.map((m,i)=>{
    const t=n===1?0:i/(n-1);
    if(orientation==='vertical')return{x:W*(i%2?0.68:0.32),y:36+t*(H-72)};
    return{x:34+t*(W-68),y:midY+(i%2?amp:-amp)};
  });
  const d=pts.reduce((acc,p,i)=>{
    if(i===0)return'M '+p.x+' '+p.y;
    const q=pts[i-1];
    return orientation==='vertical'
      ? acc+' C '+q.x+' '+(q.y+(p.y-q.y)*0.55)+', '+p.x+' '+(p.y-(p.y-q.y)*0.55)+', '+p.x+' '+p.y
      : acc+' C '+(q.x+(p.x-q.x)*0.5)+' '+q.y+', '+(q.x+(p.x-q.x)*0.5)+' '+p.y+', '+p.x+' '+p.y;
  },'');
  const doneLen=currentIndex/(n-1||1);
  const colorFor=i=>i<currentIndex?'var(--journey-done)':i===currentIndex?'var(--journey-current)':i===n-1?'var(--journey-goal)':'var(--journey-locked)';
  return React.createElement('div',{style:{position:'relative',width:W,height:H,...style},...rest},
    React.createElement('svg',{width:W,height:H,style:{position:'absolute',inset:0,overflow:'visible'}},
      React.createElement('path',{d,fill:'none',stroke:'var(--journey-track)',strokeWidth:'var(--track-w-lg)',strokeLinecap:'round',strokeDasharray:'2 16'}),
      React.createElement('path',{d,fill:'none',stroke:'var(--journey-done)',strokeWidth:'var(--track-w-lg)',strokeLinecap:'round',
        pathLength:1,strokeDasharray:'1 1',strokeDashoffset:1-doneLen,style:{transition:'stroke-dashoffset var(--dur-slow) var(--ease-out)'}})),
    milestones.map((m,i)=>{
      const p=pts[i],cur=i===currentIndex,size=cur?44:i===n-1?38:28;
      return React.createElement('div',{key:i,style:{position:'absolute',left:p.x,top:p.y,transform:'translate(-50%,-50%)',textAlign:'center'}},
        React.createElement('div',{style:{width:size,height:size,borderRadius:'var(--radius-pill)',background:colorFor(i),
          border:'3px solid var(--surface-card)',boxShadow:cur?'var(--shadow-coral)':'var(--shadow-xs)',
          display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',
          fontFamily:'var(--font-display)',fontWeight:'var(--weight-bold)',fontSize:13,
          animation:cur?'trilu-pulse 2.4s var(--ease-standard) infinite':'none',overflow:'hidden'}},
          cur&&avatarSrc?React.createElement('img',{src:avatarSrc,alt:'',style:{width:'100%',height:'100%',objectFit:'contain'}}):(m.icon||(i<currentIndex?'✓':'')),
        ),
        m.label&&React.createElement('div',{style:{position:'absolute',left:'50%',top:size+6,transform:'translateX(-50%)',
          font:'var(--type-label)',fontSize:11,letterSpacing:'var(--tracking-wide)',
          textTransform:'uppercase',color:cur?'var(--text-accent)':'var(--text-muted)',whiteSpace:'nowrap',
          background:'var(--surface-card)',padding:'0 3px',borderRadius:4}},m.label));
    }));
}