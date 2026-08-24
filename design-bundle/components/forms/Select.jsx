import React from 'react';

export function Select({label,hint,options=[],id,style,...rest}){
  const [foc,setFoc]=React.useState(false);
  const rid=id||React.useId();
  return React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'var(--space-2)',width:'100%'}},
    label&&React.createElement('label',{htmlFor:rid,style:{font:'var(--type-label)',color:'var(--text-muted)'}},label),
    React.createElement('select',{id:rid,onFocus:()=>setFoc(true),onBlur:()=>setFoc(false),
      style:{width:'100%',minHeight:'var(--control-h-md)',padding:'0 40px 0 16px',borderRadius:'var(--radius-md)',
        appearance:'none',background:"var(--surface-card) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236C7A9C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\") no-repeat right 14px center",
        border:'var(--border-w-strong) solid '+(foc?'var(--border-focus)':'var(--border-default)'),
        boxShadow:foc?'var(--ring-focus)':'none',fontFamily:'var(--font-body)',fontSize:'var(--text-body-md)',
        color:'var(--text-title)',outline:'none',cursor:'pointer',...style},...rest},
      options.map(o=>React.createElement('option',{key:o.value,value:o.value},o.label))),
    hint&&React.createElement('span',{style:{fontSize:'var(--text-caption-sm)',color:'var(--text-muted)'}},hint));
}