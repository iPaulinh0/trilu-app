import React from 'react';

export function StatTile({value,unit,label,tone='violet',icon,style,...rest}){
  const c={violet:'var(--violet-600)',coral:'var(--coral-600)',mint:'var(--mint-700)',sun:'var(--sun-800)',ink:'var(--text-title)'}[tone]||'var(--violet-600)';
  return React.createElement('div',{style:{background:'var(--surface-card)',borderRadius:'var(--radius-md)',
    padding:'var(--space-4)',boxShadow:'var(--shadow-card)',display:'flex',flexDirection:'column',gap:2,...style},...rest},
    icon&&React.createElement('span',{style:{color:c,marginBottom:4,display:'flex'}},icon),
    React.createElement('div',{style:{display:'flex',alignItems:'baseline',gap:4}},
      React.createElement('span',{style:{fontFamily:'var(--font-numeric)',fontWeight:'var(--weight-extrabold)',fontSize:'var(--text-title-lg)',color:c,lineHeight:1}},value),
      unit&&React.createElement('span',{style:{fontSize:'var(--text-caption)',fontWeight:'var(--weight-bold)',color:'var(--text-muted)'}},unit)),
    React.createElement('span',{style:{fontSize:'var(--text-caption-sm)',color:'var(--text-muted)'}},label));
}