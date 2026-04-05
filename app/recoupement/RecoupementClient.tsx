'use client'
import { useState } from 'react'
import { usePremium } from '../../lib/usePremium'
import styles from './recoupement.module.css'

const SOURCES = [
  { id: 'ajenews', name: 'Al Jazeera', type: 'Média', bias: 'Qatar / pro-palestinien', icon: '📡' },
  { id: 'haaretzcom', name: 'Haaretz', type: 'Média', bias: 'Israélien progressiste', icon: '📰' },
  { id: 'ft', name: 'Financial Times', type: 'Média', bias: 'Libéral occidental', icon: '📊' },
  { id: 'dropsitenews', name: 'Drop Site News', type: 'Média indép.', bias: 'Journalisme d\'investigation', icon: '🔍' },
  { id: 'theintercept', name: 'The Intercept', type: 'Média indép.', bias: 'Gauche américaine', icon: '🔎' },
  { id: 'washingtonpost', name: 'Washington Post', type: 'Média', bias: 'Centre libéral US', icon: '📋' },
  { id: 'thecradlemedia', name: 'The Cradle', type: 'Média', bias: 'Pro-résistance', icon: '🌍' },
  { id: 'middleeasteye', name: 'Middle East Eye', type: 'Média', bias: 'Indépendant Moyen-Orient', icon: '👁' },
  { id: 'marionawfal', name: 'Marion Awfal', type: 'Journaliste', bias: 'Terrain / sources arabes', icon: '✍️' },
  { id: 'rnaudbertrand', name: 'Arnaud Bertrand', type: 'Analyste', bias: 'Pro-multilatéral', icon: '🧠' },
  { id: 'karimbitar', name: 'Karim Bitar', type: 'Analyste', bias: 'Académique franco-libanais', icon: '🎓' },
  { id: 'sentdefender', name: 'Sentinel Defender', type: 'OSINT', bias: 'Militaire / renseignement', icon: '🛡' },
  { id: 'clashreport', name: 'Clash Report', type: 'Agrégateur', bias: 'Breaking news / non filtré', icon: '⚡' },
  { id: 'kobeissiletter', name: 'The Kobeissi Letter', type: 'Finance', bias: 'Marchés / géopolitique éco', icon: '💹' },
  { id: 'iaeaorg', name: 'IAEA', type: 'Institution', bias: 'Nucléaire / international', icon: '☢️' },
  { id: 'tparsi', name: 'Trita Parsi', type: 'Think tank', bias: 'NIAC / pro-négociation', icon: '🕊' },
  { id: 'shanaka86', name: 'Shanaka', type: 'Analyste', bias: 'Géopolitique indépendant', icon: '📌' },
  { id: 'hamidrezaaz', name: 'Hamidreza', type: 'Analyste', bias: 'Iran / stratégie militaire', icon: '🗺' },
  { id: 'furkangozukara', name: 'Furkan Gözükara', type: 'Journaliste', bias: 'Terrain Moyen-Orient', icon: '📸' },
  { id: 'allenanalysis', name: 'Allen Analysis', type: 'Analyste', bias: 'Géopolitique indépendant', icon: '🔬' },
]

type SourceResult = {
  source: typeof SOURCES[0]
  position: string
  confidence: 'haute' | 'moyenne' | 'faible'
  details: string
}

type Analysis = {
  topic: string
  consensus: string[]
  contradictions: string[]
  synthesis: string
  results: SourceResult[]
  date: string
}

export default function RecoupementClient() {
  const [query, setQuery] = useState('')
  const isPremium = usePremium()
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/recoupement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()
      const text = data.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('')

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      const results: SourceResult[] = (parsed.results || []).map((r: any) => ({
        source: SOURCES.find(s => s.id === r.sourceId) || SOURCES[0],
        position: r.position,
        confidence: r.confidence,
        details: r.details,
      })).filter((r: any) => r.source)

      setAnalysis({
        topic: parsed.topic || query,
        consensus: parsed.consensus || [],
        contradictions: parsed.contradictions || [],
        synthesis: parsed.synthesis || '',
        results,
        date: new Date().toLocaleString('fr-FR'),
      })
    } catch (e) {
      setError('Erreur lors de l\'analyse. Reformulez le sujet ou réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (!isPremium) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Confins · Outil éditorial</div>
          <h1 className={styles.title}>Recoupement de <em>sources</em></h1>
          <p className={styles.subtitle}>Croisez 20 sources sur un fait d'actualité — médias, OSINT, analystes, institutions.</p>
        </div>
        <div className={styles.paywall}>
          <div className={styles.paywallIcon}>🔍</div>
          <div className={styles.paywallTitle}>Fonctionnalité Premium</div>
          <p className={styles.paywallText}>
            L'outil Recoupement est réservé aux abonnés Confins. Il vous permet de croiser 20 sources
            géopolitiques sur n'importe quel fait d'actualité et d'identifier consensus et contradictions.
          </p>
          <a href="/abonnement" className={styles.paywallBtn}>S'abonner pour y accéder →</a>
          <a href="/connexion" className={styles.paywallLink}>Déjà abonné ? Se connecter</a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>Confins · Outil éditorial</div>
        <h1 className={styles.title}>Recoupement de <em>sources</em></h1>
        <p className={styles.subtitle}>
          Croisez {SOURCES.length} sources sur un fait d'actualité — médias, OSINT, analystes, institutions.
          Identifiez consensus et contradictions.
        </p>
      </div>

      <div className={styles.searchBlock}>
        <div className={styles.searchLabel}>Fait à analyser</div>
        <div className={styles.searchRow}>
          <input
            className={styles.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: exfiltration du pilote américain en Iran"
          />
          <button
            className={styles.btn}
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? 'Analyse…' : 'Analyser →'}
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingDot} />
          <span>Interrogation des sources en cours…</span>
        </div>
      )}

      {analysis && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsTitle}>{analysis.topic}</div>
            <div className={styles.resultsDate}>{analysis.date}</div>
          </div>

          <div className={styles.synthesis}>
            <div className={styles.synthLabel}>Synthèse éditoriale</div>
            <p className={styles.synthText}>{analysis.synthesis}</p>
          </div>

          <div className={styles.consensusGrid}>
            <div className={styles.consensusBlock}>
              <div className={styles.consensusLabel}>Points de consensus</div>
              {analysis.consensus.map((c, i) => (
                <div key={i} className={styles.consensusItem}>
                  <span className={styles.checkmark}>✓</span> {c}
                </div>
              ))}
            </div>
            <div className={styles.contredictionsBlock}>
              <div className={styles.contradictionsLabel}>Contradictions</div>
              {analysis.contradictions.map((c, i) => (
                <div key={i} className={styles.contradictionItem}>
                  <span className={styles.cross}>⚡</span> {c}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sourcesGrid}>
            <div className={styles.sourcesLabel}>Position par source</div>
            {analysis.results.map((r, i) => (
              <div key={i} className={styles.sourceCard}>
                <div className={styles.sourceHead}>
                  <span className={styles.sourceAbbr}>{(r.source as any).abbr}</span>
                  <div>
                    <div className={styles.sourceName}>{r.source.name}</div>
                    <div className={styles.sourceMeta}>{r.source.type} · {r.source.bias}</div>
                  </div>
                  <span className={styles.confidence} data-level={r.confidence}>
                    {r.confidence === 'haute' ? '●●●' : r.confidence === 'moyenne' ? '●●○' : '●○○'}
                  </span>
                </div>
                <div className={styles.sourcePosition}>{r.position}</div>
                <div className={styles.sourceDetails}>{r.details}</div>
              </div>
            ))}
          </div>

          <div className={styles.sourcesUsed}>
            <div className={styles.sourcesUsedLabel}>Sources surveillées · {SOURCES.length} sources</div>
            <div className={styles.sourcesList}>
              {SOURCES.map(s => (
                <span key={s.id} className={styles.sourceTag}>
                  {(s as any).abbr} · {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!analysis && !loading && (
        <div className={styles.examples}>
          <div className={styles.examplesLabel}>Exemples de recoupements</div>
          {[
            'Exfiltration du pilote américain en Iran',
            'Bombardement de la centrale de Bushehr',
            'Ultimatum de Trump sur le détroit d\'Ormuz',
            'Position de la Chine sur le conflit Iran-Israël',
          ].map(ex => (
            <button key={ex} className={styles.exampleBtn} onClick={() => { setQuery(ex); }}>
              {ex} →
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
