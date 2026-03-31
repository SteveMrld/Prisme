import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const LIST_ID = parseInt(process.env.BREVO_LIST_ID || '2')

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
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

  const err = await res.json()
  if (err.code === 'duplicate_parameter') {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Erreur inscription' }, { status: 500 })
}
