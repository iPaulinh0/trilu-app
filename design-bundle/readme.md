# Trilu Design System

**Trilu** é um app de treino gamificado que transforma um objetivo escolhido pelo usuário em uma trilha de marcos. A promessa da marca: *constância sem culpa, progresso visível*. A assinatura principal é **"Todo treino te leva mais longe."**

- **Naming** — `TRI` (trilha, treino, trajetória) + `LU` (lúdico, leve, humano).
- **Posicionamento** — para quem quer começar, voltar ou competir consigo mesmo, sem planilhas frias nem pressão tóxica.
- **Ideia central** — *A vitória não é acumular XP. É chegar mais perto.*
- **Personalidade** — carismática, motivadora, acolhedora, competitiva na medida.
- **Mascote** — **Tilu**, um tatu explorador brasileiro: curioso, otimista e persistente. Guia o onboarding, celebra marcos e facilita o retorno depois de uma pausa.

## Fontes deste design system

| Fonte | O que foi extraído |
| --- | --- |
| `uploads/trilu-branding-kit.pdf` (cópia em `assets/trilu-branding-kit.pdf`) | 11 páginas: estratégia, naming, logo, cores, tipografia, mascote, sistema visual, voz, produto, próximos passos. **Ground truth de tudo aqui.** |
| `uploads/trilu-logo.svg` / `.png` | Marca principal (símbolo + lettering) → `assets/logo.svg`, `assets/logo.png` |
| `uploads/tilu-1.png` | Ilustração do mascote Tilu → `assets/mascot-tilu.png` |

Não foram fornecidos: código de produção, arquivo Figma, telas exportadas ou biblioteca de componentes. O kit é uma **direção inicial (ago 2026)**, com o conceito ainda sujeito a validação jurídica — o próprio kit recomenda usar TRILU como nome de trabalho do MVP.

### Produtos representados
Um só: o **app mobile Trilu** (`ui_kits/trilu-app/`). O kit descreve a tela inicial em texto e um wireframe pequeno; não há site, painel web ou deck de slides no material, então nenhum foi criado.

---

## Content fundamentals

**Idioma.** Português do Brasil. Toda a interface, sem mistura com inglês. Termos de treino em português (`séries`, `repetições`, `carga`), nunca `sets`/`reps`.

**Pessoa.** Fala-se com **você**; o app nunca fala de si na primeira pessoa, exceto pela voz do Tilu ("eu sou o Tilu, vou te acompanhar"). O usuário é sempre sujeito da frase: *Você avançou*, não *Registramos seu avanço*.

**Tom.** Curto, próximo e otimista — como um parceiro de treino, não como um treinador que cobra.

**Vocabulário da marca.** passo · marco · jornada · trilha · ritmo · conquista · companhia · companheiro.

**Vocabulário proibido.** XP · pontos · ranking · placar · punição · fracasso · falha · corpo ideal · culpa · promessas absolutas ("resultados garantidos", "em 30 dias").

**Fale assim / evite** (verbatim do kit):

| ✓ Fale assim | × Evite |
| --- | --- |
| Boa! Você avançou mais um marco. | Você falhou sua sequência! |
| Hoje conta, mesmo que seja mais leve. | Sem desculpas. Vá treinar. |
| Sua jornada continua daqui. | Corpo perfeito em 30 dias. |

**Caixa.** Caixa alta só em labels curtos e no rótulo do botão principal (`COMEÇAR TREINO`, `MISSÃO DE HOJE`). O kit é explícito: *evite caixa alta em textos longos*.

**Comprimento.** Títulos de 2–6 palavras. Corpo em uma ou duas frases. Toasts em uma frase — a celebração dura 1–2 s, o texto tem que caber nesse tempo.

**Emoji.** Não. O sistema não usa emoji em nenhuma superfície; a expressividade vem do Tilu e das cores. Os únicos glifos unicode usados são `✓` e `×` dentro de checks e listas de "evite".

**Pausas e retorno.** Quando o usuário some, o app convida sem culpar: *Sua jornada continua daqui.* Dias de descanso são um estado próprio (violeta claro), nunca um buraco vazio na semana.

**Regras do Tilu.** NUNCA culpar, humilhar, sexualizar corpos ou prometer resultados.

**Social.** Amigos são **companheiros**, não adversários. Sem ranking, sem placar, sem comparação de números entre pessoas.

---

## Visual foundations

### Cor
Quatro cores de marca com papéis fixos — *violeta domina, coral chama, mint confirma, amarelo celebra*:

| Cor | Hex | Papel |
| --- | --- | --- |
| Trilu Violet | `#5B43D6` | marca, navegação, estado ativo |
| Trilu Coral | `#FF7258` | metas, próximo marco, CTA único da tela |
| Trilu Mint | `#35C99A` | sucesso, início da trilha, séries concluídas |
| Trilu Sun | `#FFC857` | conquista, celebração, meta final |
| Ink | `#17213B` | texto e sombras |
| Cloud | `#F6F7FB` | fundo do app |
| White | `#FFFFFF` | superfície de card |

Cada uma tem rampa 50→900 (`--violet-500` = a cor da marca). Uma tela usa **um** coral: o botão que leva ao próximo passo. Fundos são Cloud liso — sem gradientes de marca, sem malhas coloridas, sem texturas.

### Tipografia
- **Sora** (Bold 700 / Semibold 600) — títulos e mensagens de conquista. `letter-spacing: -0.02em`.
- **Nunito Sans** (Regular / Semibold / Bold / ExtraBold 800) — interface, corpo e números de treino. ExtraBold é reservado a métricas.
- Hierarquia do kit: headline 32–40 px · títulos 20–24 px · corpo 16 px · legendas 13–14 px. Corpo em `line-height 1.65`; títulos em 1.15–1.3.

### Espaço e layout
Escala base 4 px (`--space-1` … `--space-20`). Gutter de tela 20 px, padding de card 20 px, stack interno 12 px, seções 24 px. Coluna de conteúdo até 520 px. Alvos de toque nunca abaixo de 44 px. Layout é uma coluna com scroll; a TabBar inferior é o único elemento fixo, e o botão principal vive dentro do fluxo, não flutuando.

### Formas e cantos
16–24 px "para sensação amigável" (`--radius-md/lg/xl`). Cards em 20 px, bottom sheets em 24 px no topo. Botões e chips em pill (`999px`). Chips de ícone e caixas de contagem em 10 px. Nada com canto vivo.

### Cards
Fundo branco, raio 20 px, **sem borda**, sombra ambiente suave em ink (`0 4px 16px rgba(23,33,59,.07)`). Variantes tonais (`accent`, `success`, `celebrate`) trocam o fundo inteiro por um tint 50 e removem a sombra. Card com fundo colorido + borda lateral colorida é proibido.

### Sombras
Todas em ink translúcido, nunca preto puro. `xs` para elevação de 1 px, `card` para superfícies, `raised` para hover e toasts, `overlay` para o scrim de sheet. Botões primários carregam sombra colorida (`--shadow-brand`, `--shadow-coral`) — é o que dá o ar "apertável". Sombra interna só no estado pressionado.

### Bordas
1 px `--border-subtle` para divisórias; 2 px `--border-default` em campos de formulário — a borda mais grossa é intencional, dá peso amigável ao input. Foco: borda violeta + anel `0 0 0 3px rgba(91,67,214,.28)`.

### Animação
Curva padrão `cubic-bezier(.2,.8,.2,1)`; `cubic-bezier(.34,1.56,.64,1)` (bounce) para checks, knobs e o mascote. Durações: 150 ms hover, 220 ms transições, 360 ms barras e trilha, **1200 ms para celebração**. O kit define o limite: *confete, movimento e feedback em 1–2 s* — nunca uma animação que segura o usuário. A trilha se desenha por `stroke-dashoffset`; o nó atual pulsa em coral a cada 2,4 s. `prefers-reduced-motion` desliga tudo.

### Hover, press, disabled
- **Hover** — cards sobem 1 px e trocam para `--shadow-raised`; botões não mudam de cor, só ganham profundidade. Nada de escurecer/clarear.
- **Press** — `scale(.96)` em 90 ms. É o único feedback de toque.
- **Disabled** — `opacity: .45`, cursor `not-allowed`, cor mantida.

### Transparência e blur
Reservados ao scrim de bottom sheet: `rgba(23,33,59,.44)` + `blur(16px)`. Não há vidro fosco em cards, headers ou navegação. Barras de progresso sobre fundo violeta usam `rgba(255,255,255,.25)` como trilho.

### Imagens e ilustração
A única ilustração é o **Tilu**: PNG cartunizado, contorno escuro grosso, formas redondas, paleta quente (coral/pêssego) com faixa e punheteiras mint e tênis violeta. Não há biblioteca de fotos no material — o app não usa fotografia. Nenhum SVG novo deve ser desenhado para imitar o estilo do Tilu.

### O motivo central
*A trilha é a interface da marca.* Sempre que houver progresso, ele aparece como um caminho curvo com nós — **linhas orgânicas, nunca grades rígidas**. Início mint → nós percorridos mint → nó atual coral pulsante (com o Tilu dentro) → nós bloqueados cinza → meta amarela. O trilho não percorrido é pontilhado.

---

## Iconography

**Não há um sistema de ícones nos arquivos fornecidos** — o brand kit não inclui glifos, sprite, fonte de ícones ou biblioteca. Ele lista "ícones" apenas como item a definir na etapa de design system (seção 10).

**Substituição adotada e sinalizada: [Lucide](https://lucide.dev) 0.454.0, via CDN** (`https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js`). Escolhido por ser stroke de 2 px com cantos e terminações arredondadas — a única família open-source que combina com o raio 16–24 px e as formas redondas do Tilu. **Isto é uma substituição, não uma decisão da marca; troque assim que houver um set próprio.**

Uso:
- Tamanho 20 px em linhas e botões, 22 px na TabBar, 18 px dentro de botões.
- `stroke-width: 2`, cor sempre `currentColor` — o ícone herda a cor do contexto (violeta ativo, cinza inativo).
- Ícones usados nas telas: `route`, `dumbbell`, `users`, `user`, `bell`, `play`, `flame`, `trophy`, `chevron-left`, `chevron-right`, `more-horizontal`, `plus`, `check`, `party-popper`, `user-plus`, `sliders-horizontal`.
- **Sem emoji** em nenhuma superfície. Os únicos caracteres unicode tratados como ícone são `✓` (série/hábito concluído, dentro de um círculo mint) e `×` (fechar, e a coluna "evite" na documentação de voz).
- O chevron do `Select` é um SVG Lucide embutido como data-URI, para o campo funcionar sem JS.

O símbolo do logo (linha curva com ponto mint no início e coral no fim) é **marca, não ícone** — nunca use como glifo em listas ou botões.

---

## Index

```
styles.css              # único arquivo que consumidores linkam
tokens/                 # fonts, colors, typography, spacing, shape, motion, base
assets/                 # logo.svg, logo.png, mascot-tilu.png, fonts/, trilu-branding-kit.pdf
guidelines/             # 22 cards de fundação (Colors, Type, Spacing, Motion, Brand)
components/             # primitivos React
ui_kits/trilu-app/      # recriação clicável do app
thumbnail.html          # tile do design system
SKILL.md                # empacotamento como Agent Skill
```

### Components

| Grupo | Componentes |
| --- | --- |
| `components/core/` | **Button**, **IconButton**, **Card**, **Badge**, **Tag**, **Avatar** |
| `components/forms/` | **Input**, **Select**, **Checkbox**, **Radio**, **Switch** |
| `components/feedback/` | **ProgressBar**, **Toast**, **Dialog**, **Tooltip** |
| `components/navigation/` | **AppHeader**, **Tabs**, **TabBar** |
| `components/journey/` | **TrailPath**, **MilestoneChip**, **StreakRow**, **MascotBubble**, **StatTile**, **ExerciseRow** |

Cada componente traz `.d.ts` (contrato de props) e `.prompt.md` (quando usar + exemplo).

#### Intentional additions
O brand kit define linguagem visual, não uma lista de componentes. O conjunto base (Button, IconButton, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Dialog, Toast, Tooltip) é o padrão de um sistema novo. Além dele:

- **AppHeader** — o kit especifica cabeçalhos de tela com saudação e subtítulo ("Olá, Paulo! / Faltam 2 passos para o marco").
- **TabBar** — o app é mobile-first e precisa de navegação inferior; o kit mostra quatro áreas no produto.
- **ProgressBar** — progresso visível é a promessa central da marca.
- **TrailPath, MilestoneChip, StreakRow** — materializam "a trilha é a interface da marca" (seção 07). Sem eles o sistema não é reconhecível como Trilu.
- **MascotBubble** — o Tilu tem função definida no produto (onboarding, marcos, retorno); precisa de um componente, não de uma imagem solta.
- **StatTile, ExerciseRow** — o kit especifica números de treino em Nunito Sans e mostra exercícios com séries/repetições/carga.

### UI kits
- `ui_kits/trilu-app/` — onboarding, trilha, treino ao vivo, companheiros, perfil. Ver o README de lá.

### Substituições sinalizadas
1. **Ícones** — Lucide, por ausência de set próprio (acima).
2. **Fontes** — Sora e Nunito Sans baixados do Google Fonts (subset latin, woff2) para `assets/fonts/`. São exatamente as famílias que o kit nomeia; se houver arquivos licenciados internamente (ou um lettering proprietário, previsto na seção 10), substitua.
