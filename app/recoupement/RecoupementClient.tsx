'use client'
import { useState, useEffect, useRef } from 'react'
import { usePremium } from '../../lib/usePremium'
import styles from './recoupement.module.css'

const SOURCES = [
  { id: 'ajenews', name: 'Al Jazeera', type: 'Média', bias: 'Qatar / pro-palestinien', abbr: 'AJ' },
  { id: 'haaretzcom', name: 'Haaretz', type: 'Média', bias: 'Israélien progressiste', abbr: 'Ha' },
  { id: 'ft', name: 'Financial Times', type: 'Média', bias: 'Libéral occidental', abbr: 'FT' },
  { id: 'dropsitenews', name: 'Drop Site News', type: 'Média indép.', bias: 'Investigation', abbr: 'DS' },
  { id: 'theintercept', name: 'The Intercept', type: 'Média indép.', bias: 'Gauche américaine', abbr: 'TI' },
  { id: 'washingtonpost', name: 'Washington Post', type: 'Média', bias: 'Centre libéral US', abbr: 'WP' },
  { id: 'nytimes', name: 'New York Times', type: 'Média', bias: 'Centre libéral US', abbr: 'NY' },
  { id: 'reuters', name: 'Reuters', type: 'Agence', bias: 'Factuel international', abbr: 'RE' },
  { id: 'ap', name: 'AP', type: 'Agence', bias: 'Factuel américain', abbr: 'AP' },
  { id: 'thecradlemedia', name: 'The Cradle', type: 'Média', bias: 'Pro-résistance', abbr: 'TC' },
  { id: 'middleeasteye', name: 'Middle East Eye', type: 'Média', bias: 'Moyen-Orient indép.', abbr: 'ME' },
  { id: 'theeconomist', name: 'The Economist', type: 'Média', bias: 'Libéral pro-marché', abbr: 'TE' },
  { id: 'afpfr', name: 'AFP', type: 'Agence', bias: 'Agence française', abbr: 'AF' },
  { id: 'marionawfal', name: 'Marion Awfal', type: 'Journaliste', bias: 'Terrain / sources arabes', abbr: 'MA' },
  { id: 'rnaudbertrand', name: 'Arnaud Bertrand', type: 'Analyste', bias: 'Pro-multilatéral', abbr: 'AB' },
  { id: 'karimbitar', name: 'Karim Bitar', type: 'Analyste', bias: 'Franco-libanais', abbr: 'KB' },
  { id: 'sentdefender', name: 'Sentinel Defender', type: 'OSINT', bias: 'Militaire / renseignement', abbr: 'SD' },
  { id: 'clashreport', name: 'Clash Report', type: 'Agrégateur', bias: 'Breaking news', abbr: 'CR' },
  { id: 'kobeissiletter', name: 'The Kobeissi Letter', type: 'Finance', bias: 'Marchés / géopolitique', abbr: 'KL' },
  { id: 'iaeaorg', name: 'IAEA', type: 'Institution', bias: 'Nucléaire international', abbr: 'IA' },
  { id: 'tparsi', name: 'Trita Parsi', type: 'Think tank', bias: 'NIAC / pro-négociation', abbr: 'TP' },
  { id: 'shanaka86', name: 'Shanaka', type: 'Analyste', bias: 'Géopolitique indépendant', abbr: 'Sh' },
  { id: 'hamidrezaaz', name: 'Hamidreza', type: 'Analyste', bias: 'Iran / stratégie', abbr: 'HR' },
  { id: 'furkangozukara', name: 'Furkan Gözükara', type: 'Journaliste', bias: 'Terrain Moyen-Orient', abbr: 'FG' },
  { id: 'allenanalysis', name: 'Allen Analysis', type: 'Analyste', bias: 'Géopolitique indépendant', abbr: 'AA' },
  { id: 'nowthis_x_media', name: 'Now This Media', type: 'Média', bias: 'Progressiste américain', abbr: 'NT' },
  { id: 'ramabdu', name: 'Ram Abdu', type: 'Analyste', bias: 'Moyen-Orient indépendant', abbr: 'RA' },
  { id: 'markseddon1962', name: 'Mark Seddon', type: 'Journaliste', bias: 'Indépendant, ex-ONU', abbr: 'MS' },
  { id: 'jamesmartinsj', name: 'James Martin SJ', type: 'Analyste', bias: 'Éthique internationale', abbr: 'JM' },
  { id: 'kuwaittimesnews', name: 'Kuwait Times', type: 'Média', bias: 'Presse du Golfe', abbr: 'KT' },
  { id: 'ryangrim', name: 'Ryan Grim', type: 'Journaliste', bias: 'Investigation indépendant', abbr: 'RG' },
  { id: 'viviannereim', name: 'Vivian Nereim', type: 'Journaliste', bias: 'Bloomberg / Golfe', abbr: 'VN' },
  { id: 'globeeyenews', name: 'Globe Eye News', type: 'Agrégateur', bias: 'Veille globale', abbr: 'GE' },
  { id: 'amanpour', name: 'Christiane Amanpour', type: 'Journaliste', bias: 'CNN / international', abbr: 'CA' },
  { id: 'nexta_tv', name: 'Nexta TV', type: 'Média', bias: 'Est-européen / pro-Ukraine', abbr: 'NX' },
  { id: 'ilangoldenberg', name: 'Ilan Goldenberg', type: 'Analyste', bias: 'Think tank DC', abbr: 'IG' },
  { id: 'glenn_diesen', name: 'Glenn Diesen', type: 'Analyste', bias: 'Russie-OTAN', abbr: 'GD' },
  { id: 'realscottritter', name: 'Scott Ritter', type: 'Analyste', bias: 'Ex-inspecteur ONU', abbr: 'SR' },
  { id: 'sinatoossi', name: 'Sina Toossi', type: 'Analyste', bias: 'Iran / négociation', abbr: 'ST' },
  { id: 'citrinowicz', name: 'Citrinowicz', type: 'Analyste', bias: 'Moyen-Orient / sécurité', abbr: 'CI' },
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

const EXAMPLES = [
  'Exfiltration du pilote américain en Iran',
  'Bombardement de la centrale de Bushehr',
  'Ultimatum de Trump sur le détroit d\'Ormuz',
  'Position de la Chine sur le conflit Iran-Israël',
  'Arrestation de Pezeshkian à Téhéran',
]

export default function RecoupementClient() {
  const isPremium = usePremium()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const [visibleResults, setVisibleResults] = useState<number>(0)
  const [history, setHistory] = useState<Analysis[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('confins_recoupement_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  const saveToHistory = (a: Analysis) => {
    try {
      const updated = [a, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem('confins_recoupement_history', JSON.stringify(updated))
    } catch {}
  }

  const reliabilityScore = (results: SourceResult[]) => {
    if (!results.length) return 0
    const weights = { haute: 3, moyenne: 2, faible: 1 }
    const total = results.reduce((sum, r) => sum + weights[r.confidence], 0)
    return Math.round((total / (results.length * 3)) * 100)
  }

  const LOADING_MSGS = [
    'Interrogation des sources…',
    'Croisement des données…',
    'Identification des contradictions…',
    'Synthèse en cours…',
  ]

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query
    if (!searchQuery.trim()) return
    setQuery(searchQuery)
    setLoading(true)
    setError('')
    setAnalysis(null)
    setVisibleResults(0)

    let msgIdx = 0
    setLoadingMsg(LOADING_MSGS[0])
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[msgIdx])
    }, 2200)

    try {
      // Retry up to 2 times on failure
      let response: Response | null = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await fetch('/api/recoupement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchQuery })
          })
          if (response.ok) break
        } catch (fetchErr) {
          if (attempt === 1) throw fetchErr
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      if (!response) throw new Error('No response')
      const data = await response.json()
      const text = data.content
        ?.filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('') || ''

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      const results: SourceResult[] = (parsed.results || []).map((r: any) => {
        const source = SOURCES.find(s => s.id === r.sourceId)
          || SOURCES.find(s => r.sourceId?.toLowerCase().includes(s.id.toLowerCase()))
          || SOURCES.find(s => s.name.toLowerCase().includes((r.sourceId || '').toLowerCase().split('_')[0]))
          || { id: r.sourceId, name: r.sourceId, type: '', bias: '', abbr: (r.sourceId || '??').slice(0, 2).toUpperCase() }
        return { source, position: r.position, confidence: r.confidence, details: r.details }
      }).filter((r: any) => r.position)

      const finalAnalysis = {
        topic: parsed.topic || searchQuery,
        consensus: parsed.consensus || [],
        contradictions: parsed.contradictions || [],
        synthesis: parsed.synthesis || '',
        results,
        date: new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
      }
      setAnalysis(finalAnalysis)
      saveToHistory(finalAnalysis)

      // Stagger results reveal
      results.forEach((_, i) => {
        setTimeout(() => setVisibleResults(i + 1), 200 + i * 120)
      })
    } catch (e) {
      setError('Erreur lors de l\'analyse. Reformulez le sujet ou réessayez.')
    } finally {
      clearInterval(msgInterval)
      setLoading(false)
    }
  }

  if (!isPremium) {
    return (
      <div className={styles.page}>
        <div className={styles.heroWrap}>
          <div className={styles.heroTag}>Confins · Outil éditorial</div>
          <h1 className={styles.heroTitle}>Recoupement de <em>sources</em></h1>
          <p className={styles.heroSub}>L'information telle qu'elle est. Pas telle qu'on vous la raconte.</p>
        </div>
        <div className={styles.paywall}>
          <div className={styles.paywallTitle}>Fonctionnalité réservée aux abonnés</div>
          <p className={styles.paywallText}>Croisez {SOURCES.length} sources géopolitiques indépendantes sur n'importe quel fait d'actualité.</p>
          <a href="/abonnement" className={styles.paywallBtn}>S'abonner →</a>
          <a href="/connexion" className={styles.paywallLink}>Déjà abonné ? Se connecter</a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* HERO */}
      <div className={styles.heroWrap}>
        <div className={styles.heroTag}>Confins · Outil éditorial</div>
        <h1 className={styles.heroTitle}>Recoupement de <em>sources</em></h1>
        <p className={styles.heroSub}>
          L'information telle qu'elle est. Pas telle qu'on vous la raconte.<br />
          <span className={styles.heroCount}>{SOURCES.length} sources · médias, OSINT, analystes, agences, institutions</span>
        </p>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrap}>
        <div className={styles.searchInner}>
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Entrez un fait d'actualité à analyser…"
            autoComplete="off"
          />
          <button
            className={styles.searchBtn}
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
          >
            {loading ? <span className={styles.btnSpinner} /> : 'Analyser →'}
          </button>
        </div>

        {!analysis && !loading && (
          <div className={styles.examples}>
            {EXAMPLES.map(ex => (
              <button key={ex} className={styles.exBtn} onClick={() => handleSearch(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>

      {/* LOADING */}
      {loading && (
        <div className={styles.loadingWrap}>
          <div className={styles.loadingBar}><div className={styles.loadingProgress} /></div>
          <div className={styles.loadingMsg}>{loadingMsg}</div>
          <div className={styles.loadingSources}>
            {SOURCES.slice(0, 12).map((s, i) => (
              <span key={s.id} className={styles.loadingSource} style={{ animationDelay: `${i * 0.15}s` }}>
                {s.abbr}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {analysis && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsRule} />
            <div className={styles.resultsMeta}>
              <span className={styles.resultsTopic}>{analysis.topic}</span>
              <span className={styles.resultsDate}>{analysis.date}</span>
            </div>
          </div>

          {/* RELIABILITY SCORE */}
          {(() => {
            const score = reliabilityScore(analysis.results)
            return (
              <div className={styles.scoreBlock}>
                <div className={styles.scoreLabel}>Indice de fiabilité</div>
                <div className={styles.scoreBar}>
                  <div className={styles.scoreFill} style={{ width: `${score}%` }} />
                </div>
                <div className={styles.scoreValue}>{score}%</div>
                <div className={styles.scoreNote}>
                  {score >= 75 ? 'Bien documenté — forte convergence des sources' :
                   score >= 50 ? 'Partiellement documenté — vérification recommandée' :
                   'Peu documenté — traiter avec prudence'}
                </div>
              </div>
            )
          })()}

          {/* SYNTHESIS */}
          <div className={styles.synthesis}>
            <div className={styles.synthLabel}>Synthèse</div>
            <p className={styles.synthText}>{analysis.synthesis}</p>
          </div>

          {/* CONSENSUS + CONTRADICTIONS */}
          <div className={styles.dualBlock}>
            <div className={styles.consensusCol}>
              <div className={styles.colLabel} data-type="consensus">Points de consensus</div>
              <div className={styles.colItems}>
                {analysis.consensus.map((c, i) => (
                  <div key={i} className={styles.consensusItem}>
                    <span className={styles.dot} data-type="consensus" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.contraCol}>
              <div className={styles.colLabel} data-type="contra">Contradictions</div>
              <div className={styles.colItems}>
                {analysis.contradictions.map((c, i) => (
                  <div key={i} className={styles.contradictionItem}>
                    <span className={styles.dot} data-type="contra" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SOURCE CARDS */}
          <div className={styles.sourcesSection}>
            <div className={styles.sourcesTitle}>
              Position par source
              <span className={styles.sourcesCount}>{analysis.results.length} sources analysées</span>
            </div>
            <div className={styles.sourceCards}>
              {analysis.results.map((r, i) => (
                <div
                  key={i}
                  className={styles.sourceCard}
                  style={{
                    opacity: i < visibleResults ? 1 : 0,
                    transform: i < visibleResults ? 'none' : 'translateY(16px)',
                    transition: `opacity .4s ease, transform .4s ease`,
                  }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardAbbr}>{r.source.abbr}</div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardName}>{r.source.name}</div>
                      <div className={styles.cardMeta}>{r.source.type}{r.source.bias ? ` · ${r.source.bias}` : ''}</div>
                    </div>
                    <div className={styles.cardConf} data-level={r.confidence}>
                      {r.confidence === 'haute' ? '●●●' : r.confidence === 'moyenne' ? '●●○' : '●○○'}
                    </div>
                  </div>
                  <div className={styles.cardPosition}>{r.position}</div>
                  <div className={styles.cardDetails}>{r.details}</div>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.newSearch} onClick={() => { setAnalysis(null); setQuery(''); inputRef.current?.focus() }}>
            ← Nouvelle analyse
          </button>
        </div>
      )}
    </div>
  )
}
