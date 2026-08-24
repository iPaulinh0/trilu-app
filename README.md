This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Autenticação (Supabase Auth)

O TRILU usa [Supabase Auth](https://supabase.com/docs/guides/auth) via `@supabase/ssr`, com sessão em cookies (não em `localStorage`). O app oferece: cadastro com nome/e-mail/senha, confirmação de e-mail por código de 6 dígitos, login com e-mail/senha, login social com **Google** (Apple foi removida do escopo), recuperação de senha e logout real.

Toda a integração fica atrás de `AuthService` (`src/features/auth/domain/auth-service.ts`), implementado por `createSupabaseAuthService` (`src/features/auth/data/supabase-auth-service.ts`). Nenhum componente visual chama o Supabase diretamente — isso mantém a regra de negócio portável para um futuro cliente React Native (que só precisaria trocar o client `@supabase/supabase-js` injetado, mantendo a mesma interface).

### Arquitetura

```
src/lib/supabase/
  client.ts    → cliente para Client Components (@supabase/ssr, createBrowserClient)
  server.ts    → cliente para Server Components / Route Handlers (cookies via next/headers)

src/proxy.ts   → renova o cookie de sessão a cada request (Next.js 16 renomeou
                 middleware.ts → proxy.ts; veja node_modules/next/dist/docs se
                 você atualizar o Next.js — a convenção pode mudar de novo)

src/features/auth/
  domain/       → AuthService (contrato), tipos, zod schemas, sanitize-next
  data/         → supabase-auth-service.ts (implementação real),
                  map-supabase-auth-error.ts (traduz erros do Supabase para
                  mensagens em PT-BR, nunca expõe o texto técnico original),
                  pending-email-storage.ts (sessionStorage — só o e-mail
                  pendente de confirmação, nunca a senha)
  components/   → LoginForm, SignupForm, ConfirmEmailForm, OtpInput,
                  ForgotPasswordForm, ResetPasswordForm, SocialAuthButtons
  hooks/        → useCurrentUser (estado reativo via supabase.auth.onAuthStateChange)

src/app/
  login/, cadastro/, confirmar-email/, esqueci-senha/, redefinir-senha/
  auth/callback/route.ts  → troca o code (PKCE) por sessão — usado tanto
                            pelo OAuth do Google quanto pelo link de
                            recuperação de senha
  (app)/layout.tsx        → Server Component: protege Trilha/Treinos/Perfil
                            com supabase.auth.getClaims() ANTES de renderizar
                            qualquer coisa — nunca confia em sessão vinda do
                            navegador para autorização
```

`getUserId()` nos outros repositórios locais (hábitos, treinos, trilha) continua síncrono — mudar isso exigiria reescrever ~10 repositórios já existentes, fora do escopo desta integração. Em vez disso, `src/lib/services.ts` espelha o `onAuthStateChange` do Supabase num cache em memória (só id/nome, nunca token) que esses repositórios já sabiam ler.

### O que ainda depende de credenciais externas

Sem um projeto Supabase real conectado, o build/lint/typecheck/testes passam normalmente (a suíte usa mocks na camada de infraestrutura), mas **nenhum fluxo de rede pode ser validado de ponta a ponta** nesta sessão — cadastro, confirmação por código, login, OAuth do Google e recuperação de senha exigem um projeto Supabase real com as configurações abaixo. `.env.local` recebeu valores de placeholder (`https://placeholder-project.supabase.co`) só para o app não quebrar ao subir localmente; troque-os pelos valores reais do seu projeto.

### Configuração do Supabase Auth — checklist

No painel do Supabase (**Authentication**):

- [ ] **URL Configuration → Site URL**: `http://localhost:3000` em desenvolvimento.
- [ ] **URL Configuration → Site URL** (produção): a URL pública do app.
- [ ] **URL Configuration → Redirect URLs**: adicione `{SITE_URL}/auth/callback` para cada ambiente (dev e produção).
- [ ] **Providers → Email**: ativado, com **Confirm email** ativado (exige o código de 6 dígitos antes do login).
- [ ] **Email Templates → Confirm signup**: use `{{ .Token }}` (veja abaixo) — sem isso, o Supabase manda só um link, e a tela `/confirmar-email` não tem código para validar.
- [ ] **SMTP**: configure um SMTP de produção antes do lançamento (veja o alerta abaixo).
- [ ] **Providers → Google**: Client ID + Client Secret (veja "Login com Google").
- [ ] Variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`) preenchidas em cada ambiente.

#### Template de e-mail (código de 6 dígitos)

`Authentication → Email Templates → Confirm signup` precisa usar `{{ .Token }}`, não apenas `{{ .ConfirmationURL }}`:

```html
<h2>Confirme seu e-mail no TRILU</h2>

<p>Seu código de confirmação é:</p>

<div style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">
  {{ .Token }}
</div>

<p>Digite este código no aplicativo para concluir seu cadastro.</p>

<p>Se você não criou uma conta no TRILU, ignore esta mensagem.</p>
```

O mesmo HTML já está em `supabase/templates/confirmation.html` e é usado automaticamente por `supabase start` (ambiente local) — mas o painel do projeto hospedado precisa da mesma alteração manual, pois `supabase/config.toml` só afeta o Supabase local.

#### Login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/), crie um **OAuth Client ID** do tipo **Web application**.
2. Configure a **tela de consentimento OAuth** (nome do app, e-mail de suporte).
3. Em **Authorized JavaScript origins**, adicione as origens de desenvolvimento e produção (ex.: `http://localhost:3000`, `https://seu-dominio.com`).
4. Em **Authorized redirect URIs**, adicione a callback do Supabase (não a do app):
   ```
   https://SEU_PROJECT_REF.supabase.co/auth/v1/callback
   ```
5. Copie o Client ID e o Client Secret para **Authentication → Providers → Google** no Supabase.
6. Confirme que **Site URL** e **Redirect URLs** (seção anterior) já incluem `/auth/callback` do próprio app — é para lá que o Supabase manda o usuário depois de autenticar com o Google.

O app só pede os escopos `openid`, `email` e `profile` (`signInWithGoogle()` em `supabase-auth-service.ts`) — nada além disso.

#### SMTP — atenção antes de lançar

O SMTP padrão do Supabase é destinado a **desenvolvimento e testes** — tem limite de envio baixo e não é adequado para produção. Antes do lançamento:

- Configure um provedor de SMTP próprio em **Project Settings → Auth → SMTP Settings**.
- Documente o remetente (`from`), o domínio de envio, e os registros **SPF**, **DKIM** e **DMARC** do domínio.
- Nunca versione credenciais de SMTP no repositório — elas vão em variáveis de ambiente/segredos do provedor de e-mail, nunca em `.env.example` ou em código.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores do seu projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Nunca coloque no frontend: a chave `service_role`, o Client Secret do Google, ou qualquer outra credencial privada — só a URL do projeto e a chave publicável (`anon`/`publishable`) são seguras no navegador.

### Migrations

`supabase/migrations/20260824000000_create_profiles.sql` cria:

- `public.profiles` (`id`, `full_name`, `avatar_url`, `onboarding_completed`, `created_at`, `updated_at`), com RLS habilitado e políticas de **select**/**update** restritas a `auth.uid() = id` (ninguém lê ou altera o perfil de outra pessoa; não há política de insert/delete para usuários autenticados — só o trigger, como `security definer`, insere linhas).
- Um trigger (`on_auth_user_created`) que cria a linha em `profiles` automaticamente quando um usuário é criado em `auth.users`, usando `ON CONFLICT DO NOTHING` para nunca sobrescrever uma linha já existente.

Aplique com `supabase db push` (projeto linkado) ou colando o SQL no **SQL Editor** do painel. Se `public.profiles` já existir no seu projeto com colunas diferentes, adapte a migration para ser incremental e preservar os dados existentes, em vez de recriar a tabela.

A foto de perfil (`src/features/profile/`, feature de uma etapa anterior) continua usando IndexedDB local — esta integração não mexeu nisso; `avatar_url` na tabela existe para uso futuro caso o app passe a usar Supabase Storage.

### Como testar cada fluxo

Sem um projeto Supabase real, os fluxos abaixo não podem ser exercitados de ponta a ponta — mas o restante do app (schemas, sanitização de `next`, mapeamento de erros, o Route Handler do callback com um client mockado) tem testes automatizados (`npm test`). Com um projeto real conectado:

- **Cadastro + confirmação**: crie uma conta em `/cadastro`; se tiver o [ambiente local do Supabase](https://supabase.com/docs/guides/local-development) rodando (`supabase start`), o Inbucket local (normalmente `http://localhost:54324`) mostra o e-mail com o código, sem precisar de SMTP real.
- **Reenvio**: na tela `/confirmar-email`, aguarde os 60s do cooldown de UI e reenvie; o Supabase aplica seus próprios limites de taxa por baixo (a UI só evita cliques óbvios em excesso).
- **Login**: `/login` com a conta recém-confirmada.
- **Google**: `/login` → "Continuar com Google" (precisa do provider configurado, ver acima).
- **Recuperação de senha**: `/esqueci-senha` → link no e-mail (ou Inbucket local) → deve cair em `/auth/callback?next=/redefinir-senha` → `/redefinir-senha`.
- **Logout**: `/perfil` → "Sair" → confirma → deve cair em `/` (introdução pública), sem a navegação inferior, e o botão Voltar do navegador não deve reabrir `/trilha` nem `/perfil`.
