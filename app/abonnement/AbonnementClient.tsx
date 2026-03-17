'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './abonnement.module.css'

const features = [
  'Accès illimité aux grands formats (10–20 min)',
  'Signal quotidien — l\'actualité qui compte',
  'Archives complètes depuis le lancement',
  'Grand Entretien en avant-première',
  'Visuels et infographies interactives',
  'Sans publicité, sans traceur tiers',
]

interface Plans {
  monthly: { priceId: string; amount: number; interval: string }
  yearly: { priceId: string; amount: number; interval: string }
}

export default function AbonnementClient({ plans, canceled }: { plans: Plans; canceled: boolean }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState<string | null>(canceled ? 'Abonnement annulé. Vous pouvez réessayer quand vous voulez.' : null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function subscribe(plan: 'monthly' | 'yearly') {
    if (!user) {
      router.push('/connexion?redirect=/abonnement')
      return
    }
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plans[plan].priceId, plan }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch {
      setMessage('Erreur lors de la redirection vers le paiement. Réessayez.')
      setLoading(null)
    }
  }

  return (
    <>
      <Header />

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Abonnement</span>
          <h1 className={styles.title}>L'analyse <em>sans compromis</em></h1>
          <p className={styles.subtitle}>
            Prisme ne dépend d'aucun actionnaire industriel, d'aucune régie publicitaire.
            Seulement de lecteurs qui trouvent que l'analyse rigoureuse vaut quelque chose.
          </p>
        </div>
      </div>

      {message && <div className={styles.banner}>{message}</div>}

      <div className={styles.content}>
        <div className={styles.features}>
          <div className={styles.featuresLabel}>Ce que vous obtenez</div>
          <ul className={styles.featuresList}>
            {features.map(f => (
              <li key={f} className={styles.featuresItem}>
                <span className={styles.featuresCheck}>—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.plans}>
          <div className={`${styles.plan} ${styles.planMonth}`}>
            <div className={styles.planLabel}>Mensuel</div>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{plans.monthly.amount}</span>
              <span className={styles.planCurrency}>€ / {plans.monthly.interval}</span>
            </div>
            <p className={styles.planDesc}>Sans engagement. Résiliable à tout moment.</p>
            <button
              className={styles.planBtn}
              onClick={() => subscribe('monthly')}
              disabled={loading !== null}
            >
              {loading === 'monthly' ? 'Chargement…' : 'Choisir ce plan'}
            </button>
          </div>

          <div className={`${styles.plan} ${styles.planYear}`}>
            <div className={styles.planBadge}>Recommandé</div>
            <div className={styles.planLabel}>Annuel</div>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{plans.yearly.amount}</span>
              <span className={styles.planCurrency}>€ / {plans.yearly.interval}</span>
            </div>
            <p className={styles.planDesc}>Soit 6 € / mois. Deux mois offerts.</p>
            <button
              className={`${styles.planBtn} ${styles.planBtnPrimary}`}
              onClick={() => subscribe('yearly')}
              disabled={loading !== null}
            >
              {loading === 'yearly' ? 'Chargement…' : 'Choisir ce plan'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.reassurance}>
        {[
          { title: 'Indépendance totale', text: 'Aucun annonceur. Aucun actionnaire. Votre abonnement est la seule source de revenus de Prisme.' },
          { title: 'Résiliation libre', text: 'Résiliable à tout moment depuis votre espace abonné, sans frais ni préavis.' },
          { title: 'Paiement sécurisé', text: 'Paiements traités par Stripe. Prisme ne stocke aucune donnée bancaire.' },
        ].map(r => (
          <div key={r.title} className={styles.reassuranceItem}>
            <div className={styles.reassuranceTitle}>{r.title}</div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
