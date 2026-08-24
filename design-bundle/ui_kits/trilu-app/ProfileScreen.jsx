const { AppHeader, Card, Avatar, StatTile, Switch, Checkbox, Select, Button, MilestoneChip } = window.TriluDesignSystem_9e1798;
function ProfileScreen({onRestart}){
  const [rem,setRem]=React.useState(true);
  const [soc,setSoc]=React.useState(true);
  return <div style={{paddingBottom:20}}>
    <AppHeader title="Perfil"/>
    <div style={{padding:'0 var(--gutter-screen)',display:'flex',flexDirection:'column',gap:14}}>
      <Card padding="20px">
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <Avatar name="Paulo Reis" size="lg" ring="var(--trilu-mint)"/>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:20,color:'var(--text-title)'}}>Paulo Reis</div>
            <div style={{fontSize:13,color:'var(--text-muted)'}}>Objetivo: voltar à rotina • desde mai 2026</div>
          </div>
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
        <StatTile value="48" label="Treinos" tone="violet"/>
        <StatTile value="12" label="Sequência" tone="mint"/>
        <StatTile value="3" label="Marcos" tone="sun"/>
      </div>
      <Card>
        <div style={{font:'var(--type-label)',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:12}}>Hábitos de hoje</div>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          <Checkbox label="Beber 2 L de água" checked onChange={()=>{}}/>
          <Checkbox label="Alongar 5 min"/>
          <Checkbox label="Dormir 7 h"/>
        </div>
      </Card>
      <Card>
        <div style={{font:'var(--type-label)',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:12}}>Ajustes</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <Switch label="Lembrete diário" checked={rem} onChange={e=>setRem(e.target.checked)}/>
          <Switch label="Mostrar meus marcos aos companheiros" checked={soc} onChange={e=>setSoc(e.target.checked)}/>
          <div style={{marginTop:10}}><Select label="Objetivo" options={[{value:'a',label:'Voltar à rotina'},{value:'b',label:'Ganhar força'},{value:'c',label:'Competir comigo mesmo'}]}/></div>
        </div>
      </Card>
      <MilestoneChip state="goal" label="Meta de 30 dias" caption="faltam 18 dias" style={{width:'100%'}}/>
      <Button variant="outline" block onClick={onRestart}>Rever a introdução</Button>
    </div>
  </div>;
}
window.ProfileScreen=ProfileScreen;