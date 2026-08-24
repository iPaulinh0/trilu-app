import React from 'react';
const shell={width:'100%',minHeight:'var(--control-h-md)',padding:'0 16px',borderRadius:'var(--radius-md)',
  background:'var(--surface-card)',border:'var(--border-w-strong) solid var(--border-default)',
  fontFamily:'var(--font-body)',fontSize:'var(--text-body-md)',color:'var(--text-title)',outline:'none',
  transition:'border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)'};
export function Input({label,hint,error,suffix,prefix,id,style,...rest}){
  const [foc,setFoc]=React.useState(false);
  const rid=id||React.useId();
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'var(--space-2)',width:'100%'}},
    label&&React.createElement('label',{htmlFor:rid,style:{font:'var(--type-label)',color:'var(--text-muted)'}},label),
    React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,...shell,
      borderColor:error?'var(--status-danger)':foc?'var(--border-focus)':'var(--border-default)',
      boxShadow:foc?(error?'var(--ring-danger)':'var(--ring-focus)'):'none',...style}},
      prefix,
      React.createElement('input',{id:rid,onFocus:()=>setFoc(true),onBlur:()=>setFoc(false),
        style:{flex:1,border:'none',outline:'none',background:'transparent',font:'inherit',color:'inherit',minWidth:0,padding:'10px 0'},...rest}),
      suffix),
    (hint||error)&&React.createElement('span',{style:{fontSize:'var(--text-caption-sm)',color:error?'var(--status-danger)':'var(--text-muted)'}},error||hint));
}