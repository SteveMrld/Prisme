'use client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '../../../lib/supabase'
import AdminNav from '../../../components/AdminNav'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import styles from './audience.module.css'

const PERIODS = [
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: '6mo', label: '6 mois' },
  { id: '12mo', label: '12 mois' },
]

function fmtNumber(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-FR').format(n)
}

function fmtDuration(seconds: number | null | undefined) {
  if (seconds == null) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m === 0) return `${s}s`
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

function fmtPercent(n: number | null | undefined) {
  if (n == null) return '—'
  return `${Math.round(n)}%`
}

export default function AdminAudienceClient() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [data, setData] = useState<any>(null)
  const [state, setState] = useState('idle')

  const load = useCallback(async (p: string) => {
    setState('loading')
    try {
      const res = await fetch(`/api/admin/audience?period=${p}`)
      const json = await res.json()
      if (json.configured === false) {
        setState('unconfigured')
        return
      }
      if (json.error) {
        setState('error')
        return
      }
      setData(json)
      setState('ready')
    } catch (e) {
      setState('error')
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === 'steve.moradel@gmail.com') {
        setAuthorized(true)
        load(period)
      }
      setLoading(false)
    })
  }, [load, period])

  function changePeriod(p: string) {
    setPeriod(p)
    if (authorized) load(p)
  }

  if (loading) return <div className={styles.center}>Chargement…</div>
  if (!authorized) return <div className={styles.center}>Accès refusé.</div>

  const agg = data?.aggregate || {}
  const series = (data?.timeseries || []).map((r: any) => ({
    date: r.date,
    visiteurs: r.visitors,
    pages: r.pageviews,
  }))

  return (
    <div className={styles.wrapper}>
      <AdminNav active="audience" />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>Console</div>
          <h1 className={styles.title}>Audience</h1>
          <p className={styles.subtitle}>
            Fréquentation du site, sans cookie de pistage. Données Plausible, à présenter en l&apos;état aux régies ou annonceurs.
          </p>
        </header>

        <div className={styles.periods}>
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => changePeriod(p.id)}
              className={period === p.id ? `${styles.period} ${styles.periodActive}` : styles.period}
            >
              {p.label}
            </button>
          ))}
        </div>

        {state === 'unconfigured' && (
          <div className={styles.notice}>
            <h2>Mesure non encore branchée</h2>
            <p>
              Le tableau de bord est prêt mais attend la source de données. Crée un compte Plausible,
              ajoute le domaine soara.fr, génère une clé API, puis renseigne les variables
              <code>PLAUSIBLE_API_KEY</code> et <code>PLAUSIBLE_SITE_ID</code> dans Vercel. Les chiffres
              apparaîtront ensuite automatiquement ici.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className={styles.notice}>
            <h2>Données indisponibles</h2>
            <p>La requête vers Plausible a échoué. Vérifie la clé API et le nom du site dans Vercel.</p>
          </div>
        )}

        {state === 'loading' && <div className={styles.loadingBlock}>Chargement des chiffres…</div>}

        {state === 'ready' && (
          <>
            <section className={styles.kpis}>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Visiteurs uniques</div>
                <div className={styles.kpiValue}>{fmtNumber(agg.visitors?.value)}</div>
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Pages vues</div>
                <div className={styles.kpiValue}>{fmtNumber(agg.pageviews?.value)}</div>
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Durée moyenne</div>
                <div className={styles.kpiValue}>{fmtDuration(agg.visit_duration?.value)}</div>
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Taux de rebond</div>
                <div className={styles.kpiValue}>{fmtPercent(agg.bounce_rate?.value)}</div>
              </div>
            </section>

            <section className={styles.chartCard}>
              <div className={styles.cardTitle}>Trafic</div>
              <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke="#222" vertical={false} />
                    <XAxis dataKey="date" stroke="#6B6B6B" tick={{ fontSize: 11 }} tickMargin={8} minTickGap={28} />
                    <YAxis stroke="#6B6B6B" tick={{ fontSize: 11 }} width={44} />
                    <Tooltip
                      contentStyle={{ background: '#161616', border: '1px solid #2A2A2A', fontSize: 12, color: '#FAFAF8' }}
                      labelStyle={{ color: '#9A9590' }}
                    />
                    <Line type="monotone" dataKey="visiteurs" stroke="#C2410C" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="pages" stroke="#6B6B6B" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className={styles.tables}>
              <div className={styles.tableCard}>
                <div className={styles.cardTitle}>Articles les plus lus</div>
                <ul className={styles.list}>
                  {(data.pages || []).map((r: any, i: number) => (
                    <li key={i} className={styles.row}>
                      <span className={styles.rowLabel}>{r.page}</span>
                      <span className={styles.rowValue}>{fmtNumber(r.pageviews)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.cardTitle}>Sources de trafic</div>
                <ul className={styles.list}>
                  {(data.sources || []).map((r: any, i: number) => (
                    <li key={i} className={styles.row}>
                      <span className={styles.rowLabel}>{r.source || 'Direct'}</span>
                      <span className={styles.rowValue}>{fmtNumber(r.visitors)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.cardTitle}>Appareils</div>
                <ul className={styles.list}>
                  {(data.devices || []).map((r: any, i: number) => (
                    <li key={i} className={styles.row}>
                      <span className={styles.rowLabel}>{r.device}</span>
                      <span className={styles.rowValue}>{fmtNumber(r.visitors)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.tableCard}>
                <div className={styles.cardTitle}>Pays</div>
                <ul className={styles.list}>
                  {(data.countries || []).map((r: any, i: number) => (
                    <li key={i} className={styles.row}>
                      <span className={styles.rowLabel}>{r.country}</span>
                      <span className={styles.rowValue}>{fmtNumber(r.visitors)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
