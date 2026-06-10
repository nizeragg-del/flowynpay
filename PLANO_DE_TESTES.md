# Plano de Testes — Flowyn

## Pré-requisitos

- Ambiente local rodando (`npm run dev` ou preview Vercel)
- Conta Asaas sandbox configurada
- Webhook Asaas configurado (endpoint `/api/webhooks/asaas`)
- Variáveis de ambiente preenchidas (`.env.local`)
- Banco Supabase com migrations aplicadas

---

## 1. Landing Page

- [ ] Hero carrega com GIF de fundo + noise + gradiente
- [ ] Navbar pill fixa com links: Produto, Checkout, Custos, Recursos, FAQ
- [ ] Navbar destaca seção ativa ao scroll (linha laranja)
- [ ] Seção Produto (#produto) — cards de problema com animação
- [ ] Seção Checkout (#checkout) — diagrama de fluxo + 4 cards de features
- [ ] Seção Custos (#custos) — card de preço R$ 49/mês, badge 7 dias grátis
- [ ] Seção Recursos (#recursos) — grid 3 colunas com 6 cards
- [ ] Seção FAQ (#faq) — accordion funcional, abrir/fechar perguntas
- [ ] CTA final com botão "Criar conta grátis"
- [ ] Links da navbar levam às âncoras corretas
- [ ] Responsivo mobile (menu hamburger, grid adaptável)

---

## 2. Autenticação

### 2.1 Registro
- [ ] Acessar `/register` — formulário com nome, email, senha
- [ ] Validação: email inválido mostra erro
- [ ] Validação: senha < 6 caracteres mostra erro
- [ ] Validação: nome vazio mostra erro
- [ ] Registrar com dados válidos — redireciona para `/login?success=registered`
- [ ] Verificar se email de confirmação foi enviado (Supabase)

### 2.2 Login
- [ ] Acessar `/login` — formulário com email, senha
- [ ] Login com credenciais inválidas — mostra erro
- [ ] Login com credenciais válidas — redireciona para `/dashboard`
- [ ] Login com email não confirmado — verificar comportamento

### 2.3 Esqueci Senha
- [ ] Acessar `/forgot-password` — formulário de email
- [ ] Enviar email válido — mostra banner de sucesso
- [ ] Verificar email de recuperação recebido
- [ ] Clicar no link — vai para `/auth/callback` → `/reset-password`
- [ ] Resetar senha (min 6 caracteres) — redireciona para `/login?success=password_reset`
- [ ] Login com nova senha — funciona

### 2.4 Logout
- [ ] Clicar "Sair" no sidebar — redireciona para `/`
- [ ] Tentar acessar `/dashboard` após logout — redireciona para login

---

## 3. Dashboard — Overview

- [ ] `/dashboard` carrega com cards: Receita Total, Produtos, Pedidos Pagos, Pendentes
- [ ] Gráfico de receita dos últimos 7 dias (Recharts) renderiza
- [ ] Lista de pedidos recentes (últimos 5) aparece
- [ ] Sidebar com seções expandidas corretamente
- [ ] Header com título dinâmico da página
- [ ] Subscription banner aparece se assinatura não estiver ativa

---

## 4. Configurar Recebimento (Asaas)

### 4.1 CPF (vincular conta existente)
- [ ] Acessar `/dashboard/settings/payments`
- [ ] Selecionar CPF
- [ ] Preencher: nome, email, CPF, data nascimento, telefone, renda, endereço
- [ ] Enviar — verificar se `payment_accounts` foi criado
- [ ] Verificar status da conta (account status)

### 4.2 CNPJ (criar subconta)
- [ ] Selecionar CNPJ
- [ ] Preencher dados completos da empresa
- [ ] Enviar — verificar se subconta foi criada no Asaas sandbox
- [ ] Verificar `payment_accounts` com `provider_account_id`

### 4.3 Carteira
- [ ] `/dashboard/wallet` exibe saldo disponível e pendente
- [ ] Botão "Abrir Asaas" abre link externo

---

## 5. Assinatura Flowyn Pro

### 5.1 Assinar
- [ ] Acessar `/dashboard/settings/subscription`
- [ ] Preencher dados do cartão no formulário
- [ ] Confirmar assinatura (R$ 49/mês, trial 7 dias)
- [ ] Verificar se `platform_subscriptions` foi criada com status "scheduled"
- [ ] Verificar se asaas_subscription_id foi preenchido

### 5.2 Status da Assinatura
- [ ] Verificar trial ativo nos primeiros 7 dias
- [ ] Verificar transição para "active" após confirmação do primeiro pagamento
- [ ] Verificar histórico de faturas

### 5.3 Cancelar
- [ ] Cancelar assinatura
- [ ] Verificar status alterado para "cancelled"
- [ ] Verificar se acesso ao dashboard/products/new é bloqueado após cancelamento

---

## 6. Produtos

### 6.1 Criar Produto
- [ ] Acessar `/dashboard/products/new`
- [ ] Preencher: nome, descrição, logo, tipo (curso/ebook/mentoria/outros)
- [ ] Avançar no wizard — verificar se produto foi criado em estado draft
- [ ] Verificar `products` no banco com `is_public: false`

### 6.2 Listar Produtos
- [ ] `/dashboard/products` lista todos os produtos
- [ ] Badge de tipo (curso/ebook/mentoria) aparece
- [ ] Status (rascunho/publicado) aparece
- [ ] Preço inicial e total de vendas aparecem

### 6.3 Editar Produto
- [ ] Clicar em produto → vai para edição
- [ ] Alterar nome, descrição, tipo, categoria
- [ ] Salvar — verificar alterações no banco

### 6.4 Publicar Produto
- [ ] Marcar produto como público
- [ ] Verificar `is_public: true`

---

## 7. Planos

### 7.1 Criar Plano
- [ ] Acessar planos do produto
- [ ] Criar plano: nome, preço, tipo (one_time)
- [ ] Verificar registro em `plans`

### 7.2 Editar/Excluir Plano
- [ ] Editar nome/preço
- [ ] Excluir plano
- [ ] Associar pixel ao plano (`PlanPixelSection`)

---

## 8. Editor de Checkout

- [ ] Acessar `/dashboard/products/[id]/checkout-editor`
- [ ] Alterar cor primária, cor de fundo
- [ ] Alterar headline, subheadline, texto do botão
- [ ] Configurar banner, depoimentos, FAQ, garantia
- [ ] Salvar rascunho
- [ ] Publicar — verificar `published_config` e `published_at`
- [ ] Pré-visualizar com `?preview=1`

---

## 9. Order Bumps

- [ ] Acessar order bumps do produto
- [ ] Criar bump: título, descrição, preço, preço original, imagem
- [ ] Editar bump
- [ ] Excluir bump
- [ ] Verificar se primeiro bump aparece no checkout

---

## 10. Conteúdo (Flowyn Play)

### 10.1 Cursos
- [ ] Criar módulo: título, descrição
- [ ] Criar aula: título, descrição, vídeo (URL externa ou arquivo), duração
- [ ] Marcar aula como prévia gratuita
- [ ] Upload de arquivo de material complementar
- [ ] Reordenar módulos/aulas

### 10.2 E-books / Outros
- [ ] Configurar URL de entrega
- [ ] OU fazer upload de arquivo para entrega

### 10.3 Mensageria
- [ ] Criar aula → verificar se email de notificação foi enviado (Resend)

---

## 11. Mentoria (Flowyn Journey)

- [ ] Configurar programa: headline, promise, número de sessões, URL da reunião
- [ ] Criar perguntas de intake
- [ ] Criar sessões com datas e URLs
- [ ] Criar slots de disponibilidade
- [ ] Criar tarefas para o aluno

---

## 12. Checkout (Compra)

### 12.1 Fluxo Completo
- [ ] Pegar URL do plano público (`/checkout/[id]`)
- [ ] Abrir em aba anônima/outro navegador
- [ ] Página carrega com plano, produto, personalizações, order bump
- [ ] Se produtor sem assinatura ativa: mostrar "checkout indisponível"

### 12.2 Formulário
- [ ] Validar: email inválido, CPF inválido, telefone inválido
- [ ] Selecionar PIX
- [ ] Selecionar cartão de crédito

### 12.3 Pagamento PIX
- [ ] Preencher dados, selecionar PIX, finalizar
- [ ] Verificar se QR code é gerado (encodedImage + payload)
- [ ] Verificar ordem criada em `orders` com status "pending"
- [ ] Pagar PIX no Asaas sandbox (simular)
- [ ] Aguardar webhook — verificar ordem atualizada para "paid"

### 12.4 Pagamento Cartão de Crédito
- [ ] Preencher dados + cartão de teste (Asaas sandbox)
- [ ] Finalizar — verificar se pagamento é processado e auto-fulfillment
- [ ] Verificar ordem atualizada para "paid"

### 12.5 Order Bump
- [ ] No checkout, verificar se bump aparece
- [ ] Aceitar bump — verificar valor total atualizado
- [ ] Recusar bump — verificar valor total sem bump
- [ ] Verificar `includes_order_bump` e `order_bump_amount` na ordem

### 12.6 Pixels
- [ ] Verificar se scripts de pixel (Meta/Google/TikTok) são injetados na página
- [ ] Verificar associação pixel-plano

### 12.7 Sucesso
- [ ] Após pagamento, redirecionar para `/checkout/success?order_id=...`
- [ ] Verificar animação de sucesso
- [ ] Testar cenário de falha (`?redirect_status=failed`)

---

## 13. Fulfillment (Pós-Compra)

### 13.1 Entrega Automática
- [ ] Produto com `delivery_type: 'platform'`:
  - [ ] Se comprador não tem conta: criar usuário automático
  - [ ] Enviar email com link para definir senha
  - [ ] Verificar `student_access` criado
- [ ] Produto com `delivery_type: 'external'`:
  - [ ] Enviar email com URL de entrega
  - [ ] Verificar `notification_events` enviado

### 13.2 E-mail de Entrega
- [ ] Verificar recebimento do `deliveryEmail`
- [ ] Conteúdo do email: links de acesso, aviso de expiração (48h)

### 13.3 Webhook do Produtor
- [ ] Verificar se webhook foi disparado para URL configurada
- [ ] Verificar assinatura HMAC-SHA256 no header `X-Flowyn-Signature`
- [ ] Verificar payload com campos PT-BR
- [ ] Verificar `webhook_logs` registrado
- [ ] Testar retry (3 tentativas com backoff)

### 13.4 Mentoria
- [ ] Verificar se sessões template foram clonadas para o aluno
- [ ] Verificar slots de disponibilidade

---

## 14. Área do Aluno (Learn)

### 14.1 Biblioteca
- [ ] `/learn` — verificar produtos com acesso listados
- [ ] Verificar shelf de cursos e mentorias
- [ ] Verificar `claimPendingStudentAccess` (vincular orders ao usuário logado)

### 14.2 Player de Curso
- [ ] Acessar `/learn/[id]` — player de vídeo carrega
- [ ] Vídeos nativos (Supabase Storage) com signed URL
- [ ] Vídeos externos (iframe) funcionam
- [ ] Lista de aulas com progresso
- [ ] Marcar aula como concluída — verificar `lesson_progress`
- [ ] Comentar em aula — verificar `lesson_comments`

### 14.3 Certificado
- [ ] Completar todas as aulas do curso
- [ ] Verificar certificado gerado em `/learn/[id]/certificate`
- [ ] Verificar código único do certificado

### 14.4 Mentoria
- [ ] Ver journey map com sessões
- [ ] Preencher intake questionnaire
- [ ] Agendar slot — verificar `bookMentorshipSlot`
- [ ] Marcar tarefa como concluída

---

## 15. Vendas

### 15.1 Painel de Vendas
- [ ] `/dashboard/sales` — resumo: receita total, ticket médio, pagos/pendentes
- [ ] Lista de transações com: cliente, produto, plano, valor, status, data
- [ ] Status badges: paid (verde), refunded (vermelho), pending (amarelo)

### 15.2 Webhook Asaas
- [ ] Simular PAYMENT_CONFIRMED — verificar ordem paga
- [ ] Simular PAYMENT_REFUNDED — verificar ordem refundada
- [ ] Simular CHARGEBACK — verificar `security_audit_log`
- [ ] Simular SPLIT events — verificar processamento
- [ ] Testar idempotência (mesmo event_id não processa duplicado)
- [ ] Testar stale recovery (evento travado em "processing" por >5min)

---

## 16. Pixels

- [ ] Criar pixel (Meta/Google/TikTok)
- [ ] Editar pixel
- [ ] Excluir pixel
- [ ] Ativar/desativar pixel
- [ ] Associar pixel a plano específico

---

## 17. WhatsApp Webhook

- [ ] Testar handshake (GET): `?hub.mode=subscribe&hub.verify_token=flowyn123&hub.challenge=test123`
- [ ] Verificar retorno do challenge
- [ ] Testar POST com `x-webhook-token: flowyn123`
- [ ] Verificar log em `whatsapp_webhook_logs`

---

## 18. Rate Limiting

- [ ] Checkout: 12 requisições por minuto por IP — exceder e verificar bloqueio
- [ ] Asaas account: 10 requisições por 15 minutos
- [ ] Subscription: 5 requisições por 15 minutos

---

## 19. Segurança

### 20.1 Acesso
- [ ] Rota protegida sem autenticação → redireciona para `/login`
- [ ] Acessar produto de outro usuário → acesso negado
- [ ] Acessar checkout de produto draft → apenas owner com `?draft=1`

### 20.2 Validação
- [ ] CPF inválido no checkout → erro
- [ ] Email inválido → erro
- [ ] Senha < 6 caracteres → erro

### 20.3 PII
- [ ] `order_customer_private` contém dados sensíveis
- [ ] `orders` não contém PII (apenas primeiro nome + email mascarado)

### 20.4 Rate Limit
- [ ] Excesso de requisições → 429 Too Many Requests

---

## 20. Stress / Limites

- [ ] Criar 50+ produtos — verificar performance da listagem
- [ ] Criar 100+ aulas em um curso — verificar carregamento
- [ ] 10+ pedidos simultâneos — verificar concorrência
- [ ] Upload de arquivo grande (500MB+) — verificar signed URLs

---

## 21. Responsivo / Cross-browser

- [ ] Desktop (1920x1080) — tudo legível e alinhado
- [ ] Tablet (768px) — grid adaptado, navbar funciona
- [ ] Mobile (375px) — hamburger menu, cards empilhados
- [ ] Chrome, Firefox, Edge — sem quebras visuais
- [ ] Modo escuro não quebra nada (tema já é escuro)

---

## 22. SEO / Meta

- [ ] Landing page tem meta title e description
- [ ] Páginas de produto têm meta tags adequadas
- [ ] Open Graph tags funcionam (compartilhamento)
- [ ] Favicon carrega

---

## Checklist de Regressão (pré-deploy)

- [ ] `npm run build` passa sem erros
- [ ] Migrations aplicadas no banco de produção
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Webhook Asaas apontando para URL de produção
- [ ] Asaas API key de produção (não sandbox)
- [ ] Domínio configurado (flowyn.com.br)
- [ ] Teste de compra real com cartão de teste
- [ ] Certificado SSL válido
