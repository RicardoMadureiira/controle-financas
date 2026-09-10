# Como funciona o login Google

## Fluxo

1. `GoogleOAuthProvider` carrega o Google Identity Services no frontend.
2. `LandingPage` recebe um ID Token quando a pessoa escolhe sua conta.
3. `AuthContext` envia esse token e o antigo `anonUserId` para `POST /auth/google`.
4. `AuthController` usa `google-auth-library` para validar assinatura, validade e `GOOGLE_CLIENT_ID`.
5. O usuário é criado ou atualizado pelo `googleSub`, identificador estável da conta Google.
6. As movimentações anônimas são vinculadas ao novo `userId`.
7. O backend gera um token aleatório, guarda apenas seu hash em `sessions` e envia o original em cookie HttpOnly.
8. O middleware `authenticate` lê o cookie em cada rota protegida e define o usuário da requisição.

O frontend nunca envia um `userId` para escolher o dono das movimentações. A API sempre obtém esse valor da sessão validada.

## Cache offline

Cada conta usa uma chave própria no `localStorage`: `finance.transactions.v3.<userId>`. No primeiro login, o cache anônimo anterior é combinado com o cache da conta. Ao sair ou excluir a conta, o cache daquele usuário é apagado do aparelho.

## Variáveis

Frontend (`.env` e Vercel):

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

Backend (`.env` e Render):

```env
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
CORS_ORIGIN=http://localhost:5173,https://controle-financas-rm.vercel.app
```

O Client ID deve ser o mesmo nos dois ambientes. No Google Cloud, cadastre `http://localhost:5173` e `https://controle-financas-rm.vercel.app` como origens JavaScript autorizadas.

## Deploy

O proxy em `vercel.json` encaminha `/api/*` para o Render. Isso faz o cookie da sessão funcionar como cookie do mesmo site no frontend publicado.

Antes de publicar o frontend, aplique o novo schema no MongoDB e publique o backend:

```bash
npx prisma db push
```

No Render, o Build Command pode executar de forma controlada:

```bash
npm ci && npx prisma generate && npx prisma db push && npm run build
```
