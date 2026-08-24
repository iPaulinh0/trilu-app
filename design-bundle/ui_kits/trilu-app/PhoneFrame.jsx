const { TabBar } = window.TriluDesignSystem_9e1798;
function Ico({n,s=22}){const r=React.useRef(null);React.useEffect(()=>{const d=window.lucide.icons[n];if(d&&r.current){const el=window.lucide.createElement(d);el.setAttribute('width',s);el.setAttribute('height',s);r.current.innerHTML=el.outerHTML;}},[n,s]);return <span ref={r} style={{display:'inline-flex'}}/>;}
const NAV=[{value:'home',label:'Trilha',icon:<Ico n="Route"/>},{value:'treino',label:'Treino',icon:<Ico n="Dumbbell"/>},{value:'amigos',label:'Amigos',icon:<Ico n="Users"/>},{value:'perfil',label:'Perfil',icon:<Ico n="User"/>}];
function PhoneFrame({children,tab,onTab,showNav=true}){
  return <div style={{width:390,height:844,background:'var(--surface-app)',borderRadius:44,overflow:'hidden',boxShadow:'var(--shadow-overlay)',display:'flex',flexDirection:'column',position:'relative',border:'8px solid #10182C'}}>
    <div style={{height:44,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 26px',fontSize:13,fontWeight:800,color:'var(--text-title)',flex:'0 0 auto'}}>
      <span>9:41</span><span style={{display:'flex',gap:5,opacity:.8}}><Ico n="Signal" s={15}/><Ico n="Wifi" s={15}/><Ico n="BatteryFull" s={15}/></span>
    </div>
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden'}}>{children}</div>
    {showNav && <TabBar value={tab} onChange={onTab} items={NAV} style={{flex:'0 0 auto'}}/>}
  </div>;
}
Object.assign(window,{PhoneFrame,Ico});