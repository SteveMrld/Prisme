import Header from '../../components/Header'
import Link from 'next/link'
import styles from './abonnement.module.css'

export const metadata = {
  title: 'S\'abonner — Prisme',
  description: 'Accédez à l\'intégralité des analyses Prisme.',
}

const features = [
  'Accès illimité aux grands formats (10–20 min)',
  'Signal quotidien — l\'actualité qui compte',
  'Archives complètes depuis le lancement',
  'Grand Entretien en avant-première',
  'Visuels et infographies interactives',
  'Sans publicité, sans traceur tiers',
]

export default function AbonnementPage() {
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
              <span className={styles.planAmount}>8</span>
              <span className={styles.planCurrency}>€ / mois</span>
            </div>
            <p className={styles.planDesc}>Sans engagement. Résiliable à tout moment.</p>
            <button className={styles.planBtn}>Choisir ce plan</button>
          </div>

          <div className={`${styles.plan} ${styles.planYear}`}>
            <div className={styles.planBadge}>Recommandé</div>
            <div className={styles.planLabel}>Annuel</div>
            <div className={styles.planPrice}>
              <span className={styles.planAmount}>72</span>
              <span className={styles.planCurrency}>€ / an</span>
            </div>
            <p className={styles.planDesc}>Soit 6 € / mois. Deux mois offerts par rapport au mensuel.</p>
            <button className={`${styles.planBtn} ${styles.planBtnPrimary}`}>Choisir ce plan</button>
          </div>
        </div>
      </div>

      <div className={styles.reassurance}>
        <div className={styles.reassuranceItem}>
          <div className={styles.reassuranceTitle}>Indépendance totale</div>
          <p>Aucun annonceur. Aucun actionnaire. Aucune subvention conditionnée. Votre abonnement est la seule source de revenus de Prisme.</p>
        </div>
        <div className={styles.reassuranceItem}>
          <div className={styles.reassuranceTitle}>Résiliation libre</div>
          <p>Vous pouvez résilier à tout moment depuis votre espace abonné, sans frais ni délai de préavis.</p>
        </div>
        <div className={styles.reassuranceItem}>
          <div className={styles.reassuranceTitle}>Paiement sécurisé</div>
          <p>Les paiements sont traités par Stripe. Prisme ne stocke aucune donnée bancaire.</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
