import { redirect } from 'next/navigation'

// Webhooks foram descontinuados da plataforma Flowyn.
// Redireciona para a página de produtos.
export default function WebhooksPage() {
  redirect('/dashboard/products')
}
