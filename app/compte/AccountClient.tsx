'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './compte.module.css'

interface Props {
  user: { email: string; id: string }
  profile: any
  isActive: boolean
  isPastDue: boolean
  successMessage: boolean
}

export default function AccountClient({ user, profile, isActive, isPastDue, successMessage }: Props) {
  const [portalLoading, setPortalLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function openPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const statusLabel = isActive ? 'Actif' : isPastDue ? 'Paiement en attente' : 'Inactif'
  const statusColor = isActive ? '#2D6B4A' : isPastDue ? '#B86A1A' : '#7A2D2D'

  return (
    <div className={styles.page}>

      {successMessage && (
        <div className={styles.successBanner}>
          Abonnement activé — bienvenue chez Prisme. Accès complet débloqué.
        </div>
      )}

      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>Mon compte</span>
            <h1 className={styles.title}>Espace <em>abonné</em></h1>
          </div>
          <button className={styles.signout} onClick={signOut}>Se déconnecter</button>
        </div>

        {/* Statut abonnement */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Abonnement</div>
          <div className={styles.statusCard}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Statut</span>
              <span className={styles.statusValue} style={{ color: statusColor }}>
                <span className={styles.statusDot} style={{ background: statusColor }} />
                {statusLabel}
              </span>
            </div>
            {profile?.subscription_end_date && (
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>
                  {isActive ? 'Prochain renouvellement' : 'Accès jusqu\'au'}
                </span>
                <span className={styles.statusValue}>
                  {new Date(profile.subscription_end_date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
            )}
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Email</span>
              <span className={styles.statusValue}>{user.email}</span>
            </div>
          </div>

          {isActive || isPastDue ? (
            <button
              className={styles.btn}
              onClick={openPortal}
              disabled={portalLoading}
            >
              {portalLoading ? 'Chargement…' : 'Gérer mon abonnement →'}
            </button>
          ) : (
            <Link href="/abonnement" className={styles.btnLink}>
              S'abonner →
            </Link>
          )}
        </div>

        {isPastDue && (
          <div className={styles.alertCard}>
            Un paiement est en attente. Mettez à jour votre moyen de paiement pour maintenir l'accès.
            <button className={styles.alertBtn} onClick={openPortal}>
              Mettre à jour →
            </button>
          </div>
        )}

        {/* Liens rapides */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Continuer à lire</div>
          <div className={styles.quickLinks}>
            {[
              { href: '/signal', label: 'Signal', desc: 'L\'actualité du jour' },
              { href: '/geo', label: 'Géopolitique', desc: 'Analyses de fond' },
              { href: '/tech', label: 'Technologie', desc: 'IA, semi-conducteurs, plateformes' },
              { href: '/culture', label: 'Culture', desc: 'Littérature, philosophie, arts' },
            ].map(l => (
              <Link key={l.href} href={l.href} className={styles.quickLink}>
                <span className={styles.quickLinkLabel}>{l.label}</span>
                <span className={styles.quickLinkDesc}>{l.desc}</span>
                <span className={styles.quickLinkArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Entretien */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Grand Entretien</div>
          <Link href="/entretien/diarra" className={styles.entretienCard}>
            <div className={styles.entretienEyebrow}>N°1 · À venir</div>
            <div className={styles.entretienName}>Cheick Modibo <em>Diarra</em></div>
            <div className={styles.entretienRole}>Astrophysicien NASA · Microsoft Afrique · Premier ministre du Mali</div>
            <span className={styles.entretienCta}>Lire en avant-première →</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
