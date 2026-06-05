import { SalesPageClient } from './SalesPageClient'

export const metadata = {
  title: 'Flowyn - Checkout para infoprodutores com custo previsivel',
  description: 'Venda infoprodutos com checkout transparente, entrega automatica, recebimento via Asaas e taxa Flowyn zero por venda.',
}

export default function Home() {
  return <SalesPageClient />
}
