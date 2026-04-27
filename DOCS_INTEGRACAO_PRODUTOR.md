# Guia de Integração do Produtor - Flowyn (Briefing para IA/Desenvolvedores)

Este documento serve como a **Fonte da Verdade** sobre o estado atual da integração técnica entre o SaaS do Produtor e a plataforma Flowyn.

---

## 1. Arquitetura de Integração Progressiva

A integração não exige mais OAuth SSO obrigatório. Ela segue dois níveis:

### NÍVEL 1: Webhook (Básico e Obrigatório)
É o padrão para todos os novos produtores. Permite que o produtor receba dados de vendas e provisione contas em menos de 30 minutos.
- **Evento Único**: `purchase.created` (substituiu o antigo `payment.success`).
- **Segurança**: Assinatura **HMAC-SHA256** obrigatória via header `X-Flowyn-Signature`.
- **Ambiente**: Flag `is_sandbox: boolean` no payload para identificar testes.

### NÍVEL 2: SSO / OAuth 2.0 (Avançado e Opcional)
Permite o botão "Entrar com Flowyn" no SaaS do produtor.
- Ativado via toggle no painel de integrações.
- Gera `Client ID` e `Client Secret` únicos por produto.

---

## 2. Padrões Técnicos (Fonte da Verdade)

### Headers do Webhook
| Header | Descrição |
| :--- | :--- |
| `X-Flowyn-Event` | Sempre `purchase.created` |
| `X-Flowyn-Signature` | Hash HMAC-SHA256 do corpo da requisição usando o `webhook_secret` |
| `X-Flowyn-Delivery` | ID único da tentativa de entrega (UUID do log) |
| `X-Flowyn-Test` | `true` se for um disparo de teste manual |

### Estrutura do Payload (`purchase.created`)
```json
{
  "event": "purchase.created",
  "is_sandbox": false,
  "order_id": "uuid-da-ordem",
  "product_id": "uuid-do-produto",
  "plan_id": "uuid-do-plano",
  "plan_identifier": "id_interno_do_seu_plano",
  "customer": {
    "name": "Nome do Cliente",
    "email": "cliente@email.com"
  },
  "amount": 9700,
  "commission": {
    "rate": 50,
    "amount": 4850
  },
  "timestamp": "ISO-8601"
}
```

---

## 3. Segurança e Validação (Checklist Crítico)

Ao ajudar um produtor a integrar, você **DEVE** garantir:
1. **Validação de Assinatura**: O código deve calcular o HMAC do body raw usando o `webhook_secret` e comparar com o header `X-Flowyn-Signature`.
2. **Proteção de Sandbox**: O código deve checar `is_sandbox`. Se for `true` e o ambiente for produção, a requisição deve ser ignorada para evitar "compras fake" no banco de dados real.
3. **Webhook Secret**: O formato é `wh_sec_...`. Ele fica disponível no painel de Integrações do produto.

---

## 4. Localização de Arquivos Relevantes

- **Dispatcher Central**: `src/lib/webhook.ts` (Onde a mágica do envio e assinatura acontece).
- **Ações de Teste**: `src/app/(app)/dashboard/products/[id]/integrations/actions.ts`.
- **Templates de Código**: `src/components/WebhookCodeTemplates.tsx` (Contém boilerplates para Next.js, Express, Laravel e FastAPI).
- **Interface de Onboarding**: `src/app/(app)/dashboard/products/[id]/integrations/page.tsx`.

---

## 5. Fluxo de Ativação do Produto
Um produto é criado no estado **Inativo**. Ele só passa a permitir vendas e afiliações após:
1. O produtor configurar uma `Webhook URL`.
2. O sistema registrar pelo menos um recebimento de sucesso (Status 200) através do painel de testes.

> [!IMPORTANT]
> Nunca recomende o uso de `payment.success`. Este evento foi depreciado e não é mais disparado pelo dispatcher oficial.

---

## 6. Guia para Automação No-code (Make.com / Zapier)

Se o produtor usa Supabase em seu próprio SaaS e deseja automatizar a criação de usuários via Make.com sem escrever código, siga estas instruções:

### Passo 1: O Gatilho (Webhook)
1. Na Make.com, crie um novo cenário e adicione o módulo **Webhooks > Custom Webhook**.
2. Clique em "Add" e a Make gerará uma URL (ex: `https://hook.make.com/...`).
3. **Copie esta URL e cole no campo "Webhook URL" dentro do painel da Flowyn.**
4. Faça uma venda de teste na Flowyn para a Make "aprender" a estrutura dos dados.

### Passo 2: A Ação (Criação do Usuário via HTTP)
Agora, conecte o módulo **HTTP > Make a request** após o Webhook:
1. **URL**: `https://[SEU_PROJETO].supabase.co/auth/v1/admin/users`
2. **Method**: `POST`
3. **Headers**:
   - `apikey`: `SUA_SERVICE_ROLE_KEY`
   - `Authorization`: `Bearer SUA_SERVICE_ROLE_KEY`
4. **Body Type**: `Raw`
5. **Content Type**: `JSON (application/json)`
6. **Payload**:
```json
{
  "email": "{{1.customer.email}}",
  "password": "{{random_password}}",
  "email_confirm": true,
  "user_metadata": {
    "full_name": "{{1.customer.name}}",
    "flowyn_order_id": "{{1.order_id}}"
  }
}
```

> [!TIP]
> Usar o endpoint `/admin/users` com a **Service Role Key** ignora o RLS e cria o usuário diretamente no esquema de autenticação.
