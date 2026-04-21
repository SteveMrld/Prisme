import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'
import { stripe } from '../../../../lib/stripe'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // L'abonnement actif est requis pour acheter des packs
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_status !== 'active') {
    return NextResponse.json({ error: 'Abonnement requis' }, { status: 403 })
  }

  const priceId = process.env.STRIPE_PRICE_RECOUPEMENT_PACK
  if (!priceId) {
    return NextResponse.json({ error: 'Pack non configuré' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // Reuse customer existant (créé lors de l'abonnement)
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
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/recoupement?pack_success=1`,
    cancel_url: `${siteUrl}/recoupement?pack_cancelled=1`,
    metadata: {
      supabase_user_id: user.id,
      type: 'recoupement_pack',
      pack_size: '10',
    },
    payment_intent_data: {
      metadata: {
        supabase_user_id: user.id,
        type: 'recoupement_pack',
        pack_size: '10',
      },
    },
  })

  return NextResponse.json({ url: session.url })
}
