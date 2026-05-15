import { NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
import { createClient as createServerClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Compte Stripe partagé avec Alba : on ne traite QUE les prix SOARA.
// Tout évènement portant un autre price (Alba, anciens tests Prisme, etc.) est ignoré.
const SOARA_PRICE_IDS = new Set([
  'price_1TJXihC6CLNu3aKe1vGRZ9El', // Media mensuel — 9,99 €/mois
  'price_1TJXmhC6CLNu3aKeagFuxvRu', // Media annuel — 99 €/an
  'price_1TOiedC6CLNu3aKevA5aUahV', // Recoupement pack — 3,99 € one-time
])
const RECOUPEMENT_PACK_PRICE_ID = 'price_1TOiedC6CLNu3aKevA5aUahV'

function createAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function priceIdsForSession(sessionId: string): Promise<string[]> {
  const items = await stripe.checkout.sessions.listLineItems(sessionId, { expand: ['data.price'] })
  return items.data.map(i => i.price?.id).filter((x): x is string => !!x)
}

function priceIdsForSubscription(sub: Stripe.Subscription): string[] {
  return sub.items?.data.map(i => i.price?.id).filter((x): x is string => !!x) || []
}

function priceIdsForInvoice(inv: Stripe.Invoice): string[] {
  return inv.lines?.data.map(l => l.price?.id).filter((x): x is string => !!x) || []
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdmin()
  const log = (...a: any[]) => console.log('[stripe-webhook]', event.id, event.type, ...a)
  const warn = (...a: any[]) => console.warn('[stripe-webhook]', event.id, event.type, ...a)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const priceIds = await priceIdsForSession(session.id).catch(e => {
        warn('listLineItems failed', e)
        return [] as string[]
      })
      if (!priceIds.some(p => SOARA_PRICE_IDS.has(p))) {
        log(`ignored: not a SOARA product (priceIds: ${priceIds.join(', ') || 'none'})`)
        break
      }

      const userId = session.metadata?.supabase_user_id
      if (!userId) {
        warn('SOARA event without supabase_user_id metadata — skipped', { sessionId: session.id, priceIds })
        break
      }

      // Pack recoupement (paiement unique)
      if (session.mode === 'payment' && priceIds.includes(RECOUPEMENT_PACK_PRICE_ID)) {
        const packSize = parseInt(session.metadata?.pack_size || '10', 10)
        const { error } = await supabase.rpc('grant_recoupement_pack', {
          p_user_id: userId,
          p_amount: packSize,
        })
        if (error) warn('rpc grant_recoupement_pack error', error)
        else log('recoupement_pack credited', { userId, packSize })
        break
      }

      // Abonnement (mensuel ou annuel)
      const { error, count } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        }, { count: 'exact' })
        .eq('id', userId)
      if (error) warn('profile update error', error)
      else log('profile updated', { userId, rows: count })
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const priceIds = priceIdsForSubscription(sub)
      if (!priceIds.some(p => SOARA_PRICE_IDS.has(p))) {
        log(`ignored: not a SOARA product (priceIds: ${priceIds.join(', ') || 'none'})`)
        break
      }
      const userId = sub.metadata?.supabase_user_id
      if (!userId) {
        warn('SOARA sub.updated without supabase_user_id — skipped', { subId: sub.id, priceIds })
        break
      }

      const status = sub.status === 'active' ? 'active'
        : sub.status === 'past_due' ? 'past_due'
        : sub.status === 'canceled' ? 'canceled'
        : 'inactive'

      const { error, count } = await supabase
        .from('profiles')
        .update({
          subscription_status: status,
          subscription_end_date: new Date(sub.current_period_end * 1000).toISOString(),
          stripe_customer_id: sub.customer as string,
          stripe_subscription_id: sub.id,
        }, { count: 'exact' })
        .eq('id', userId)
      if (error) warn('subscription.updated profile error', error)
      else log('subscription.updated profile', { userId, status, rows: count })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const priceIds = priceIdsForSubscription(sub)
      if (!priceIds.some(p => SOARA_PRICE_IDS.has(p))) {
        log(`ignored: not a SOARA product (priceIds: ${priceIds.join(', ') || 'none'})`)
        break
      }
      const userId = sub.metadata?.supabase_user_id
      if (!userId) {
        warn('SOARA sub.deleted without supabase_user_id — skipped', { subId: sub.id, priceIds })
        break
      }
      const { error, count } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'inactive',
          subscription_end_date: new Date(sub.current_period_end * 1000).toISOString(),
        }, { count: 'exact' })
        .eq('id', userId)
      if (error) warn('subscription.deleted profile error', error)
      else log('subscription.deleted profile', { userId, rows: count })
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const priceIds = priceIdsForInvoice(invoice)
      if (!priceIds.some(p => SOARA_PRICE_IDS.has(p))) {
        log(`ignored: not a SOARA product (priceIds: ${priceIds.join(', ') || 'none'})`)
        break
      }
      const customerId = invoice.customer as string
      const customer = await stripe.customers.retrieve(customerId).catch(() => null)
      if (!customer || ('deleted' in customer && customer.deleted)) {
        warn('customer not retrievable for invoice', { customerId })
        break
      }
      const userId = (customer as Stripe.Customer).metadata?.supabase_user_id
      if (!userId) {
        warn('SOARA invoice.payment_failed: customer without supabase_user_id metadata — skipped', { customerId })
        break
      }
      const { error, count } = await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' }, { count: 'exact' })
        .eq('id', userId)
      if (error) warn('invoice.payment_failed profile error', error)
      else log('invoice.payment_failed profile', { userId, rows: count })
      break
    }

    default:
      log('event ignored (no handler)')
  }

  return NextResponse.json({ received: true })
}
