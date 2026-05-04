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
    // Sum all paid orders for products owned by this user
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('user_id', user.id)

    if (products && products.length > 0) {
      const productIds = products.map((p: any) => p.id)
      const { data: orders } = await supabase
        .from('orders')
        .select('amount')
        .in('product_id', productIds)
        .eq('status', 'paid')

      totalSales = (orders ?? []).reduce((sum: number, o: any) => sum + Number(o.amount), 0)
    }
  } else if (isAffiliate) {
    // Sum affiliate commissions
    const { data: orders } = await supabase
      .from('orders')
      .select('commission_amount')
      .eq('affiliate_id', user.id)
      .eq('status', 'paid')

    totalSales = (orders ?? []).reduce((sum: number, o: any) => sum + Number(o.commission_amount), 0)
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
