import { redirect } from 'next/navigation'

export default async function ProductIntegrationsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  redirect(`/dashboard/products/${id}`)
}
