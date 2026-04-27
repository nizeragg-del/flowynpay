# @flowyn/auth

SDK oficial para integrações OAuth 2.0 da Flowyn. Facilita o processo de Single Sign-On (SSO) para desenvolvedores de SaaS.

## Instalação

```bash
npm install @flowyn/auth
# ou
yarn add @flowyn/auth
```

## Como Usar

### 1. Inicializando o Cliente

No seu servidor (Node.js, Next.js, Express, etc.):

```javascript
import { FlowynAuth } from '@flowyn/auth';

const flowyn = new FlowynAuth({
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET',
  redirectUri: 'https://seu-saas.com/api/callback',
  environment: 'production' // ou 'sandbox' / 'local'
});
```

### 2. Redirecionando o Usuário (Frontend/Rota de Login)

```javascript
// Gere a URL para o qual o usuário deve ser redirecionado para fazer o login
const authUrl = flowyn.getAuthorizationUrl();

// No seu frontend: <a href={authUrl}>Entrar com Flowyn</a>
```

### 3. Recebendo o Callback e Autenticando (Backend)

Na sua rota que configurou como `redirectUri` (ex: `/api/callback`), capture o parâmetro `code` da URL e use a função `authenticate`:

```javascript
// Exemplo em Next.js App Router (app/api/callback/route.ts)
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  try {
    // Isso troca o código por um token E já busca os dados do usuário!
    const { user, tokens } = await flowyn.authenticate(code);

    console.log(user.name); // "João Silva"
    console.log(user.email); // "joao@email.com"
    console.log(user.active_plans); // ["plano_pro", "curso_completo"]

    // Aqui você cria a sessão no seu SaaS e libera o acesso!
    // ex: await createSession(user);
    
    return Response.redirect('https://seu-saas.com/dashboard');
  } catch (error) {
    return new Response('Erro na autenticação', { status: 400 });
  }
}
```

## Licença

MIT
