const { Button, Radio, MascotBubble, Badge } = window.TriluDesignSystem_9e1798;
function OnboardingScreen({onDone}){
  const [step,setStep]=React.useState(0);
  const [goal,setGoal]=React.useState('rotina');
  return <div style={{padding:'8px var(--gutter-screen) 28px',display:'flex',flexDirection:'column',minHeight:'100%',gap:20}}>
    <img src="../../assets/logo.svg" alt="Trilu" style={{height:30,alignSelf:'flex-start'}}/>
    {step===0 ? <>
      <div style={{display:'flex',justifyContent:'center'}}><img src="../../assets/mascot-tilu.png" alt="Tilu" style={{width:220}}/></div>
      <h1 style={{fontSize:32,lineHeight:1.15}}>Seu objetivo vira caminho.</h1>
      <p style={{margin:0,color:'var(--text-body)',fontSize:16,lineHeight:1.65}}>Oi, eu sou o Tilu. Vou te acompanhar em cada passo — no seu ritmo, sem cobrança.</p>
      <div style={{flex:1}}/>
      <Button variant="accent" size="lg" block onClick={()=>setStep(1)}>Começar</Button>
      <button style={{border:'none',background:'none',color:'var(--text-muted)',fontSize:14,fontWeight:700,cursor:'pointer'}}>Já tenho conta</button>
    </> : <>
      <Badge tone="violet">Passo 2 de 2</Badge>
      <h1 style={{fontSize:26,lineHeight:1.2}}>Qual é o seu próximo objetivo?</h1>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <Radio name="goal" label="Voltar à rotina" description="2 treinos por semana" checked={goal==='rotina'} onChange={()=>setGoal('rotina')}/>
        <Radio name="goal" label="Ganhar força" description="4 treinos por semana" checked={goal==='forca'} onChange={()=>setGoal('forca')}/>
        <Radio name="goal" label="Competir comigo mesmo" description="5 treinos por semana" checked={goal==='comp'} onChange={()=>setGoal('comp')}/>
      </div>
      <MascotBubble mascotSrc="../../assets/mascot-tilu.png" size={64} message="Dá pra mudar depois. Comece pelo que cabe hoje."/>
      <div style={{flex:1}}/>
      <Button variant="accent" size="lg" block onClick={onDone}>Montar minha trilha</Button>
    </>}
  </div>;
}
window.OnboardingScreen=OnboardingScreen;