import { NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
import { createClient as createServerClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Client admin — bypass RLS
function createAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId) break

      await supabase.from('profiles').update({
        subscription_status: 'active',
        stripe_subscription_id: session.subscription as string,
      }).eq('id', userId)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      if (!userId) break

      const status = sub.status === 'active' ? 'active'
        : sub.status === 'past_due' ? 'past_due'
        : 'inactive'

      await supabase.from('profiles').update({
        subscription_status: status,
        subscription_end_date: new Date(sub.current_period_end * 1000).toISOString(),
        stripe_subscription_id: sub.id,
      }).eq('id', userId)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      if (!userId) break

      await supabase.from('profiles').update({
        subscription_status: 'inactive',
        subscription_end_date: new Date(sub.current_period_end * 1000).toISOString(),
      }).eq('id', userId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const userId = customer.metadata?.supabase_user_id
      if (!userId) break

      await supabase.from('profiles').update({
        subscription_status: 'past_due',
      }).eq('id', userId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
