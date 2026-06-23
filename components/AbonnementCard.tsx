import Link from 'next/link'
import styles from './AbonnementCard.module.css'

// Encart d'abonnement pour la colonne latérale d'article (desktop). Reprend le
// langage et le prix des CTA existants pour rester cohérent. Statique (pas de
// client), simple rappel cliquable vers la page d'offre.
export default function AbonnementCard() {
  return (
    <aside className={`${styles.card} no-print`} aria-label="Abonnement Soara">
      <div className={styles.eyebrow}>L&rsquo;abonnement</div>
      <h3 className={styles.title}>
        Lisez tout <em>Soara</em>
      </h3>
      <p className={styles.desc}>
        Tous les grands formats, les données exclusives et les archives. Sans
        publicité, sans algorithme.
      </p>
      <div className={styles.price}>
        dès 9,99&nbsp;€ <span className={styles.per}>/ mois</span>
      </div>
      <Link href="/abonnement" className={styles.cta}>
        S&rsquo;abonner
      </Link>
      <Link href="/connexion" className={styles.login}>
        Déjà abonné&nbsp;? Se connecter
      </Link>
    </aside>
  )
}
