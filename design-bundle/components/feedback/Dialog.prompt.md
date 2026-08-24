Bottom-sheet modal (24px top corners, grab handle, blurred scrim) — Trilu never uses centered desktop-style modals in the app.

```jsx
<Dialog title="Encerrar treino?" footer={<><Button variant="outline" block>Voltar</Button><Button variant="accent" block>Encerrar</Button></>} />
```
Place inside a `position:relative` phone frame.