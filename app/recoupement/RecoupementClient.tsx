'use client'
import { useState, useEffect, useRef } from 'react'
import { usePremium } from '../../lib/usePremium'
import { SOURCES } from '../../lib/recoupement-sources'
import styles from './recoupement.module.css'


const ZONES: Record<string, { label: string; sources: string[]; color: string }> = {
  occident:      { label: 'Occident',               color: '#2D6B9A', sources: ['ft','nytimes','washingtonpost','reuters','ap','theeconomist','afpfr','theatlantic','lesechos','responsiblestatecraft'] },
  europe:        { label: 'Europe & France',         color: '#4A2080', sources: ['mediapart','lesechos','scienceetvie','legrandcontinent','afpfr'] },
  afrique:       { label: 'Afrique',                 color: '#8B4513', sources: ['theafricareport','dailymaverick','afriquexxi','thecontinent'] },
  asie:          { label: 'Asie',                    color: '#2D6B4A', sources: ['thewire','nikkeasia','caixin'] },
  monde_arabe:   { label: 'Monde arabe & Golfe',    color: '#C4793A', sources: ['ajenews','middleeasteye','kuwaittimesnews','ramabdu'] },
  resistance:    { label: 'Axe résistance',          color: '#7A3A3A', sources: ['thecradlemedia','hamidrezaaz','furkangozukara','iaeaorg'] },
  independants:  { label: 'Analystes indépendants',  color: '#3A7A5A', sources: ['rnaudbertrand','karimbitar','tparsi','sinatoossi','ilangoldenberg','glenn_diesen','realscottritter','citrinowicz'] },
  osint:         { label: 'OSINT & Terrain',         color: '#8A6A2A', sources: ['sentdefender','clashreport','marionawfal','shanaka86','allenanalysis','ryangrim','viviannereim','amanpour'] },
  ecologie:      { label: 'Écologie & Ressources',   color: '#2D6B3A', sources: ['carbonbrief','theshiftproject','globalwitness','ieefa','taxjustice'] },
  securite:      { label: 'Sécurité & Géopolitique', color: '#1A3E6B', sources: ['chathamhouse','sipri','responsiblestatecraft'] },
  tech_critique: { label: 'Tech & Numérique',        color: '#5A2080', sources: ['algorithmwatch','accessnow'] },
  sante:         { label: 'Santé & Sciences',        color: '#2D7A5A', sources: ['cochrane','bmj','statnews','ourworldindata','retractionwatch','ioannidis','vinay_prasad','bhattacharya'] },
  economie:      { label: 'Économie & Finance',       color: '#B86A1A', sources: ['imf','worldbank','bis','ocde','ofce','bloombergeco','stiglitz','acemoglu','positivemoney','lesechos','ft'] },
}


const MOCK_ANALYSES: Record<string, any> = {
  covid: {
    topic: "Origine du Covid-19 : laboratoire ou marché ?",
    date: "Janvier 2021",
    synthesis: "L'origine du SARS-CoV-2 reste non déterminée. Deux thèses coexistent : transmission zoonotique depuis un marché de Wuhan, et fuite accidentelle de l'Institut de virologie de Wuhan. Le FBI et le Department of Energy américains jugent la piste laboratoire probable. L'OMS et la majorité des virologies publiées dans Nature penchent vers l'origine animale. L'enquête internationale a été compromise par l'absence d'accès aux données chinoises.",
    consensus: [
      "Le virus est apparu à Wuhan fin 2019",
      "Aucune preuve directe de manipulation génétique intentionnelle",
      "L'enquête internationale a été entravée par Pékin",
      "Les deux thèses restent scientifiquement possibles"
    ],
    contradictions: [
      "OMS et Nature : origine zoonotique probable — FBI et DOE : fuite de laboratoire probable",
      "Peter Daszak (EcoHealth) siégeait dans la commission d'enquête tout en finançant l'IVW",
      "Les premiers lanceurs d'alerte chinois ont été réduits au silence en janvier 2020",
      "La thèse laboratoire, censurée en 2020, est aujourd'hui jugée crédible par les services US"
    ],
    coverage_index: 42,
    missing_sources: ["Global Times", "CGTN", "Xinhua"],
    historical_context: "En février 2021, Facebook supprimait automatiquement les posts évoquant une fuite de laboratoire. En mai 2023, le Sénat américain votait à l'unanimité pour déclassifier les documents sur l'origine du Covid. Le retournement médiatique illustre comment le consensus scientifique peut être instrumentalisé.",
    results: [
      { source: { id: "nytimes", name: "New York Times", abbr: "NYT", type: "Média", bias: "Centre-gauche" }, position: "Origine zoonotique probable", details: "Couvre principalement les études en faveur d'une origine naturelle. La thèse laboratoire qualifiée de théorie du complot jusqu'en 2021.", reliability: "veille" },
      { source: { id: "theintercept", name: "The Intercept", abbr: "INT", type: "Média", bias: "Indépendant" }, position: "Fuite de laboratoire plausible", details: "A publié les documents déclassifiés montrant le financement par EcoHealth Alliance de recherches à l'IVW.", reliability: "verifie" },
      { source: { id: "reuters", name: "Reuters", abbr: "REU", type: "Agence", bias: "Neutre" }, position: "Enquête entravée", details: "Documente les refus d'accès aux données chinoises et les pressions diplomatiques sur l'OMS.", reliability: "verifie" },
    ]
  },
  biden: {
    topic: "Biden et le déclin cognitif : ce que la presse savait",
    date: "Juillet 2024",
    synthesis: "Les signes de déclin cognitif de Joe Biden étaient documentés depuis au moins 2021. La presse mainstream américaine a largement sous-couvert le sujet jusqu'au débat du 27 juin 2024. Le rapport Hur décrivait un homme aux souvenirs défaillants.",
    consensus: [
      "73% des Américains exprimaient des inquiétudes cognitives dès 2023 (Pew Research)",
      "Le rapport Hur de février 2024 documentait des défaillances mémorielles",
      "Le débat du 27 juin 2024 a rendu la question impossible à ignorer",
      "Biden a annoncé son retrait le 21 juillet 2024"
    ],
    contradictions: [
      "NYT et WashPost : signes minimisés ou qualifiés d'hystérie républicaine avant juin 2024",
      "Axios et Politico avaient publié des témoignages de proches dès 2022, sans suite éditoriale",
      "La Maison Blanche a activement nié les rapports d'incapacité jusqu'au débat",
      "Plusieurs journalistes admettent avoir exercé une autocensure par crainte d'aider Trump"
    ],
    coverage_index: 28,
    missing_sources: ["MSNBC", "CNN Politics", "Politico Playbook"],
    historical_context: "Le cas Biden illustre un phénomène documenté de capture éditoriale — quand la proximité idéologique entre une rédaction et un sujet politique produit des angles morts systématiques. Le New Yorker a publié une autocritique explicite en août 2024.",
    results: [
      { source: { id: "nytimes", name: "New York Times", abbr: "NYT", type: "Média", bias: "Centre-gauche" }, position: "Couverture tardive", details: "A minimisé les signaux cognitifs jusqu'au débat. Autocritique publiée en juillet 2024.", reliability: "veille" },
      { source: { id: "washingtonpost", name: "Washington Post", abbr: "WP", type: "Média", bias: "Centre-gauche" }, position: "Omission documentée", details: "Sources internes citées par le Columbia Journalism Review évoquent des pressions éditoriales.", reliability: "veille" },
      { source: { id: "reuters", name: "Reuters", abbr: "REU", type: "Agence", bias: "Neutre" }, position: "Faits documentés", details: "A relayé les sondages et le rapport Hur sans prise de position éditoriale.", reliability: "verifie" },
    ]
  }
}

const EXAMPLES = [
  {
    query: "Origine du Covid-19 : laboratoire ou marché ?",
    date: "Janvier 2021",
    context: "La thèse d'une fuite de laboratoire à Wuhan, longtemps écartée, revient au cœur du débat. Les agences de renseignement américaines sont divisées. La Chine bloque les enquêtes indépendantes. Qu'est-ce que les sources scientifiques et les documents déclassifiés disent vraiment ?"
  },
  {
    query: "Droits de douane Trump 2025 : récession ou relance ?",
    date: "Avril 2025",
    context: "L'administration Trump impose des droits de douane massifs sur les importations chinoises et européennes. Les économistes sont divisés : choc inflationniste pour les uns, protection industrielle légitime pour les autres. Que disent réellement les données et les modèles économiques indépendants ?"
  },
]

type SourceResult = {
  source: typeof SOURCES[0]
  position: string
  confidence: 'haute' | 'moyenne' | 'faible'
  details: string
  url?: string
  published_date?: string
}

function isValidHttpUrl(s: unknown): s is string {
  if (typeof s !== 'string' || !s) return false
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function formatRelativeDate(input?: string): string | null {
  if (!input || typeof input !== 'string') return null
  const s = input.trim()
  if (!s) return null
  if (/^\d{4}$/.test(s)) return `en ${s}`
  const ym = s.match(/^(\d{4})-(\d{2})$/)
  if (ym) {
    const monthName = new Date(Number(ym[1]), Number(ym[2]) - 1, 1)
      .toLocaleDateString('fr-FR', { month: 'long' })
    return `en ${monthName} ${ym[1]}`
  }
  const date = new Date(s)
  if (isNaN(date.getTime())) return null
  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.round(diffMs / 86_400_000)
  const absDays = Math.abs(diffDays)
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
  if (absDays < 7) return rtf.format(diffDays, 'day')
  if (absDays < 30) return rtf.format(Math.round(diffDays / 7), 'week')
  if (absDays < 365) return rtf.format(Math.round(diffDays / 30), 'month')
  return `en ${date.getFullYear()}`
}

function sourceHost(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
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
  coverage_index: number
  missing_sources: string[]
  historical_context: string
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
  const [quota, setQuota] = useState<{ used: number; remaining: number; limit: number; isAdmin: boolean; extraCredits: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const LOADING_MSGS = [
    'Interrogation des sources…',
    'Croisement des données…',
    'Identification des contradictions…',
    'Synthèse en cours…',
  ]

  useEffect(() => {
    try {
      const saved = localStorage.getItem('soara_recoupement_history')
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  // Fetch quota au chargement (silencieux si pas connecté / pas abonné)
  const refreshQuota = async () => {
    try {
      const res = await fetch('/api/recoupement/quota', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setQuota(data)
      }
    } catch {}
  }

  useEffect(() => {
    if (isPremium) refreshQuota()
  }, [isPremium])

  // Retour de Stripe après achat pack
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('pack_success') === '1') {
      // Polling léger : Stripe met quelques secondes à appeler le webhook
      let attempts = 0
      const interval = setInterval(() => {
        refreshQuota()
        attempts++
        if (attempts >= 5) clearInterval(interval)
      }, 1500)
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/recoupement')
    }
  }, [])

  const saveToHistory = (a: Analysis) => {
    try {
      const updated = [a, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem('soara_recoupement_history', JSON.stringify(updated))
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
      const response = await fetch('/api/recoupement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })

      // Cas quota / auth / abonnement : message clair
      if (response.status === 429) {
        const data = await response.json().catch(() => ({}))
        if (data.quota) setQuota(q => q ? { ...q, ...data.quota } : null)
        setError('quota')
        return
      }
      if (response.status === 401) { setError('auth'); return }
      if (response.status === 403) { setError('subscription'); return }

      // Erreur serveur / API Anthropic — rien n'a été débité
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (data.quota) setQuota(q => q ? { ...q, ...data.quota } : null)
        setError('retry_free')
        return
      }

      const data = await response.json()
      if (data.quota) {
        setQuota(q => q ? { ...q, ...data.quota } : { extraCredits: 0, isAdmin: false, ...data.quota })
      }

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
          || { id: r.sourceId, name: r.sourceId || '??', type: '', bias: '', abbr: (r.sourceId || '??').slice(0, 2).toUpperCase(), niveau: 'verifie' }
        return {
          source,
          position: r.position,
          confidence: r.confidence,
          details: r.details,
          url: isValidHttpUrl(r.url) ? r.url : undefined,
          published_date: typeof r.published_date === 'string' && r.published_date.trim() ? r.published_date.trim() : undefined,
        }
      }).filter((r: any) => r.position)

      const finalAnalysis: Analysis = {
        topic: parsed.topic || searchQuery,
        consensus: parsed.consensus || [],
        contradictions: parsed.contradictions || [],
        synthesis: parsed.synthesis || '',
        coverage_index: parsed.coverage_index || 0,
        missing_sources: parsed.missing_sources || [],
        historical_context: parsed.historical_context || '',
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
          <div className={styles.heroTag}>Soara · Outil éditorial</div>
          <h1 className={styles.heroTitle}>Recoupement de <em>sources</em></h1>
          <p className={styles.heroSub}>L'information telle qu'elle est. Pas telle qu'on vous la raconte.</p>
        </div>

        {/* USE CASES */}
        <div style={{ maxWidth: '720px', margin: '0 auto 48px', padding: '48px 24px 0' }}>
          <p style={{ fontSize: '13px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8860B', marginBottom: '24px' }}>
            Comment ça fonctionne
          </p>

                    {/* Exemples avec vrai rendu abonné */}
          {(['covid', 'biden'] as const).map((key) => {
            const mock = MOCK_ANALYSES[key]
            const score = Math.round(mock.results.filter((r: any) => r.reliability === 'verifie').length / mock.results.length * 100)
            return (
          <div key={key} className={styles.results} style={{ marginBottom: '32px', opacity: 1 }}>
            <div style={{ background: '#F7F4EF', padding: '10px 20px', marginBottom: '16px', borderBottom: '1px solid #DDD9D2' }}>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8a7f72' }}>{mock.date} · Exemple de recoupement</span>
            </div>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsRule} />
              <div className={styles.resultsMeta}>
                <span className={styles.resultsTopic}>{mock.topic}</span>
                <span className={styles.resultsDate}>{mock.date}</span>
              </div>
            </div>
            <div className={styles.scoreBlock}>
              <div className={styles.scoreLabel}>Indice de fiabilité</div>
              <div className={styles.scoreBar}><div className={styles.scoreFill} style={{ width: `${mock.coverage_index}%` }} /></div>
              <div className={styles.scoreValue}>{mock.coverage_index}%</div>
              <div className={styles.scoreNote}>Couverture partielle — angle mort documenté</div>
            </div>
            <div className={styles.synthesis}>
              <div className={styles.synthLabel}>Synthèse</div>
              <p className={styles.synthText}>{mock.synthesis}</p>
            </div>
            <div className={styles.dualBlock}>
              <div className={styles.consensusCol}>
                <div className={styles.colLabel} data-type="consensus">Points de consensus</div>
                <div className={styles.colItems}>{mock.consensus.map((item: string, i: number) => (
                  <div key={i} className={styles.consensusItem}><span className={styles.dot} data-type="consensus" /><span>{item}</span></div>
                ))}</div>
              </div>
              <div className={styles.contraCol}>
                <div className={styles.colLabel} data-type="contra">Contradictions</div>
                <div className={styles.colItems}>{mock.contradictions.map((item: string, i: number) => (
                  <div key={i} className={styles.contradictionItem}><span className={styles.dot} data-type="contra" /><span>{item}</span></div>
                ))}</div>
              </div>
            </div>
            <div className={styles.coverageBlock}>
              <div className={styles.coverageRow}>
                <div className={styles.coverageItem}>
                  <div className={styles.coverageLabel}>Indice de couverture</div>
                  <div className={styles.coverageBar}><div className={styles.coverageFill} style={{ width: `${mock.coverage_index}%` }} /></div>
                  <div className={styles.coverageValue}>{mock.coverage_index}%</div>
                  <div className={styles.coverageNote}>Couverture partielle — angle mort possible</div>
                </div>
                <div className={styles.missingItem}>
                  <div className={styles.coverageLabel}>Sources silencieuses</div>
                  <div className={styles.missingNote}>Ces sources n'ont pas couvert ce fait</div>
                  <div className={styles.missingList}>{mock.missing_sources.map((s: string, i: number) => (
                    <span key={i} className={styles.missingTag}>{s}</span>
                  ))}</div>
                </div>
              </div>
              <div className={styles.historicalBlock}>
                <div className={styles.coverageLabel}>Contexte historique</div>
                <p className={styles.historicalText}>{mock.historical_context}</p>
              </div>
            </div>
          </div>
            )
          })}

          {/* Sources cachées — juste le chiffre */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.1em', color: '#8a7f72' }}>
              {SOURCES.length} sources · Médias indépendants · Agences · OSINT · Think tanks
            </p>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px solid #DDD9D2' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 400, color: '#1a1a1a', marginBottom: '10px' }}>
              Fonctionnalité réservée aux abonnés
            </div>
            <p style={{ fontSize: '14px', color: '#6B6355', marginBottom: '28px', lineHeight: '1.65' }}>
              Accédez au recoupement en temps réel sur n'importe quel sujet géopolitique.
            </p>
            <a href="/abonnement" style={{
              display: 'inline-block', padding: '14px 36px',
              background: '#1a1a1a', color: '#F5F0E8',
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', textDecoration: 'none',
              marginBottom: '16px'
            }}>S'abonner →</a>
            <br />
            <a href="/connexion" style={{ fontSize: '12px', color: '#8a7f72', textDecoration: 'none' }}>
              Déjà abonné ? Se connecter
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.heroWrap}>
        <div className={styles.heroTag}>Soara · Outil éditorial</div>
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
            disabled={loading || !query.trim() || (quota !== null && !quota.isAdmin && (quota.remaining + quota.extraCredits) <= 0)}
          >
            {loading ? <span className={styles.btnSpinner} /> : 'Analyser →'}
          </button>
        </div>

        {quota && (
          <div style={{
            marginTop: '14px',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            color: quota.isAdmin ? '#8a7f72' : (quota.remaining + quota.extraCredits) === 0 ? '#C04040' : (quota.remaining + quota.extraCredits) <= 2 ? '#B8860B' : '#8a7f72',
          }}>
            {quota.isAdmin ? `Accès illimité (admin)` : (() => {
              const total = quota.remaining + quota.extraCredits
              if (total === 0) return `Quota mensuel atteint · Réinitialisation le 1er du mois prochain`
              if (quota.extraCredits > 0 && quota.remaining === 0) {
                return `${quota.extraCredits} recoupement${quota.extraCredits > 1 ? 's' : ''} (pack acheté) · Mensuel épuisé`
              }
              if (quota.extraCredits > 0) {
                return `${quota.remaining} ce mois + ${quota.extraCredits} pack · ${quota.used}/${quota.limit} consommés`
              }
              return `${quota.remaining} recoupement${quota.remaining > 1 ? 's' : ''} restant${quota.remaining > 1 ? 's' : ''} ce mois-ci · ${quota.used}/${quota.limit}`
            })()}
          </div>
        )}

        {quota && !quota.isAdmin && quota.remaining === 0 && quota.extraCredits === 0 && (
          <div style={{
            marginTop: '18px',
            padding: '20px 24px',
            border: '1px solid #DDD9D2',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#1a1a1a', marginBottom: '6px' }}>
              Besoin de plus ?
            </div>
            <p style={{ fontSize: '13px', color: '#6B6355', marginBottom: '16px', lineHeight: '1.5' }}>
              Continuez ce mois-ci avec un pack de 10 recoupements supplémentaires.
            </p>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/recoupement/buy-pack', { method: 'POST' })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                } catch {}
              }}
              style={{
                display: 'inline-block', padding: '12px 28px',
                background: '#1a1a1a', color: '#F5F0E8', border: 'none',
                fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>
              10 recoupements — 3,99 €
            </button>
          </div>
        )}

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
              Attendez quelques instants puis relancez. Aucun crédit n'a été consommé.
            </p>
            <button className={styles.retryBtn} onClick={() => { setError(''); handleSearch() }}>
              Relancer l'analyse →
            </button>
          </div>
        )}

        {error === 'retry_free' && (
          <div className={styles.retryBlock}>
            <div className={styles.retryTitle}>L'analyse n'a pas abouti</div>
            <p className={styles.retryText}>
              La réponse était incomplète ou le service a été coupé. <strong>Aucun crédit n'a été consommé</strong>, vous pouvez relancer.
            </p>
            <button className={styles.retryBtn} onClick={() => { setError(''); handleSearch() }}>
              Relancer l'analyse →
            </button>
          </div>
        )}

        {error === 'quota' && (
          <div className={styles.retryBlock}>
            <div className={styles.retryTitle}>Quota mensuel atteint</div>
            <p className={styles.retryText}>
              Vous avez utilisé vos {quota?.limit ?? 10} recoupements de ce mois-ci.
              Réinitialisation le 1<sup>er</sup> du mois prochain.
            </p>
            <button
              className={styles.retryBtn}
              onClick={async () => {
                try {
                  const res = await fetch('/api/recoupement/buy-pack', { method: 'POST' })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                } catch {}
              }}>
              Acheter 10 recoupements — 3,99 €
            </button>
          </div>
        )}

        {error === 'subscription' && (
          <div className={styles.retryBlock}>
            <div className={styles.retryTitle}>Abonnement requis</div>
            <p className={styles.retryText}>
              Le Recoupement est réservé aux abonnés Soara.
            </p>
            <a href="/abonnement" className={styles.retryBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
              Voir l'abonnement →
            </a>
          </div>
        )}

        {error === 'auth' && (
          <div className={styles.retryBlock}>
            <div className={styles.retryTitle}>Connexion requise</div>
            <p className={styles.retryText}>Reconnectez-vous pour continuer.</p>
            <a href="/connexion" className={styles.retryBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
              Se connecter →
            </a>
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

          {/* COVERAGE INDEX */}
          <div className={styles.coverageBlock}>
            <div className={styles.coverageRow}>
              <div className={styles.coverageItem}>
                <div className={styles.coverageLabel}>Indice de couverture</div>
                <div className={styles.coverageBar}>
                  <div className={styles.coverageFill} style={{ width: `${analysis.coverage_index}%` }} />
                </div>
                <div className={styles.coverageValue}>{analysis.coverage_index}%</div>
                <div className={styles.coverageNote}>
                  {analysis.coverage_index >= 70 ? 'Fait largement couvert par les médias de référence' :
                   analysis.coverage_index >= 40 ? 'Couverture partielle — angle mort possible' :
                   'Faiblement couvert — sujet sous-médiatisé'}
                </div>
              </div>

              {analysis.missing_sources.length > 0 && (
                <div className={styles.missingItem}>
                  <div className={styles.coverageLabel}>Sources silencieuses</div>
                  <div className={styles.missingNote}>Ces sources n'ont pas couvert ce fait — l'omission est aussi une information</div>
                  <div className={styles.missingList}>
                    {analysis.missing_sources.map((s, i) => (
                      <span key={i} className={styles.missingTag}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {analysis.historical_context && (
              <div className={styles.historicalBlock}>
                <div className={styles.coverageLabel}>Contexte historique</div>
                <p className={styles.historicalText}>{analysis.historical_context}</p>
              </div>
            )}
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
                              {(r.published_date || (r.url && isValidHttpUrl(r.url))) && (
                                <div className={styles.narrativeMetaLine}>
                                  {r.published_date && formatRelativeDate(r.published_date) && (
                                    <span>{formatRelativeDate(r.published_date)}</span>
                                  )}
                                  {r.published_date && r.url && isValidHttpUrl(r.url) && (
                                    <span className={styles.cardMetaSep}>·</span>
                                  )}
                                  {r.url && isValidHttpUrl(r.url) && (
                                    <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.cardMetaLink}>
                                      {sourceHost(r.url)} ↗
                                    </a>
                                  )}
                                </div>
                              )}
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
                    {(r.published_date || (r.url && isValidHttpUrl(r.url))) && (
                      <div className={styles.cardMetaLine}>
                        {r.published_date && formatRelativeDate(r.published_date) && (
                          <span>{formatRelativeDate(r.published_date)}</span>
                        )}
                        {r.published_date && r.url && isValidHttpUrl(r.url) && (
                          <span className={styles.cardMetaSep}>·</span>
                        )}
                        {r.url && isValidHttpUrl(r.url) && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className={styles.cardMetaLink}>
                            {sourceHost(r.url)} ↗
                          </a>
                        )}
                      </div>
                    )}
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
