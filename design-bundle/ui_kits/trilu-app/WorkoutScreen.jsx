const { AppHeader, IconButton, Card, Button, ExerciseRow, ProgressBar, Toast, Dialog, MascotBubble } = window.TriluDesignSystem_9e1798;
function WorkoutScreen({onBack,onFinish}){
  const list=[{n:'Supino reto',d:'3 séries de 10 • 32 kg',t:3},{n:'Supino inclinado',d:'3 séries de 10 • 26 kg',t:3},{n:'Crucifixo',d:'3 séries de 12 • 14 kg',t:3},{n:'Crossover',d:'3 séries de 15 • 12 kg',t:3},{n:'Tríceps corda',d:'4 séries de 12 • 20 kg',t:4}];
  const [done,setDone]=React.useState([true,false,false,false,false]);
  const [toast,setToast]=React.useState(false);
  const [ask,setAsk]=React.useState(false);
  const count=done.filter(Boolean).length;
  const toggle=i=>{const c=[...done];c[i]=!c[i];setDone(c);if(c[i]){setToast(true);setTimeout(()=>setToast(false),1800);}};
  return <div style={{position:'relative',minHeight:'100%',paddingBottom:20}}>
    <AppHeader title="Treino A • Peito" subtitle="42 min estimados"
      left={<IconButton label="Voltar" icon={<Ico n="ChevronLeft" s={22}/>} onClick={onBack}/>}
      right={<IconButton label="Mais" icon={<Ico n="MoreHorizontal" s={22}/>}/>}/>
    <div style={{padding:'0 var(--gutter-screen)',display:'flex',flexDirection:'column',gap:14}}>
      <Card tone="brand" padding="18px">
        <div style={{font:'var(--type-label)',letterSpacing:'.08em',opacity:.8,marginBottom:8}}>PROGRESSO DO TREINO</div>
        <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:12}}>
          <span style={{fontFamily:'var(--font-numeric)',fontWeight:800,fontSize:36,lineHeight:1}}>{count}</span>
          <span style={{opacity:.8,fontWeight:700}}>de {list.length} exercícios</span>
        </div>
        <div style={{height:10,borderRadius:99,background:'rgba(255,255,255,.25)'}}><div style={{width:(count/list.length*100)+'%',height:'100%',borderRadius:99,background:'var(--trilu-mint)',transition:'width var(--dur-slow) var(--ease-out)'}}/></div>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {list.map((e,i)=><ExerciseRow key={i} name={e.n} detail={e.d} setsDone={done[i]?e.t:0} setsTotal={e.t} done={done[i]} onClick={()=>toggle(i)}
          right={<span style={{color:'var(--text-subtle)',display:'flex'}}><Ico n="ChevronRight" s={20}/></span>}/>)}
      </div>
      <MascotBubble mascotSrc="../../assets/mascot-tilu.png" size={60} message="Hoje conta, mesmo que seja mais leve."/>
      <Button variant="success" size="lg" block onClick={()=>setAsk(true)}>Concluir treino</Button>
    </div>
    {toast && <div style={{position:'absolute',left:16,right:16,top:70,zIndex:40}}><Toast tone="celebrate" title="Boa! Mais um exercício concluído." icon={<Ico n="PartyPopper" s={20}/>}/></div>}
    <Dialog open={ask} title="Concluir treino?" onClose={()=>setAsk(false)}
      footer={<><Button variant="outline" block onClick={()=>setAsk(false)}>Voltar</Button><Button variant="success" block onClick={()=>{setAsk(false);onFinish&&onFinish();}}>Concluir</Button></>}>
      Você avançou {count} de {list.length} exercícios. Sua jornada continua daqui.
    </Dialog>
  </div>;
}
window.WorkoutScreen=WorkoutScreen;