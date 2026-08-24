import React from 'react';

const sizes={sm:{h:'var(--control-h-sm)',px:'14px',fs:'var(--text-caption)'},md:{h:'var(--control-h-md)',px:'20px',fs:'var(--text-body-md)'},lg:{h:'var(--control-h-lg)',px:'28px',fs:'var(--text-body-lg)'}};
const looks={
  primary:{background:'var(--violet-500)',color:'var(--text-on-brand)',boxShadow:'var(--shadow-brand)',border:'none'},
  accent:{background:'var(--coral-500)',color:'#fff',boxShadow:'var(--shadow-coral)',border:'none'},
  success:{background:'var(--mint-500)',color:'#fff',boxShadow:'0 8px 20px rgba(53,201,154,.28)',border:'none'},
  secondary:{background:'var(--violet-50)',color:'var(--violet-600)',border:'none',boxShadow:'none'},
  outline:{background:'transparent',color:'var(--text-title)',border:'var(--border-w-strong) solid var(--border-default)',boxShadow:'none'},
  ghost:{background:'transparent',color:'var(--text-brand)',border:'none',boxShadow:'none'}
};
export function Button({variant='primary',size='md',block=false,disabled=false,loading=false,iconLeft,iconRight,onClick,type='button',children,style,...rest}){
  const s=sizes[size]||sizes.md, look=looks[variant]||looks.primary;
  const [down,setDown]=React.useState(false);
  return React.createElement('button',{
    type,disabled:disabled||loading,onClick,
    onPointerDown:()=>setDown(true),onPointerUp:()=>setDown(false),onPointerLeave:()=>setDown(false),
    style:{display:block?'flex':'inline-flex',width:block?'100%':'auto',alignItems:'center',justifyContent:'center',
      gap:'var(--space-2)',minHeight:s.h,padding:'0 '+s.px,fontFamily:'var(--font-body)',fontWeight:'var(--weight-bold)',
      fontSize:s.fs,lineHeight:1,borderRadius:'var(--radius-pill)',cursor:disabled?'not-allowed':'pointer',
      transition:'transform var(--dur-fast) var(--ease-standard),filter var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard)',
      transform:down?'scale(var(--press-scale))':'none',opacity:disabled?.45:1,...look,...style},...rest},
    loading?React.createElement('span',{style:{width:16,height:16,borderRadius:'50%',border:'2px solid currentColor',borderTopColor:'transparent',animation:'trilu-spin .7s linear infinite'}}):iconLeft,
    children, iconRight);
}