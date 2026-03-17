import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    label: 'Mensuel',
    amount: 8,
    interval: 'mois',
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY!,
    label: 'Annuel',
    amount: 72,
    interval: 'an',
  },
} as const
