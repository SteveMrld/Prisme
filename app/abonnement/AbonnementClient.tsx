'use client'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './abonnement.module.css'

const PREVIEWS = [
  { cat: 'Grand format', title: 'La chambre de ratification', desc: 'Comment Netanyahu a décidé une guerre américaine.', img: '/grands-formats/chambre-hero.jpg' },
  { cat: 'Grand format', title: "L'eau : la prochaine grande fracture", desc: "Des glaciers himalayens aux barrages africains. La géopolitique de l'eau.", img: '/articles/img-eau.png' },
  { cat: 'Atlas', title: 'La bataille pour le sous-sol numérique', desc: "Des mines de terres rares aux fabs de Taïwan : la guerre souterraine.", img: '/articles/img-techgeo.jpg' },
]

// Ordre : differenciants en premier, communs ensuite.
const FEATURES = [
  "Accès illimité aux grands formats et dossiers",
  "Recoupement de sources, 10 analyses IA par mois",
  "Atlas · cartes et visualisations interactives",
  "Grand Entretien en avant-première",
  "Signal quotidien · l'actualité qui compte",
  "Soara TV · 6 épisodes documentaires",
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
    const t = setInterval(() => setActivePreview(p => (p + 1) % PREVIEWS.length), 4000)
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

  const p = PREVIEWS[activePreview]

  return (
    <>
      <Header />

      {message && <div className={styles.banner}>{message}</div>}

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>

          {/* Gauche — texte + CTA */}
          <div className={styles.heroLeft}>
            <div className={styles.eyebrow}>Soara · Abonnement</div>
            <h1 className={styles.title}>L&apos;analyse<br /><em>sans compromis</em></h1>
            <p className={styles.subtitle}>
              Géopolitique, économie, technologie. Des formats longs, sourcés, sans algorithme.
              Pour les lecteurs qui trouvent que l&apos;analyse rigoureuse vaut quelque chose.
            </p>

            {/* Plans côte à côte */}
            <div className={styles.plans}>
              {/* Annuel — recommandé */}
              <div className={`${styles.planCard} ${styles.planCardFeatured}`}>
                <div className={styles.planBadge}>2 mois offerts</div>
                <div className={styles.planLabel}>Annuel</div>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>99</span>
                  <span className={styles.planCurrency}>€ / an</span>
                </div>
                <div className={styles.planSub}>Soit 8,25 € / mois</div>
                <div className={styles.planPerk}>
                  <span className={styles.planPerkDot} aria-hidden>✦</span>
                  Inclut l&apos;édition imprimée
                </div>
                <button className={`${styles.planBtn} ${styles.planBtnPrimary}`}
                  onClick={() => subscribe('yearly')} disabled={loading !== null}>
                  {loading === 'yearly' ? 'Chargement…' : "S'abonner, offre recommandée"}
                </button>
              </div>

              {/* Mensuel */}
              <div className={styles.planCard}>
                <div className={styles.planLabel}>Mensuel</div>
                <div className={styles.planPrice}>
                  <span className={styles.planAmount}>9,99</span>
                  <span className={styles.planCurrency}>€ / mois</span>
                </div>
                <div className={styles.planSub}>Sans engagement</div>
                <button className={styles.planBtn}
                  onClick={() => subscribe('monthly')} disabled={loading !== null}>
                  {loading === 'monthly' ? 'Chargement…' : 'Choisir'}
                </button>
              </div>
            </div>

            <p className={styles.heroNote}>Sans engagement · Résiliable à tout moment · Paiement sécurisé Stripe</p>
          </div>

          {/* Droite — aperçu contenu */}
          <div className={styles.heroRight}>
            <div className={styles.previewLabel}>Inclus dans votre abonnement</div>
            <div className={styles.previewCard}>
              <div className={styles.previewImg} style={{ backgroundImage: `url(${p.img})` }} />
              <div className={styles.previewBody}>
                <span className={styles.previewCat}>{p.cat}</span>
                <div className={styles.previewTitle}>{p.title}</div>
                <p className={styles.previewDesc}>{p.desc}</p>
              </div>
            </div>
            <div className={styles.previewDots}>
              {PREVIEWS.map((_, i) => (
                <button key={i} className={`${styles.dot} ${i === activePreview ? styles.dotActive : ''}`}
                  onClick={() => setActivePreview(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CE QUE VOUS OBTENEZ ── */}
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

      {/* ── ÉDITION IMPRIMÉE (bonus annuel) ── */}
      <div className={styles.printSection}>
        <div className={styles.printInner}>
          <div className={styles.printMock} aria-hidden>
            <div className={styles.printMockEyebrow}>Soara · Édition n°1</div>
            <div className={styles.printMockSep} />
            <div className={styles.printMockTitle}>L&apos;ordre<br/><em>qui vient</em></div>
            <div className={styles.printMockFooter}>Automne 2026 · 80 pages</div>
          </div>
          <div className={styles.printBody}>
            <div className={styles.printEyebrow}>L&apos;édition imprimée</div>
            <h2 className={styles.printTitle}>L&apos;ordre <em>qui vient</em></h2>
            <p className={styles.printDesc}>
              Tous les six mois, une édition papier de 80 pages qui réunit les grands formats,
              les portraits, et les essais de la saison. Imprimée en France, envoyée chez vous.
            </p>
            <div className={styles.printNote}>Incluse dans l&apos;abonnement annuel · premier numéro à l&apos;automne 2026</div>
          </div>
        </div>
      </div>

      {/* ── RÉASSURANCE ── */}
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
