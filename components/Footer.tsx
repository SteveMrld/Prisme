import Link from 'next/link'
import styles from './Footer.module.css'
import NewsletterForm from './NewsletterForm'
import { FleuronIcon } from './LettresIcons'

const rubriques = [
  { label: 'Signal', href: '/signal' },
  { label: 'Géopolitique', href: '/geo' },
  { label: 'Économie', href: '/eco' },
  { label: 'Tech', href: '/tech' },
  { label: 'Environnement', href: '/env' },
  { label: 'Société', href: '/soc' },
  { label: 'Culture', href: '/culture' },
  { label: 'Portraits', href: '/portraits' },
  { label: 'Indicateurs', href: '/indicateurs' },
]

const formats = [
  { label: 'Grands formats', href: '/grands-formats' },
  { label: 'La lettre du mardi', href: '/lettres' },
  { label: 'Atlas', href: '/visuels' },
  { label: 'Soara TV', href: '/tv' },
  { label: 'Rétrospective', href: '/retrospective' },
  { label: 'Lectures', href: '/lectures' },
  { label: 'Solutions', href: '/solutions' },
]

const apropos = [
  { label: 'Manifeste', href: '/apropos' },
  { label: 'Contributeurs', href: '/contributeurs' },
  { label: 'Recoupement', href: '/recoupement' },
  { label: 'Mentions légales', href: '/mentions' },
  { label: 'Politique de confidentialité', href: '/mentions' },
  { label: "Conditions d'utilisation", href: '/mentions' },
  { label: 'Contact', href: 'mailto:contact@soara.fr' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* a) Bandeau supérieur — logo + tagline */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Soara · accueil">
            So<em>ara</em>
          </Link>
          <p className={styles.tagline}>
            Média analytique indépendant.
          </p>
        </div>

        {/* b) Grille 4 colonnes */}
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.colTitle}>Rubriques</div>
            {rubriques.map(r => (
              <Link key={r.href} href={r.href} className={styles.link}>{r.label}</Link>
            ))}
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>Formats</div>
            {formats.map(f => (
              <Link key={f.label} href={f.href} className={styles.link}>{f.label}</Link>
            ))}
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>À propos</div>
            {apropos.map(a => (
              <Link key={a.label} href={a.href} className={styles.link}>{a.label}</Link>
            ))}
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>Suivre</div>
            <Link href="/lettres" className={styles.linkHi}>
              S&apos;inscrire à la lettre du mardi
            </Link>
            <Link href="/rss" className={styles.link}>RSS</Link>
            <a
              href="https://x.com/soaradotmedia"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </a>
            <a
              href="https://www.linkedin.com/company/soara"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/soaradotmedia"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* c) Bandeau newsletter */}
        <div className={styles.newsletter}>
          <div className={styles.nlEyebrow}>La lettre du mardi</div>
          <h3 className={styles.nlTitle}>L&apos;analyse qui manque à votre semaine</h3>
          <NewsletterForm />
          <Link href="/lettres" className={styles.nlArchive}>
            <FleuronIcon width={16} height={16} />
            <span>Lire les lettres →</span>
          </Link>
        </div>

        {/* d) Ligne mentions légales + copyright */}
        <div className={styles.legal}>
          © 2026 SOARA. Tous droits réservés. · Édition&nbsp;: Steve Moradel. · ISSN&nbsp;: à venir.
        </div>

        {/* e) Mini-liens bas */}
        <nav className={styles.miniLinks} aria-label="Liens légaux">
          <Link href="/mentions" className={styles.miniLink}>Mentions légales</Link>
          <span className={styles.miniDot} aria-hidden="true">·</span>
          <Link href="/mentions" className={styles.miniLink}>Confidentialité</Link>
          <span className={styles.miniDot} aria-hidden="true">·</span>
          <Link href="/mentions" className={styles.miniLink}>Cookies</Link>
          <span className={styles.miniDot} aria-hidden="true">·</span>
          <Link href="/mentions" className={styles.miniLink}>CGU</Link>
          <span className={styles.miniDot} aria-hidden="true">·</span>
          <a href="mailto:contact@soara.fr" className={styles.miniLink}>Contact</a>
        </nav>

      </div>
    </footer>
  )
}
