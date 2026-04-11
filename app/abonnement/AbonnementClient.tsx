'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './abonnement.module.css'

const PREVIEWS = [
  { cat: 'Grand format', title: 'La chambre de ratification', desc: 'Comment Netanyahu a décidé une guerre américaine.', img: '/grands-formats/chambre-hero.jpg' },
  { cat: 'Portrait', title: 'Cheick Modibo Diarra', desc: 'Astrophysicien, ancien Premier ministre du Mali. L'entretien inaugural.', img: '/portraits/diarra.png' },
  { cat: 'Grand format', title: 'La fabrique de l'impossible', desc: 'Skunk Works — le laboratoire secret qui a changé l'aviation.', img: '/grands-formats/skunkworks/hangar-1943.png' },
  { cat: 'Atlas', title: 'Les mers du pouvoir', desc: '80% du commerce mondial circule sur l'eau. Carte animée en 5 chapitres.', img: '/portraits/obama.png' },
]

const FEATURES = [
  'Accès illimité aux grands formats (10–20 min)',
  'Signal quotidien — l'actualité qui compte',
  'Recoupement de sources — 44 sources en temps réel',
  'Grand Entretien en avant-première',
  'Atlas · Cartes & visualisations interactives',
  'Soara TV · 6 épisodes disponibles',
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
  const [activePreview, setActivePreview] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const t = setInterval(() => setActivePreview(p => (p + 1) % PREVIEWS.length), 3500)
    return () => clearInterval(t)
  }, [])

  async function subscribe(plan: 'monthly' | 'yearly') {
    if (!user) { router.push('/connexion?redirect=/abonnement'); return }
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

      {/* HERO — aperçu contenu */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>Soara · Abonnement</span>
            <h1 className={styles.title}>L&apos;analyse <em>sans compromis</em></h1>
            <p className={styles.subtitle}>
              Géopolitique, économie, technologie. Des formats longs, sourcés, sans algorithme.
              Seulement de lecteurs qui trouvent que l&apos;analyse rigoureuse vaut quelque chose.
            </p>
            <div className={styles.heroCta}>
              <button className={styles.heroBtn} onClick={() => subscribe('yearly')} disabled={loading !== null}>
                {loading === 'yearly' ? 'Chargement…' : 'S'abonner — 99€ / an'}
              </button>
              <span className={styles.heroOr}>ou</span>
              <button className={styles.heroMonthly} onClick={() => subscribe('monthly')} disabled={loading !== null}>
                {loading === 'monthly' ? 'Chargement…' : '9,99€ / mois'}
              </button>
            </div>
            <p className={styles.heroNote}>Sans engagement · Résiliable à tout moment · Paiement sécurisé Stripe</p>
          </div>

          {/* Carrousel aperçu */}
          <div className={styles.heroRight}>
            {PREVIEWS.map((p, i) => (
              <div key={i} className={`${styles.previewCard} ${i === activePreview ? styles.previewActive : ''}`}
                onClick={() => setActivePreview(i)}>
                <div className={styles.previewImg} style={{ backgroundImage: `url(${p.img})` }} />
                <div className={styles.previewBody}>
                  <span className={styles.previewCat}>{p.cat}</span>
                  <div className={styles.previewTitle}>{p.title}</div>
                  <p className={styles.previewDesc}>{p.desc}</p>
                </div>
              </div>
            ))}
            <div className={styles.previewDots}>
              {PREVIEWS.map((_, i) => (
                <button key={i} className={`${styles.dot} ${i === activePreview ? styles.dotActive : ''}`}
                  onClick={() => setActivePreview(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {message && <div className={styles.banner}>{message}</div>}

      {/* CE QUE VOUS OBTENEZ */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresLabel}>Ce que vous obtenez</div>
        <div className={styles.featuresGrid}>
          {FEATURES.map(f => (
            <div key={f} className={styles.featureItem}>
              <span className={styles.featureCheck}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PLANS */}
      <div className={styles.plansSection}>
        <div className={styles.plansGrid}>
          <div className={styles.planCard}>
            <div className={styles.planLabel}>Mensuel</div>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{plans.monthly.amount}</span>
              <span className={styles.planCurrency}>€ / mois</span>
            </div>
            <p className={styles.planDesc}>Sans engagement. Résiliable à tout moment.</p>
            <button className={styles.planBtn} onClick={() => subscribe('monthly')} disabled={loading !== null}>
              {loading === 'monthly' ? 'Chargement…' : 'Choisir'}
            </button>
          </div>

          <div className={`${styles.planCard} ${styles.planCardFeatured}`}>
            <div className={styles.planBadge}>2 mois offerts</div>
            <div className={styles.planLabel}>Annuel</div>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>{plans.yearly.amount}</span>
              <span className={styles.planCurrency}>€ / an</span>
            </div>
            <p className={styles.planDesc}>Soit 8,25 € / mois. La formule la plus économique.</p>
            <button className={`${styles.planBtn} ${styles.planBtnPrimary}`} onClick={() => subscribe('yearly')} disabled={loading !== null}>
              {loading === 'yearly' ? 'Chargement…' : 'Choisir — offre recommandée'}
            </button>
          </div>
        </div>
      </div>

      {/* RÉASSURANCE */}
      <div className={styles.reassurance}>
        {[
          { title: 'Indépendance totale', text: 'Aucun annonceur. Aucun actionnaire. Votre abonnement est la seule source de revenus de Soara.' },
          { title: 'Résiliation libre', text: 'Résiliable à tout moment depuis votre espace abonné, sans frais ni préavis.' },
          { title: 'Paiement sécurisé', text: 'Paiements traités par Stripe. Soara ne stocke aucune donnée bancaire.' },
        ].map(r => (
          <div key={r.title} className={styles.reassuranceItem}>
            <div className={styles.reassuranceTitle}>{r.title}</div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/mentions">Mentions légales</Link>
          <Link href="/connexion">Déjà abonné ? Se connecter</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d&apos;analyse indépendant</div>
      </footer>
    </>
  )
}
