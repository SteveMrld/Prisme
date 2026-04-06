import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // Vercel max for hobby plan

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
    { id: 'nowthis_x_media', name: 'Now This Media', type: 'Média', bias: 'Progressiste américain' },
    { id: 'ramabdu', name: 'Ram Abdu', type: 'Analyste', bias: 'Moyen-Orient indépendant' },
    { id: 'markseddon1962', name: 'Mark Seddon', type: 'Journaliste', bias: 'Indépendant, ex-ONU' },
    { id: 'jamesmartinsj', name: 'James Martin SJ', type: 'Analyste', bias: 'Jésuite / éthique internationale' },
    { id: 'spectateursfr', name: 'Spectateur FR', type: 'Agrégateur', bias: 'Veille France / Moyen-Orient' },
    { id: 'kuwaittimesnews', name: 'Kuwait Times', type: 'Média', bias: 'Presse du Golfe' },
    { id: 'ryangrim', name: 'Ryan Grim', type: 'Journaliste', bias: 'Investigation / The Intercept' },
    { id: 'viviannereim', name: 'Vivian Nereim', type: 'Journaliste', bias: 'Bloomberg / Arabie Saoudite' },
    { id: 'globeeyenews', name: 'Globe Eye News', type: 'Agrégateur', bias: 'Veille géopolitique globale' },
    { id: 'nicksortor', name: 'Nick Sortor', type: 'OSINT', bias: 'Breaking news / terrain US' },
    { id: 'amanpour', name: 'Christiane Amanpour', type: 'Journaliste', bias: 'CNN / international' },
    { id: 'nexta_tv', name: 'Nexta TV', type: 'Média', bias: 'Est-européen / pro-Ukraine' },
    { id: 'sprinterpress', name: 'Sprinter Press', type: 'Agrégateur', bias: 'Veille Moyen-Orient' },
    { id: 'ilangoldenberg', name: 'Ilan Goldenberg', type: 'Analyste', bias: 'Think tank DC / CNAS' },
    { id: 'glenn_diesen', name: 'Glenn Diesen', type: 'Analyste', bias: 'Académique / Russie-OTAN' },
    { id: 'theeconomist', name: 'The Economist', type: 'Média', bias: 'Libéral pro-marché' },
    { id: 'afpfr', name: 'AFP', type: 'Agence', bias: 'Agence officielle française' },
    { id: 'realscottritter', name: 'Scott Ritter', type: 'Analyste', bias: 'Ex-inspecteur ONU / anti-OTAN' },
    { id: 'sinatoossi', name: 'Sina Toossi', type: 'Analyste', bias: 'Iran / négociation' },
    { id: 'citrinowicz',    name: 'Citrinowicz',    type: 'Analyste', bias: 'Moyen-Orient / sécurité' },
    { id: 'foreignpolicy',  name: 'Foreign Policy', type: 'Média',    bias: 'Géopolitique académique US' },
    { id: 'timothydsnyder', name: 'Timothy Snyder', type: 'Analyste', bias: 'Historien Yale / autoritarisme' },
    { id: 'warfrontintel',  name: 'War Front Intel',type: 'OSINT',    bias: 'Veille conflits / terrain' },
    { id: 'nytimes', name: 'New York Times', type: 'Média', bias: 'Centre libéral US / référence mondiale' },
    { id: 'reuters', name: 'Reuters', type: 'Agence', bias: 'Agence internationale / factuel' },
    { id: 'ap', name: 'AP', type: 'Agence', bias: 'Agence américaine / factuel' },
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
      
Ton rôle : analyser un fait d'actualité en croisant les positions de ces sources précises :
${SOURCES.map(s => `- ${s.name} (@${s.id}) : ${s.type}, biais: ${s.bias}`).join('\n')}

HIÉRARCHIE DES SOURCES — pondère ainsi :
- VÉRIFIÉ (agences, grands médias) : information confirmée, haute fiabilité
- ANALYSE (experts, think tanks) : interprétation rigoureuse, biais déclarés
- VEILLE (OSINT, terrain) : signal à recouper, ne pas prendre pour argent comptant

RÈGLES STRICTES :
1. Chaque source ne peut apparaître QU'UNE SEULE FOIS dans "results"
2. Recherche activement chaque source par son nom sur le web
3. Si tu ne trouves pas d'info pour une source, ne l'inclus pas dans results
4. Vise minimum 6 sources différentes dans results
5. N'invente jamais de position — confidence "faible" si tu n'as qu'une vague indication

Les sourceId EXACTS à utiliser (copie-les tel quel) :
${SOURCES.map(s => `"${s.id}" = ${s.name}`).join(', ')}

Réponds UNIQUEMENT en JSON valide :
{
  "topic": "string",
  "consensus": ["point 1", "point 2"],
  "contradictions": ["contradiction 1", "contradiction 2"],
  "synthesis": "string (2-3 phrases neutres et factuelles)",
  "coverage_index": number (0-100, estimation du nombre de sources majeures ayant couvert ce fait),
  "missing_sources": ["nom de source importante qui n'a PAS couvert ce fait — max 3"],
  "historical_context": "string (1-2 phrases sur comment ce sujet était traité il y a 3-6 mois, si pertinent)",
  "results": [
    {
      "sourceId": "string (l'id exact de la source)",
      "position": "string courte (max 20 mots)",
      "confidence": "haute|moyenne|faible",
      "details": "string (max 80 mots)"
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
  if (!response.ok) {
    console.error('Anthropic API error:', data)
    return NextResponse.json({ error: `API error: ${response.status}`, detail: data }, { status: 502 })
  }
  return NextResponse.json(data)
}
