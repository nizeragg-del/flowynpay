# Guia de Deploy e Configuração - Flowyn

Este guia detalha os passos necessários para colocar a plataforma Flowyn no ar usando Vercel, GitHub e o domínio `flowyn.com.br`.

---

## 1. Configuração do Domínio (flowyn.com.br)

No seu provedor de domínio (ex: Registro.br, GoDaddy, Cloudflare), aponte o domínio para a Vercel seguindo estes registros DNS:

- **Tipo A:** Nome `@` -> Valor `76.76.21.21`
- **Tipo CNAME:** Nome `www` -> Valor `cname.vercel-dns.com`

---

## 2. Variáveis de Ambiente (Vercel)

Ao importar o projeto no painel da Vercel, adicione as seguintes chaves em **Settings > Environment Variables**:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave anônima.
- `SUPABASE_SERVICE_ROLE_KEY`: **CRÍTICO** para criação de usuários via Admin API.

### Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Chave pública (pk_...).
- `STRIPE_SECRET_KEY`: Chave secreta (sk_...).
- `STRIPE_WEBHOOK_SECRET`: Gerado após configurar o endpoint de webhook na Vercel.

### Geral
- `NEXT_PUBLIC_APP_URL`: `https://flowyn.com.br`

---

## 3. Configurações de Redirect (Importante)

Para que o login e a criação de contas funcionem no domínio oficial, você deve atualizar os endereços no painel das ferramentas:

### No Supabase (Authentication > URL Configuration)
- **Site URL**: `https://flowyn.com.br`
- **Redirect URLs**:
  - `https://flowyn.com.br/auth/callback`
  - `https://flowyn.com.br/accept-invite`

### No Stripe (Developers > Webhooks)
- Adicione um novo endpoint: `https://flowyn.com.br/api/stripe/webhook`
- Selecione os eventos: `checkout.session.completed` e `checkout.session.expired`.
- Copie o **Webhook Secret** gerado e adicione na Vercel.

---

## 4. Comandos de Manutenção

Se precisar rodar o projeto localmente após o deploy:
```bash
npm install
npm run dev
```

---

*Guia gerado automaticamente para o projeto FlowynPay.*
