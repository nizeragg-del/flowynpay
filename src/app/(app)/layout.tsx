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

  return (
    <AppLayoutUI
      profile={profile}
      user={user}
      isAffiliate={isAffiliate}
      isProducer={isProducer}
    >
      {children}
    </AppLayoutUI>
  )
}
