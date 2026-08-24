import React from 'react';

const sz={xs:28,sm:36,md:44,lg:64,xl:96};
export function Avatar({src,name='',size='md',ring,style,...rest}){
  const d=sz[size]||44;
  const initials=name.trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
  return React.createElement('div',{style:{width:d,height:d,borderRadius:'var(--radius-pill)',overflow:'hidden',
    display:'inline-flex',alignItems:'center',justifyContent:'center',flex:'0 0 auto',background:'var(--violet-100)',
    color:'var(--violet-700)',fontFamily:'var(--font-display)',fontWeight:'var(--weight-bold)',fontSize:d*0.36,
    boxShadow:ring?'0 0 0 3px '+ring:'none',...style},...rest},
    src?React.createElement('img',{src,alt:name,style:{width:'100%',height:'100%',objectFit:'cover'}}):initials);
}