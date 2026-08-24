const { AppHeader, Avatar, Card, Button, Badge, TrailPath, StreakRow, StatTile, ProgressBar, IconButton } = window.TriluDesignSystem_9e1798;
function HomeScreen({onStart}){
  return <div style={{paddingBottom:20}}>
    <AppHeader title="Olá, Paulo!" subtitle="Faltam 2 passos para o marco"
      right={<div style={{display:'flex',gap:4,alignItems:'center'}}><IconButton variant="ghost" label="Notificações" icon={<Ico n="Bell" s={22}/>}/><Avatar name="Paulo Reis" size="sm" ring="var(--trilu-mint)"/></div>}/>
    <div style={{padding:'0 var(--gutter-screen)',display:'flex',flexDirection:'column',gap:16}}>
      <Card padding="16px 12px 8px">
        <TrailPath width={318} currentIndex={2} avatarSrc="../../assets/mascot-tilu.png"
          milestones={[{label:'Início'},{label:'7 dias'},{label:'Recorde'},{label:'30 dias'},{label:'Meta'}]}/>
      </Card>
      <Card tone="accent" padding="18px">
        <Badge tone="coral">Missão de hoje</Badge>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:24,color:'var(--text-title)',margin:'10px 0 4px'}}>Treino A • Peito</div>
        <div style={{fontSize:14,color:'var(--text-body)',marginBottom:16}}>5 exercícios • cerca de 42 min</div>
        <Button variant="accent" size="lg" block onClick={onStart} iconLeft={<Ico n="Play" s={18}/>}>COMEÇAR TREINO</Button>
      </Card>
      <Card>
        <div style={{font:'var(--type-label)',letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:12}}>Sua semana</div>
        <StreakRow days={['done','done','rest','done','today','empty','empty']}/>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <StatTile value="12" unit="dias" label="Sequência" tone="mint" icon={<Ico n="Flame" s={20}/>}/>
        <StatTile value="32" unit="kg" label="Recorde no supino" tone="coral" icon={<Ico n="Trophy" s={20}/>}/>
      </div>
      <Card tone="flat">
        <ProgressBar value={3} max={4} tone="coral" label="Marco de 7 dias" valueLabel="3 de 4 passos"/>
      </Card>
    </div>
  </div>;
}
window.HomeScreen=HomeScreen;