import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AppLayoutUI } from '@/components/AppLayoutUI'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAffiliate = profile?.role === 'affiliate'
  const isProducer = profile?.role === 'producer'

  // Fetch total sales depending on role
  let totalSales = 0
  if (isProducer) {
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('owner_id', user.id)  // ← owner_id, not user_id

    if (products && products.length > 0) {
      const productIds = products.map((p: any) => p.id)
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status')
        .in('product_id', productIds)

      const paid = (orders ?? []).filter((o: any) => o.status === 'paid')
      totalSales = paid.reduce((sum: number, o: any) => sum + Number(o.amount), 0)
    }
  } else if (isAffiliate) {
    const { data: orders } = await supabase
      .from('orders')
      .select('commission_amount, status')
      .eq('affiliate_id', user.id)

    const paid = (orders ?? []).filter((o: any) => o.status === 'paid')
    totalSales = paid.reduce((sum: number, o: any) => sum + Number(o.commission_amount), 0)
  }

  return (
    <AppLayoutUI
      profile={profile}
      user={user}
      isAffiliate={isAffiliate}
      isProducer={isProducer}
      totalSales={totalSales}
    >
      {children}
    </AppLayoutUI>
  )
}
