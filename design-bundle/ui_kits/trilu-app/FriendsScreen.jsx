const { AppHeader, Card, Avatar, Badge, Tabs, MilestoneChip, Button, IconButton } = window.TriluDesignSystem_9e1798;
function FriendsScreen(){
  const [tab,setTab]=React.useState('companheiros');
  const people=[{n:'Ana Lima',s:'Treinou hoje • 9 dias seguidos',r:'var(--trilu-mint)'},{n:'Bruno Sá',s:'Marco de 30 dias alcançado',r:'var(--trilu-sun)'},{n:'Carla Reis',s:'Voltou depois de uma pausa',r:'var(--trilu-coral)'},{n:'Diego Alves',s:'Treinou ontem • 4 dias seguidos'}];
  return <div style={{paddingBottom:20}}>
    <AppHeader title="Companheiros" subtitle="Gente que caminha junto"
      right={<IconButton variant="soft" label="Convidar" icon={<Ico n="UserPlus" s={20}/>}/>}/>
    <div style={{padding:'0 var(--gutter-screen)',display:'flex',flexDirection:'column',gap:14}}>
      <Tabs value={tab} onChange={setTab} items={[{value:'companheiros',label:'Companheiros'},{value:'marcos',label:'Marcos'}]}/>
      {tab==='companheiros' ? <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {people.map((p,i)=><Card key={i} padding="14px" interactive>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Avatar name={p.n} size="md" ring={p.r}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,color:'var(--text-title)'}}>{p.n}</div>
              <div style={{fontSize:13,color:'var(--text-muted)'}}>{p.s}</div>
            </div>
            <Button variant="ghost" size="sm">Cutucar</Button>
          </div>
        </Card>)}
      </div> : <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <MilestoneChip state="done" label="Ana chegou aos 7 dias" caption="há 2 dias" style={{width:'100%'}}/>
        <MilestoneChip state="done" label="Bruno bateu o recorde no agachamento" caption="há 4 dias" style={{width:'100%'}}/>
        <MilestoneChip state="current" label="Você: faltam 2 passos" caption="Marco de 7 dias" style={{width:'100%'}}/>
        <MilestoneChip state="locked" label="Marco de 30 dias" caption="a caminho" style={{width:'100%'}}/>
      </div>}
      <Card tone="celebrate" padding="16px">
        <Badge tone="sun">Companhia, não competição</Badge>
        <div style={{marginTop:10,fontSize:14,color:'var(--text-body)',lineHeight:1.6}}>Amigos aparecem como companheiros de trilha. Não existe ranking nem placar no Trilu.</div>
      </Card>
    </div>
  </div>;
}
window.FriendsScreen=FriendsScreen;