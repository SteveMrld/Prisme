import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'
import { stripe } from '../../../../lib/stripe'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { priceId, plan } = await request.json()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // Récupère ou crée le customer Stripe
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${siteUrl}/compte?success=true`,
    cancel_url: `${siteUrl}/abonnement?canceled=true`,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan },
    },
    allow_promotion_codes: true,
    locale: 'fr',
  })

  return NextResponse.json({ url: session.url })
}
