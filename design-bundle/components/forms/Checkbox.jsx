import React from 'react';

export function Checkbox({label,checked,onChange,disabled,style,...rest}){
  return React.createElement('label',{style:{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',
    minHeight:'var(--tap-min)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,...style}},
    React.createElement('input',{type:'checkbox',checked,onChange,disabled,style:{position:'absolute',opacity:0,width:0,height:0},...rest}),
    React.createElement('span',{style:{width:24,height:24,flex:'0 0 auto',borderRadius:'var(--radius-xs)',
      display:'inline-flex',alignItems:'center',justifyContent:'center',
      background:checked?'var(--mint-500)':'var(--surface-card)',
      border:'var(--border-w-strong) solid '+(checked?'var(--mint-500)':'var(--border-strong)'),
      transition:'all var(--dur-fast) var(--ease-bounce)'}},
      checked&&React.createElement('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'#fff',strokeWidth:3.5,strokeLinecap:'round',strokeLinejoin:'round'},React.createElement('polyline',{points:'20 6 9 17 4 12'}))),
    label&&React.createElement('span',{style:{fontSize:'var(--text-body-md)',color:'var(--text-title)'}},label));
}