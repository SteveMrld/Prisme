import { createClient } from '../../lib/supabase-server'
import { redirect } from 'next/navigation'
import Header from '../../components/Header'
import Link from 'next/link'
import AccountClient from './AccountClient'

export const metadata = {
  title: 'Mon compte — Prisme',
}

export default async function ComptePage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion?redirect=/compte')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isActive = profile?.subscription_status === 'active'
  const isPastDue = profile?.subscription_status === 'past_due'

  return (
    <>
      <Header />
      <AccountClient
        user={{ email: user.email!, id: user.id }}
        profile={profile}
        isActive={isActive}
        isPastDue={isPastDue}
        successMessage={searchParams.success === 'true'}
      />
    </>
  )
}
