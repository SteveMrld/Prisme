import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY || ''
const LIST_ID = 6 // ID de la liste "Abonnés Soara" — à ajuster si différent

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [LIST_ID],
        updateEnabled: true,
      }),
    })

    if (res.ok || res.status === 204) {
      return NextResponse.json({ success: true })
    }

    const data = await res.json()
    // Contact already exists = success
    if (data.code === 'duplicate_parameter') {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Erreur Brevo' }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
