function App(){
  const [onboarded,setOnboarded]=React.useState(false);
  const [tab,setTab]=React.useState('home');
  const inner=!onboarded ? <OnboardingScreen onDone={()=>setOnboarded(true)}/>
    : tab==='home' ? <HomeScreen onStart={()=>setTab('treino')}/>
    : tab==='treino' ? <WorkoutScreen onBack={()=>setTab('home')} onFinish={()=>setTab('home')}/>
    : tab==='amigos' ? <FriendsScreen/>
    : <ProfileScreen onRestart={()=>setOnboarded(false)}/>;
  return <PhoneFrame tab={tab} onTab={setTab} showNav={onboarded}>{inner}</PhoneFrame>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);