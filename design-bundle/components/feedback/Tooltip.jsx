import React from 'react';

export function Tooltip({content,placement='top',children,style,...rest}){
  const [show,setShow]=React.useState(false);
  const pos=placement==='bottom'?{top:'calc(100% + 8px)'}:{bottom:'calc(100% + 8px)'};
  return React.createElement('span',{style:{position:'relative',display:'inline-flex'},
    onMouseEnter:()=>setShow(true),onMouseLeave:()=>setShow(false),...rest},children,
    show&&React.createElement('span',{role:'tooltip',style:{position:'absolute',left:'50%',transform:'translateX(-50%)',
      background:'var(--surface-inverse)',color:'var(--text-on-inverse)',padding:'6px 10px',borderRadius:'var(--radius-xs)',
      fontSize:'var(--text-caption-sm)',whiteSpace:'nowrap',boxShadow:'var(--shadow-raised)',zIndex:20,
      animation:'trilu-rise var(--dur-fast) var(--ease-out)',...pos,...style}},content));
}