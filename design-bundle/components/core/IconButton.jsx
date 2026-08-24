import React from 'react';

const dim={sm:36,md:44,lg:52};
export function IconButton({icon,label,variant='ghost',size='md',onClick,disabled,style,...rest}){
  const d=dim[size]||44;
  const looks={ghost:{background:'transparent',color:'var(--text-body)'},soft:{background:'var(--violet-50)',color:'var(--violet-600)'},solid:{background:'var(--violet-500)',color:'#fff'},card:{background:'var(--surface-card)',color:'var(--text-title)',boxShadow:'var(--shadow-sm)'}};
  const [down,setDown]=React.useState(false);
  return React.createElement('button',{type:'button','aria-label':label,onClick,disabled,
    onPointerDown:()=>setDown(true),onPointerUp:()=>setDown(false),onPointerLeave:()=>setDown(false),
    style:{width:d,height:d,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'none',
      borderRadius:'var(--radius-pill)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,
      transition:'transform var(--dur-fast) var(--ease-standard)',transform:down?'scale(var(--press-scale))':'none',
      ...(looks[variant]||looks.ghost),...style},...rest},icon);
}