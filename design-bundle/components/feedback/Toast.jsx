import React from 'react';

export function Toast({tone='success',title,message,icon,onClose,style,...rest}){
  const t={success:['var(--mint-50)','var(--mint-700)'],celebrate:['var(--sun-50)','var(--sun-800)'],info:['var(--violet-50)','var(--violet-700)'],danger:['var(--status-danger-soft)','var(--status-danger)']}[tone]||['var(--mint-50)','var(--mint-700)'];
  return React.createElement('div',{role:'status',style:{display:'flex',alignItems:'flex-start',gap:'var(--space-3)',
    background:t[0],borderRadius:'var(--radius-md)',padding:'var(--space-4)',boxShadow:'var(--shadow-raised)',
    animation:'trilu-rise var(--dur-base) var(--ease-out)',maxWidth:420,...style},...rest},
    icon&&React.createElement('span',{style:{color:t[1],display:'flex'}},icon),
    React.createElement('div',{style:{flex:1}},
      React.createElement('div',{style:{fontFamily:'var(--font-display)',fontWeight:'var(--weight-bold)',color:t[1],fontSize:'var(--text-body-md)'}},title),
      message&&React.createElement('div',{style:{fontSize:'var(--text-caption)',color:'var(--text-body)',marginTop:2}},message)),
    onClose&&React.createElement('button',{onClick:onClose,'aria-label':'Fechar',style:{border:'none',background:'transparent',cursor:'pointer',color:'var(--text-muted)',fontSize:18,lineHeight:1}},'×'));
}