import { NextRequest, NextResponse } from 'next/server'
import { requireActiveSubscriber } from '../../../lib/recoupement-auth'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const maxDuration = 60

const DAILY_LIMIT = 3

export async function POST(req: NextRequest) {
  const auth = await requireActiveSubscriber()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { analyses } = await req.json()
  if (!analyses?.length) return NextResponse.json({ error: 'No analyses' }, { status: 400 })

  // Rate limit : 3 briefings / jour / abonné (bypass pour admin)
  if (!auth.isAdmin) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const today = new Date().toISOString().slice(0, 10)
    const dayKey = `briefing-${today}`

    const { data: existing } = await admin
      .from('recoupement_usage')
      .select('count')
      .eq('user_id', auth.userId)
      .eq('year_month', dayKey)
      .maybeSingle()

    const current = existing?.count ?? 0
    if (current >= DAILY_LIMIT) {
      return NextResponse.json({
        error: 'Limite quotidienne de briefings atteinte',
        limit: DAILY_LIMIT,
      }, { status: 429 })
    }

    await admin
      .from('recoupement_usage')
      .upsert({
        user_id: auth.userId,
        year_month: dayKey,
        count: current + 1,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,year_month' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `Tu es l'éditeur de Soara, un média géopolitique indépendant français.
Tu reçois une liste de recoupements de sources effectués cette semaine.
Rédige un briefing hebdomadaire éditorial en français, sobre et analytique.

Structure :
1. Un titre accrocheur (style Le Monde Diplomatique)
2. Une introduction de 2-3 phrases sur les grandes tensions de la semaine
3. 3-4 points clés tirés des recoupements, avec les contradictions les plus significatives
4. Une conclusion sur ce que révèlent ces divergences de sources sur l'état de l'information

Ton : analytique, sobre, sans sensationnalisme. Style Soara — probité, rigueur, indépendance.
Réponds en JSON : { "titre": "", "intro": "", "points": ["","",""], "conclusion": "" }`,
      messages: [{
        role: 'user',
        content: `Voici les recoupements de la semaine :\n${analyses.map((a: any) => `- ${a.topic} (${a.date}) : ${a.synthesis}`).join('\n')}`
      }]
    })
  })

  const data = await response.json()
  return NextResponse.json(data)
}
