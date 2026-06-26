import { Suspense } from 'react'
import Header from '../../components/Header'
import Link from 'next/link'
import AbonnementClient from './AbonnementClient'

export const metadata = {
  title: 'S\'abonner',
  description: 'Accédez à l\'intégralité des analyses Soara.',
  alternates: { canonical: 'https://soara.fr/abonnement' },
  robots: { index: false, follow: true },
}

export default function AbonnementPage({
  searchParams,
}: {
  searchParams: { canceled?: string }
}) {
  const plans = {
    monthly: {
      priceId: process.env.STRIPE_PRICE_MONTHLY!,
      amount: 9.99,
      interval: 'mois',
    },
    yearly: {
      priceId: process.env.STRIPE_PRICE_YEARLY!,
      amount: 99,
      interval: 'an',
    },
  }

  return (
    <Suspense>
      <AbonnementClient
        plans={plans}
        canceled={searchParams.canceled === 'true'}
      />
    </Suspense>
  )
}
