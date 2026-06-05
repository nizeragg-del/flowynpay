# Pagina de vendas ideal da Flowyn

## Objetivo

Criar uma pagina que venda a Flowyn como uma plataforma de checkout para infoprodutores que querem:

- vender sem pagar taxa abusiva de plataforma por venda;
- receber via Asaas na propria conta;
- entregar produtos digitais automaticamente;
- controlar checkout, produto, alunos e vendas em um painel simples.

A promessa nao deve dizer que vender online nao tem custo. A mensagem correta e:

> A Flowyn nao cobra percentual por venda. Voce paga uma mensalidade fixa pela plataforma e as tarifas financeiras continuam sendo cobradas pela Asaas conforme o meio de pagamento.

## Posicionamento

### Frase central

Venda infoprodutos com checkout proprio, entrega automatica e custo de plataforma previsivel.

### Promessa principal

Pare de entregar uma parte de cada venda para a plataforma. Use a Flowyn por uma mensalidade fixa e receba suas vendas pela sua conta Asaas.

### Inimigo da pagina

Nao atacar concorrentes nominalmente. O inimigo e:

- taxa de plataforma que cresce junto com o faturamento;
- falta de controle sobre oferta;
- checkout generico;
- entrega manual;
- relatorio financeiro confuso;
- depender de vitrine/publicacao dentro de ecossistema alheio.

## Assets reais da plataforma

Os prints devem ser reais, tirados do ambiente live ou staging, com dados sensiveis mascarados.

Salvar em:

```txt
public/sales/
```

Imagens recomendadas:

```txt
public/sales/dashboard-vendas.webp
public/sales/editor-checkout.webp
public/sales/checkout-real.webp
public/sales/produto-conteudo-curso.webp
public/sales/entrega-digital-ebook.webp
public/sales/pagamentos-asaas.webp
public/sales/area-aluno.webp
```

Uso:

- `checkout-real.webp`: hero, imagem principal.
- `editor-checkout.webp`: secao de personalizacao.
- `pagamentos-asaas.webp`: secao de recebimento.
- `produto-conteudo-curso.webp` e `entrega-digital-ebook.webp`: secao de entrega.
- `dashboard-vendas.webp`: secao de gestao.
- `area-aluno.webp`: secao Flowyn Play.

## Estrutura recomendada

## 1. Header

### Objetivo

Dar identidade forte e CTA imediato.

### Layout

- Fundo escuro, sticky, com blur.
- Logo grande, mesma proporcao da tela de login.
- Navegacao curta:
  - Como funciona
  - Checkout
  - Custos
  - Recursos
  - Duvidas
- CTA primario: `Comecar gratis`
- CTA secundario: `Entrar`

### Efeito

- Header reduz levemente a altura ao scroll.
- Borda inferior aparece com opacidade maior quando a pagina rola.

## 2. Hero

### Objetivo

Explicar em 5 segundos: para quem e, o que faz, por que importa.

### Copy

Eyebrow:

> Checkout para infoprodutores que querem margem e controle

Headline:

> Venda infoprodutos sem entregar um percentual de cada venda para a plataforma.

Subheadline:

> Crie produtos digitais, publique um checkout transparente, receba pela sua conta Asaas e entregue cursos, e-books e mentorias automaticamente. A Flowyn cobra mensalidade fixa. As tarifas de pagamento continuam sendo da Asaas.

CTAs:

- Primario: `Comecar teste gratis`
- Secundario: `Ver como os custos funcionam`

Trust bullets:

- `Taxa Flowyn por venda: R$ 0`
- `Recebimento via Asaas CPF/CNPJ`
- `Checkout privado por produto`

### Imagem real

Usar `public/sales/checkout-real.webp`.

### Composicao visual

Hero em duas colunas:

- esquerda: copy;
- direita: print real do checkout dentro de uma moldura branca, com sombra suave.

A imagem deve parecer produto real, nao mockup inventado.

### Efeitos

- Entrada suave do print com `opacity + translateY`.
- Pequenos highlights ao redor do print:
  - `Venda aprovada`
  - `Taxa Flowyn R$ 0`
  - `Entrega liberada`
- Nao usar blobs decorativos soltos.

## 3. Problema

### Objetivo

Fazer o produtor sentir a dor antes da solucao.

### Headline

> Quando sua plataforma cobra por venda, ela fica mais cara justamente quando voce cresce.

### Texto

> Taxas percentuais parecem pequenas no comeco. Mas quando voce vende mais, elas viram um custo recorrente que acompanha todo lancamento, toda campanha e todo produto novo.

### Cards

1. `Percentual sobre faturamento`
   - Cada venda aumenta o custo da plataforma.
2. `Entrega manual`
   - Cliente paga, mas voce ainda precisa liberar acesso.
3. `Checkout sem controle`
   - Sua oferta fica limitada ao padrao de outra plataforma.

### Efeito

Cards entram em cascata quando aparecem na tela.

## 4. Conceito Flowyn

### Headline

> A Flowyn fixa o custo da plataforma. O seu crescimento fica com voce.

### Texto

> A Flowyn organiza o checkout, entrega e gestao. O pagamento acontece via Asaas, e as tarifas financeiras continuam sendo cobradas pela Asaas. A diferenca e que a Flowyn nao adiciona um percentual proprio em cada venda.

### Visual

Diagrama horizontal:

```txt
Trafego do produtor -> Checkout Flowyn -> Pagamento Asaas -> Entrega automatica -> Area do aluno / arquivo / mentoria
```

### Efeito

Linha animada conectando os passos conforme scroll.

## 5. Checkout

### Objetivo

Mostrar que a Flowyn nao e apenas "barata"; ela tambem melhora a experiencia de compra.

### Headline

> Um checkout limpo, direto e feito para vender.

### Texto

> Personalize banner, mockup, copy, order bump, beneficios e cores. Antes de publicar, veja o checkout real como o comprador vai enxergar.

### Imagens reais

- `public/sales/editor-checkout.webp`
- `public/sales/checkout-real.webp`

### Layout

Split em duas colunas:

- esquerda: print do editor;
- direita: print do checkout real.

### Bullets

- Editor visual do checkout
- Preview real antes de publicar
- Order bump nativo
- Checkout branco e familiar
- Selos e textos de seguranca

### Efeito

Alternar entre `Editor` e `Checkout publicado` com tabs.

## 6. Recebimento Asaas

### Headline

> Venda pela Flowyn. Receba pela sua conta Asaas.

### Texto

> O produtor conecta uma carteira Asaas CPF ou CNPJ. A Flowyn usa essa conexao para processar o checkout e registrar a venda sem cobrar taxa propria por transacao.

### Imagem real

Usar `public/sales/pagamentos-asaas.webp`.

### Disclaimer visivel

> Importante: tarifas de cartao, Pix, boleto, antecipacao ou regras financeiras sao cobradas pela Asaas. A Flowyn nao substitui essas tarifas; ela elimina a taxa extra de plataforma por venda.

### Elementos

Cards pequenos:

- CPF ou CNPJ
- Wallet Asaas
- Sem taxa Flowyn por venda
- Painel de saldo na Asaas

## 7. Custos honestos

### Headline

> O custo da plataforma nao precisa crescer junto com seu faturamento.

### Explicacao

> Existem dois tipos de custo: tarifa financeira e taxa de plataforma. A tarifa financeira e do meio de pagamento. A taxa de plataforma e o que muitas ferramentas cobram alem disso. A Flowyn trabalha com mensalidade fixa.

### Tabela

| Item | Flowyn | Plataforma com taxa por venda |
|---|---:|---:|
| Volume bruto vendido | R$ 5.000 | R$ 5.000 |
| Taxa da plataforma | R$ 49 fixos | Ex: 8,99% + R$ 2,49/venda |
| Percentual Flowyn | R$ 0 | Varia conforme venda |
| Tarifas financeiras | Asaas cobra separadamente | Meio de pagamento cobra separadamente |
| Previsibilidade | Alta | Custo cresce com faturamento |

### Box de honestidade

> Esta comparacao considera apenas a camada da plataforma. Tarifas financeiras da Asaas continuam existindo e variam por meio de pagamento, prazo e configuracao da conta.

### Efeito

Calculadora simples:

- input: preco medio;
- input: numero de vendas;
- input: taxa da plataforma concorrente;
- output: custo estimado da taxa de plataforma vs mensalidade Flowyn.

## 8. Entrega digital

### Headline

> O comprador pagou. A entrega acontece sem voce correr atras.

### Texto

> Configure a entrega de acordo com o tipo do produto: e-book, arquivo, curso online, mentoria ou link externo.

### Imagens reais

- `public/sales/entrega-digital-ebook.webp`
- `public/sales/produto-conteudo-curso.webp`
- `public/sales/area-aluno.webp`

### Tabs

1. `E-book`
   - upload de PDF/ZIP;
   - link externo opcional;
   - e-mail de acesso.
2. `Curso online`
   - modulos;
   - aulas;
   - videos;
   - certificados.
3. `Mentoria`
   - diagnostico;
   - tarefas;
   - sessoes;
   - acompanhamento.

### Efeito

Tabs trocando screenshots reais.

## 9. Painel de gestao

### Headline

> Acompanhe vendas, produtos e alunos sem planilha improvisada.

### Texto

> Veja pedidos, receita, status de pagamento, produtos vendidos e acessos liberados em um painel focado no produtor.

### Imagem real

Usar `public/sales/dashboard-vendas.webp`.

### Bullets

- Minhas vendas
- Meus produtos
- Relatorios por produto
- Status de pagamento
- Acesso do aluno

## 10. Recursos

### Headline

> O essencial para operar um produto digital de verdade.

### Grid

- Checkout transparente
- Editor visual
- Order bump
- Pixels por plano
- Webhooks
- Area do aluno
- Upload de videos
- Certificados
- Comentarios por aula
- Mentoria com tarefas
- Diagnostico do aluno
- Carteira Asaas

### Efeito

Cards com hover discreto:

- borda verde;
- leve elevacao;
- icone aceso.

## 11. Prova visual

### Headline

> Veja a Flowyn por dentro.

### Estrutura

Galeria com screenshots reais:

1. Checkout real
2. Editor de checkout
3. Criacao de produto
4. Entrega digital
5. Curso online
6. Meus acessos
7. Pagamentos Asaas

### Efeito

Galeria com modal lightbox. Ao clicar no print, abre ampliado.

## 12. Plano

### Headline

> Uma mensalidade simples para parar de pagar taxa de plataforma por venda.

### Card

Flowyn Pro

- 7 dias gratis
- R$ 49/mes
- R$ 0 de taxa Flowyn por venda
- Checkout ilimitado enquanto assinatura ativa
- Produtos digitais
- Entrega automatica
- Area do aluno
- Asaas CPF/CNPJ

Disclaimer:

> Tarifas financeiras da Asaas nao estao inclusas na mensalidade Flowyn.

CTA:

> Comecar teste gratis

## 13. FAQ

### Perguntas

#### A Flowyn cobra taxa por venda?

Nao. A Flowyn cobra mensalidade fixa. Quem cobra as tarifas financeiras do pagamento e a Asaas.

#### Eu recebo direto na minha conta?

Voce conecta sua conta/carteira Asaas. O recebimento financeiro segue as regras da Asaas.

#### A Flowyn substitui uma pagina de vendas?

Nao. A Flowyn e focada no checkout. Voce pode vender a partir de uma landing page propria, anuncios, Instagram, WhatsApp, comunidade ou qualquer canal.

#### Posso vender curso, e-book e mentoria?

Sim. Cada tipo de produto tem uma entrega adequada dentro da plataforma.

#### O comprador recebe acesso automaticamente?

Sim. Depois do pagamento aprovado, a Flowyn libera o acesso configurado e envia e-mail ao comprador.

## 14. CTA final

### Headline

> Se sua margem importa, sua plataforma nao deveria virar socio invisivel.

### Texto

> Teste a Flowyn, publique um checkout e compare a diferenca entre pagar uma mensalidade fixa e entregar uma parte de cada venda.

CTA:

> Criar minha conta gratis

## Direcao visual

### Paleta

- Fundo: preto esverdeado quase neutro `#070908`
- Superficie: `#101412`
- Verde primario: `#00e88a`
- Texto principal: branco
- Texto secundario: branco com 50-65% de opacidade

### Tipografia

- Titulos grandes, densos, sem letter spacing negativo.
- Subtextos em 16-18px no hero e 14-16px nas demais secoes.

### Componentes

- Bordas discretas `border-white/10`
- Radius entre 12px e 24px
- Nada de cards dentro de cards
- Prints reais em molduras simples, com sombra e borda
- CTAs grandes e diretos

### Animacoes

- Fade + translateY nas secoes
- Tabs com transicao suave
- Numeros da calculadora atualizam com animacao curta
- Header com blur ao scroll
- Hover em cards sem exagero

## Ordem de implementacao

1. Capturar screenshots reais e salvar em `public/sales`.
2. Implementar nova landing em componentes pequenos.
3. Criar calculadora de custo da plataforma.
4. Adicionar galeria de prints reais.
5. Testar desktop e mobile.
6. Revisar copy para nao prometer economia liquida sem considerar Asaas.
7. Rodar build.
8. Publicar.

## Checklist de honestidade

- Nunca dizer que vender online custa apenas R$ 49.
- Sempre separar mensalidade Flowyn de tarifas Asaas.
- Nao comparar custo total sem incluir tarifas financeiras.
- Comparar apenas taxa de plataforma quando o exemplo usar concorrente.
- Mostrar screenshots reais, nao mockups que prometem tela inexistente.
- Evitar promessas absolutas como "menor taxa do mercado" sem prova atualizada.
