import { NextRequest, NextResponse } from 'next/server'
import { requireActiveSubscriber, consumeQuota, peekQuota } from '../../../lib/recoupement-auth'
import { SOURCES, formatSourcesForPrompt } from '../../../lib/recoupement-sources'

export const maxDuration = 60 // Vercel max for hobby plan

export async function POST(req: NextRequest) {
  // 1. Auth + abonnement actif (ou admin)
  const auth = await requireActiveSubscriber()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { query } = await req.json()
  if (!query) return NextResponse.json({ error: 'No query' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

  // 2. On VÉRIFIE que du quota est disponible, sans le consommer.
  //    On ne débite qu'une fois la réponse Anthropic parsée avec succès.
  const peek = await peekQuota(auth.userId, auth.isAdmin)
  if (!peek.ok) {
    return NextResponse.json({
      error: peek.error,
      quota: { used: peek.used, limit: peek.limit, remaining: 0 },
    }, { status: peek.status })
  }

  // AbortController pour couper proprement avant le timeout Vercel (60s)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 50_000)

  let response: Response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 6000,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }],
        system: `Tu es un assistant de recoupement journalistique pour Soara, un média géopolitique français indépendant.

Sur un fait d'actualité donné, tu croises les positions de sources variées pour identifier consensus et divergences.

SOURCES DISPONIBLES — utilise l'id EXACT comme "sourceId" :
${formatSourcesForPrompt(SOURCES)}

MÉTHODE :
1. Identifie 8 à 12 sources pertinentes pour le sujet (ne cherche PAS les ${SOURCES.length} systématiquement).
2. Fais 6 à 10 recherches web ciblées, pas plus.
3. Pour chaque source trouvée, extrais sa position en français.
4. Vise 6 sources minimum dans "results". Si une source n'a pas traité le sujet, ne l'inclus pas.
5. N'invente jamais une position — si indication vague, confidence "faible".

OUTPUT — uniquement du JSON valide, rien avant ni après :
{
  "topic": "résumé en 5-10 mots",
  "consensus": ["2-3 points de consensus"],
  "contradictions": ["2-3 divergences notables"],
  "synthesis": "2-3 phrases neutres et factuelles",
  "coverage_index": 0-100,
  "missing_sources": ["max 3 sources qui n'ont visiblement pas couvert"],
  "historical_context": "1-2 phrases sur la couverture il y a 3-6 mois",
  "results": [
    {"sourceId": "id exact", "position": "position (<20 mots)", "confidence": "haute|moyenne|faible", "details": "détails (<80 mots)"}
  ]
}`,
        messages: [{
          role: 'user',
          content: `Recoupement sur : "${query}". Cherche en français et en anglais.`
        }]
      })
    })
  } catch (err: any) {
    clearTimeout(timeoutId)
    const isAbort = err?.name === 'AbortError'
    console.error('Anthropic fetch failed:', isAbort ? 'timeout 50s' : err?.message)
    return NextResponse.json({
      error: isAbort ? 'Timeout — analyse trop longue' : 'Erreur réseau',
      quota: { used: peek.used, limit: peek.limit, remaining: peek.remaining },
      not_charged: true,
    }, { status: 504 })
  }
  clearTimeout(timeoutId)

  const data = await response.json()
  if (!response.ok) {
    console.error('Anthropic API error:', data)
    // Aucun quota débité — l'utilisateur peut réessayer sans pénalité
    return NextResponse.json({
      error: `API error: ${response.status}`,
      detail: data,
      quota: { used: peek.used, limit: peek.limit, remaining: peek.remaining },
      not_charged: true,
    }, { status: 502 })
  }

  // 3. On vérifie que la réponse est PARSABLE avant de débiter.
  //    Si Anthropic a renvoyé du JSON coupé / invalide, on refuse côté serveur
  //    et on ne consomme pas le quota.
  try {
    const text: string = data.content
      ?.filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('') || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    if (!parsed.results || !Array.isArray(parsed.results) || parsed.results.length === 0) {
      throw new Error('Empty results')
    }
  } catch (err) {
    console.error('Anthropic returned unparsable JSON:', err)
    return NextResponse.json({
      error: 'Analyse incomplète, rien consommé',
      quota: { used: peek.used, limit: peek.limit, remaining: peek.remaining },
      not_charged: true,
    }, { status: 502 })
  }

  // 4. La réponse est valide → on consomme UN crédit (mensuel ou extra)
  const quota = await consumeQuota(auth.userId, auth.isAdmin)
  if (!quota.ok) {
    // Cas rare : course condition avec un autre appel — on laisse passer mais on signale
    return NextResponse.json({
      ...data,
      quota: { used: peek.used, limit: peek.limit, remaining: peek.remaining },
    })
  }

  return NextResponse.json({
    ...data,
    quota: { used: quota.used, limit: quota.limit, remaining: quota.remaining },
  })
}
