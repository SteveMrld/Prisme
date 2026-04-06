import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const { analyses } = await req.json()
  if (!analyses?.length) return NextResponse.json({ error: 'No analyses' }, { status: 400 })

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
      system: `Tu es l'éditeur de Confins, un média géopolitique indépendant français.
Tu reçois une liste de recoupements de sources effectués cette semaine.
Rédige un briefing hebdomadaire éditorial en français, sobre et analytique.

Structure :
1. Un titre accrocheur (style Le Monde Diplomatique)
2. Une introduction de 2-3 phrases sur les grandes tensions de la semaine
3. 3-4 points clés tirés des recoupements, avec les contradictions les plus significatives
4. Une conclusion sur ce que révèlent ces divergences de sources sur l'état de l'information

Ton : analytique, sobre, sans sensationnalisme. Style Confins — probité, rigueur, indépendance.
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
