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
  { id: 'nicksortor', name: 'Nick Sortor', type: 'OSINT', bias: 'Breaking news US', abbr: 'NS' },
  { id: 'amanpour2', name: 'Christiane Amanpour', type: 'Journaliste', bias: 'CNN', abbr: 'CA' },
  { id: 'sprinterpress', name: 'Sprinter Press', type: 'Agrégateur', bias: 'Veille Moyen-Orient', abbr: 'SP' },
  { id: 'theeconomist2', name: 'The Economist', type: 'Média', bias: 'Libéral pro-marché', abbr: 'TE' },
]

const ZONES: Record<string, { label: string; sources: string[]; color: string }> = {
  occident:      { label: 'Occident',              color: '#2D6B9A', sources: ['ft','nytimes','washingtonpost','reuters','ap','theeconomist','afpfr'] },
  monde_arabe:   { label: 'Monde arabe & Golfe',   color: '#C4793A', sources: ['ajenews','middleeasteye','kuwaittimesnews','ramabdu'] },
  resistance:    { label: 'Axe résistance',         color: '#7A3A3A', sources: ['thecradlemedia','hamidrezaaz','furkangozukara','iaeaorg'] },
  independants:  { label: 'Analystes indépendants', color: '#3A7A5A', sources: ['rnaudbertrand','karimbitar','tparsi','sinatoossi','ilangoldenberg','glenn_diesen','realscottritter','citrinowicz'] },
  osint:         { label: 'OSINT & Terrain',        color: '#8A6A2A', sources: ['sentdefender','clashreport','marionawfal','shanaka86','allenanalysis','ryangrim','viviannereim','amanpour'] },
}

const EXAMPLES = [
  {
    query: "Exfiltration du pilote américain en Iran",
    date: "5 avril 2026",
    context: "Un F-15E américain abattu au-dessus de l'Iran. Le pilote exfiltré en 48h par les SEAL Team 6. Washington parle de succès total. Téhéran revendique 5 morts civils. Deux récits contradictoires — qui dit vrai ?"
  },
  {
    query: "Bombardement de la centrale nucléaire de Bushehr",
    date: "28 mars 2026",
    context: "La centrale iranienne de Bushehr frappée pour la 4e fois. L'AIEA alerte sur un risque de fuite radioactive. La couverture médiatique occidentale est quasi absente. Les sources indépendantes divergent sur l'ampleur des dégâts."
  },
]

type SourceResult = {
  source: typeof SOURCES[0]
  position: string
  confidence: 'haute' | 'moyenne' | 'faible'
  details: string
}

const NIVEAU_LABELS: Record<string, { label: string; color: string; note?: string }> = {
  verifie: { label: 'Vérifié',         color: '#4A8FBF' },
  analyse: { label: 'Analyse',         color: '#8A5AAA' },
  veille:  { label: 'Veille · non vérifié', color: '#C8A96E', note: 'Signal de terrain — à recouper avec des sources vérifiées avant diffusion' },
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
  const isPremium = usePremium()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const [visibleResults, setVisibleResults] = useState(0)
  const [history, setHistory] = useState<Analysis[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [narrativeMode, setNarrativeMode] = useState(false)
  const [briefing, setBriefing] = useState<any>(null)
  const [briefingLoading, setBriefingLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const LOADING_MSGS = [
    'Interrogation des sources…',
    'Croisement des données…',
    'Identification des contradictions…',
    'Synthèse en cours…',
  ]

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

  const generateBriefing = async () => {
    if (!history.length) return
    setBriefingLoading(true)
    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyses: history.slice(0, 5) })
      })
      const data = await res.json()
      const text = data.content?.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('') || ''
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
      setBriefing(parsed)
    } catch {}
    setBriefingLoading(false)
  }

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query
    if (!searchQuery.trim()) return
    setQuery(searchQuery)
    setLoading(true)
    setError('')
    setAnalysis(null)
    setVisibleResults(0)
    setBriefing(null)

    let msgIdx = 0
    setLoadingMsg(LOADING_MSGS[0])
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[msgIdx])
    }, 2200)

    try {
      let response: Response | null = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await fetch('/api/recoupement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchQuery })
          })
          if (response.ok) break
        } catch {
          if (attempt === 1) throw new Error('Network error')
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      if (!response) throw new Error('No response')

      const data = await response.json()
      const text = data.content
        ?.filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('') || ''

      const stripTags = (s: string) => s ? s.replace(/<[^>]*>/g, '') : s
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      const results: SourceResult[] = (parsed.results || []).map((r: any) => {
        r.position = stripTags(r.position)
        r.details = stripTags(r.details)
        const source = SOURCES.find(s => s.id === r.sourceId)
          || SOURCES.find(s => r.sourceId?.toLowerCase().includes(s.id.toLowerCase()))
          || SOURCES.find(s => s.name.toLowerCase().includes((r.sourceId || '').toLowerCase().split('_')[0]))
          || { id: r.sourceId, name: r.sourceId || '??', type: '', bias: '', abbr: (r.sourceId || '??').slice(0, 2).toUpperCase() }
        return { source, position: r.position, confidence: r.confidence, details: r.details }
      }).filter((r: any) => r.position)

      const finalAnalysis: Analysis = {
        topic: parsed.topic || searchQuery,
        consensus: parsed.consensus || [],
        contradictions: parsed.contradictions || [],
        synthesis: parsed.synthesis || '',
        results,
        date: new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
      }
      setAnalysis(finalAnalysis)
      saveToHistory(finalAnalysis)
      results.forEach((_, i) => {
        setTimeout(() => setVisibleResults(i + 1), 200 + i * 120)
      })
    } catch {
      setError('timeout')
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
      <div className={styles.heroWrap}>
        <div className={styles.heroTag}>Confins · Outil éditorial</div>
        <h1 className={styles.heroTitle}>Recoupement de <em>sources</em></h1>
        <p className={styles.heroSub}>
          Sur n'importe quel fait d'actualité géopolitique, cet outil interroge en temps réel
          {' '}{SOURCES.length} sources indépendantes — médias, agences, analystes, OSINT, institutions.
          Il identifie ce sur quoi elles s'accordent, ce sur quoi elles divergent,
          et produit une synthèse éditoriale neutre. Pas pour vous dire quoi penser —
          pour vous donner toutes les cartes.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.heroMetaItem}>{SOURCES.length} sources surveillées</span>
          <span className={styles.heroMetaDot}>·</span>
          <span className={styles.heroMetaItem}>Recherche en temps réel</span>
          <span className={styles.heroMetaDot}>·</span>
          <span className={styles.heroMetaItem}>Indice de fiabilité</span>
          <span className={styles.heroMetaDot}>·</span>
          <span className={styles.heroMetaItem}>Narratifs géographiques</span>
        </div>
      </div>

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

        {!analysis && !loading && history.length > 0 && (
          <div className={styles.historyBlock}>
            <button className={styles.historyToggle} onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? '↑ Masquer' : `↓ Historique — ${history.length} analyse${history.length > 1 ? 's' : ''}`}
            </button>
            {showHistory && (
              <div className={styles.historyList}>
                {history.map((h, i) => (
                  <button key={i} className={styles.historyItem} onClick={() => { setAnalysis(h); setQuery(h.topic) }}>
                    <span className={styles.historyTopic}>{h.topic}</span>
                    <span className={styles.historyDate}>{h.date}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!analysis && !loading && (
          <div className={styles.examples}>
            {EXAMPLES.map((ex, i) => (
              <div key={i} className={styles.exCard}>
                <div className={styles.exCardTop}>
                  <span className={styles.exCardDate}>{ex.date}</span>
                  <button className={styles.exCardBtn} onClick={() => handleSearch(ex.query)}>
                    Analyser →
                  </button>
                </div>
                <div className={styles.exCardQuery}>{ex.query}</div>
                <div className={styles.exCardContext}>{ex.context}</div>
              </div>
            ))}
          </div>
        )}

        {/* CAS DOCUMENTÉS */}
        {!analysis && !loading && (
          <div className={styles.casSection}>
            <div className={styles.casLabel}>Cas documentés · Pourquoi croiser les sources</div>
            <div className={styles.casGrid}>
              <a href="/visuels/medias_biais.html" target="_blank" className={styles.casCard}>
                <div className={styles.casTag} style={{color:'#C04040',borderColor:'rgba(192,64,64,.2)'}}>Médias & Démocratie</div>
                <div className={styles.casTitle}>Biden et les médias : 73% des Américains préoccupés, la presse disait "hystérie"</div>
                <div className={styles.casDesc}>Sondages réels · Admissions journalistiques · Timeline documentée 2021–2025</div>
                <div className={styles.casArrow}>Voir l'analyse →</div>
              </a>
              <a href="/visuels/covid_consensus.html" target="_blank" className={styles.casCard}>
                <div className={styles.casTag} style={{color:'#4A8FBF',borderColor:'rgba(74,143,191,.2)'}}>Covid & Institutions</div>
                <div className={styles.casTitle}>Fuite de labo : censurée avant enquête — origine du Covid encore non déterminée</div>
                <div className={styles.casDesc}>Conflits d'intérêts documentés · 8 agences US · Timeline de la censure au retournement</div>
                <div className={styles.casArrow}>Voir l'analyse →</div>
              </a>
            </div>
          </div>
        )}

        {error === 'timeout' && (
          <div className={styles.retryBlock}>
            <div className={styles.retryIcon}>⏳</div>
            <div className={styles.retryTitle}>L'analyse prend plus de temps que prévu</div>
            <p className={styles.retryText}>
              La recherche en temps réel sur {SOURCES.length} sources peut prendre jusqu'à 30 secondes.
              Attendez quelques instants puis relancez.
            </p>
            <button className={styles.retryBtn} onClick={() => { setError(''); handleSearch() }}>
              Relancer l'analyse →
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loadingWrap}>
          <div className={styles.loadingBar}>
            <div className={styles.loadingProgress} />
          </div>
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

      {analysis && (
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsRule} />
            <div className={styles.resultsMeta}>
              <span className={styles.resultsTopic}>{analysis.topic}</span>
              <span className={styles.resultsDate}>{analysis.date}</span>
            </div>
          </div>

          <div className={styles.scoreBlock}>
            <div className={styles.scoreLabel}>Indice de fiabilité</div>
            <div className={styles.scoreBar}>
              <div className={styles.scoreFill} style={{ width: `${reliabilityScore(analysis.results)}%` }} />
            </div>
            <div className={styles.scoreValue}>{reliabilityScore(analysis.results)}%</div>
            <div className={styles.scoreNote}>
              {reliabilityScore(analysis.results) >= 75 ? 'Bien documenté — forte convergence des sources' :
               reliabilityScore(analysis.results) >= 50 ? 'Partiellement documenté — vérification recommandée' :
               'Peu documenté — traiter avec prudence'}
            </div>
          </div>

          <div className={styles.synthesis}>
            <div className={styles.synthLabel}>Synthèse</div>
            <p className={styles.synthText}>{analysis.synthesis}</p>
          </div>

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

          <div className={styles.sourcesSection}>
            <div className={styles.sourcesTitle}>
              Position par source
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${!narrativeMode ? styles.viewBtnActive : ''}`} onClick={() => setNarrativeMode(false)}>Sources</button>
                <button className={`${styles.viewBtn} ${narrativeMode ? styles.viewBtnActive : ''}`} onClick={() => setNarrativeMode(true)}>Narratifs</button>
              </div>
            </div>

            {narrativeMode ? (
              <div className={styles.narrativeGrid}>
                {Object.entries(ZONES).map(([zoneId, zone]) => {
                  const zoneResults = analysis.results.filter(r => zone.sources.includes(r.source.id))
                  if (!zoneResults.length) return null
                  return (
                    <div key={zoneId} className={styles.narrativeZone}>
                      <div className={styles.narrativeZoneLabel} style={{ borderColor: zone.color, color: zone.color }}>
                        {zone.label}
                        <span className={styles.narrativeZoneCount}>{zoneResults.length} source{zoneResults.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className={styles.narrativeZoneSummary}>
                        {zoneResults.map((r, i) => (
                          <div key={i} className={styles.narrativeItem}>
                            <span className={styles.narrativeAbbr} style={{ background: zone.color }}>{r.source.abbr}</span>
                            <div>
                              <div className={styles.narrativePosition}>{r.position}</div>
                              <div className={styles.narrativeDetail}>{r.details}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={styles.sourceCards}>
                {analysis.results.map((r, i) => (
                  <div
                    key={i}
                    className={styles.sourceCard}
                    style={{
                      opacity: i < visibleResults ? 1 : 0,
                      transform: i < visibleResults ? 'none' : 'translateY(16px)',
                      transition: 'opacity .4s ease, transform .4s ease',
                    }}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardAbbr}>{r.source.abbr}</div>
                      <div className={styles.cardInfo}>
                        <div className={styles.cardName}>{r.source.name}</div>
                        <div className={styles.cardMeta}>{r.source.type}{r.source.bias ? ` · ${r.source.bias}` : ''}</div>
                      </div>
                      <div className={styles.niveauBadge} style={{color: NIVEAU_LABELS[(r.source as any).niveau || 'verifie']?.color}}>
                        {NIVEAU_LABELS[(r.source as any).niveau || 'verifie']?.label}
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
            )}
          </div>

          {history.length >= 2 && (
            <div className={styles.briefingBlock}>
              <div className={styles.briefingLabel}>Briefing hebdomadaire</div>
              <p className={styles.briefingDesc}>
                Générez une synthèse éditoriale de vos {Math.min(history.length, 5)} derniers recoupements.
              </p>
              {!briefing && (
                <button className={styles.briefingBtn} onClick={generateBriefing} disabled={briefingLoading}>
                  {briefingLoading ? 'Génération…' : 'Générer le briefing →'}
                </button>
              )}
              {briefing && (
                <div className={styles.briefingResult}>
                  <div className={styles.briefingTitle}>{briefing.titre}</div>
                  <p className={styles.briefingIntro}>{briefing.intro}</p>
                  <ul className={styles.briefingPoints}>
                    {(briefing.points || []).map((p: string, i: number) => (
                      <li key={i} className={styles.briefingPoint}>{p}</li>
                    ))}
                  </ul>
                  <p className={styles.briefingConclusion}>{briefing.conclusion}</p>
                  <button className={styles.briefingReset} onClick={() => setBriefing(null)}>Régénérer</button>
                </div>
              )}
            </div>
          )}

          <button className={styles.newSearch} onClick={() => { setAnalysis(null); setQuery(''); inputRef.current?.focus() }}>
            ← Nouvelle analyse
          </button>
        </div>
      )}
    </div>
  )
}
