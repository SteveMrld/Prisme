import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

  const SOURCES = [
    { id: 'ajenews', name: 'Al Jazeera', type: 'Média', bias: 'Qatar / pro-palestinien' },
    { id: 'haaretzcom', name: 'Haaretz', type: 'Média', bias: 'Israélien progressiste' },
    { id: 'ft', name: 'Financial Times', type: 'Média', bias: 'Libéral occidental' },
    { id: 'dropsitenews', name: 'Drop Site News', type: 'Média indép.', bias: 'Journalisme d\'investigation' },
    { id: 'theintercept', name: 'The Intercept', type: 'Média indép.', bias: 'Gauche américaine' },
    { id: 'washingtonpost', name: 'Washington Post', type: 'Média', bias: 'Centre libéral US' },
    { id: 'thecradlemedia', name: 'The Cradle', type: 'Média', bias: 'Pro-résistance' },
    { id: 'middleeasteye', name: 'Middle East Eye', type: 'Média', bias: 'Indépendant Moyen-Orient' },
    { id: 'marionawfal', name: 'Marion Awfal', type: 'Journaliste', bias: 'Terrain / sources arabes' },
    { id: 'rnaudbertrand', name: 'Arnaud Bertrand', type: 'Analyste', bias: 'Pro-multilatéral' },
    { id: 'karimbitar', name: 'Karim Bitar', type: 'Analyste', bias: 'Académique franco-libanais' },
    { id: 'sentdefender', name: 'Sentinel Defender', type: 'OSINT', bias: 'Militaire / renseignement' },
    { id: 'clashreport', name: 'Clash Report', type: 'Agrégateur', bias: 'Breaking news / non filtré' },
    { id: 'kobeissiletter', name: 'The Kobeissi Letter', type: 'Finance', bias: 'Marchés / géopolitique éco' },
    { id: 'iaeaorg', name: 'IAEA', type: 'Institution', bias: 'Nucléaire / international' },
    { id: 'tparsi', name: 'Trita Parsi', type: 'Think tank', bias: 'NIAC / pro-négociation' },
    { id: 'shanaka86', name: 'Shanaka', type: 'Analyste', bias: 'Géopolitique indépendant' },
    { id: 'hamidrezaaz', name: 'Hamidreza', type: 'Analyste', bias: 'Iran / stratégie militaire' },
    { id: 'furkangozukara', name: 'Furkan Gözükara', type: 'Journaliste', bias: 'Terrain Moyen-Orient' },
    { id: 'allenanalysis', name: 'Allen Analysis', type: 'Analyste', bias: 'Géopolitique indépendant' },
  ]

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: `Tu es un assistant de recoupement journalistique pour Confins, un média géopolitique français indépendant.
      
Ton rôle : analyser un fait d'actualité en croisant les positions des sources suivantes :
${SOURCES.map(s => `- ${s.name} (@${s.id}) : ${s.type}, biais connu: ${s.bias}`).join('\n')}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "topic": "string",
  "consensus": ["point 1", "point 2"],
  "contradictions": ["contradiction 1", "contradiction 2"],
  "synthesis": "string",
  "results": [
    {
      "sourceId": "string",
      "position": "string courte (max 20 mots)",
      "confidence": "haute|moyenne|faible",
      "details": "string (max 100 mots)"
    }
  ]
}`,
      messages: [{
        role: 'user',
        content: `Recoupement de sources sur : "${query}". Cherche en français ET en anglais.`
      }]
    })
  })

  const data = await response.json()
  return NextResponse.json(data)
}
