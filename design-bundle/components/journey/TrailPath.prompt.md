The brand's signature graphic: a curved dotted trail with milestone nodes. Never render it as a straight bar or a rigid grid — "linhas orgânicas, caminhos curvos".

```jsx
<TrailPath width={520} currentIndex={2} avatarSrc="assets/mascot-tilu.png"
  milestones={[{label:'Início'},{label:'7 dias'},{label:'Recorde'},{label:'30 dias'},{label:'Meta'}]} />
```

Node colors are fixed: passed = mint, current = coral (pulsing), final = sun, locked = grey.