import Header from '../../components/Header'
import Link from 'next/link'
import PictureImg from '../../components/PictureImg'
import { CONTRIBUTEURS } from '../../lib/contributeurs'
import styles from './contributeurs.module.css'

export const metadata = {
  title: 'Contributeurs',
  description: 'Les auteurs qui écrivent pour Soara.',
  alternates: { canonical: 'https://soara.fr/contributeurs' },
}


function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('')
}

export default function ContributeursPage() {
  return (
    <>
      <Header />

      <div className={styles.band}>
        <span className={styles.eyebrow}>Contributeurs</span>
        <h1 className={styles.title}>Celles et ceux <em>qui écrivent</em></h1>
        <p className={styles.desc}>
          Soara est construit sur des contributions singulières. Chaque auteur apporte un regard,
          une méthode, un angle. Ce qui les unit : la conviction que l'analyse rigoureuse est utile.
        </p>
      </div>

      <div className={styles.list}>
        {CONTRIBUTEURS.map((c) => (
          <div key={c.name} className={styles.item}>
            <div className={styles.itemLeft}>
              <Link href={`/contributeurs/${c.slug}`} aria-label={`Profil de ${c.name}`}>
                {c.portrait
                  ? <PictureImg src={c.portrait} alt={c.name} className={styles.avatar} style={{objectFit:'cover', objectPosition:'top center'}} />
                  : <div className={styles.avatar}>{initials(c.name)}</div>
                }
              </Link>
            </div>
            <div className={styles.itemRight}>
              <div className={styles.itemName}>
                <Link href={`/contributeurs/${c.slug}`} className={styles.itemNameLink}>{c.name}</Link>
              </div>
              <div className={styles.itemRole}>{c.role}</div>
              <p className={styles.itemBio}>{c.bio}</p>
              <div className={styles.itemDomaines}>
                {c.domaines.map(d => (
                  <span key={d} className={styles.domaine}>{d}</span>
                ))}
              </div>
              <div className={styles.itemActions}>
                <Link href={`/contributeurs/${c.slug}`} className={styles.profilLink}>
                  Lire ses articles →
                </Link>
                {c.linkedin && (
                  <a href={c.linkedin} className={styles.linkedin} target="_blank" rel="noopener">
                    LinkedIn →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className={styles.openCall}>
          <div className={styles.openCallLabel}>Rejoindre Soara</div>
          <h3 className={styles.openCallTitle}>Vous souhaitez contribuer ?</h3>
          <p className={styles.openCallDesc}>
            Soara accueille des contributions ponctuelles ou régulières d'analystes, chercheurs,
            praticiens et journalistes indépendants. Le critère central n'est pas le statut : c'est
            la rigueur et la singularité du point de vue.
          </p>
          <a href="mailto:contact@soara.media" className={styles.openCallCta}>
            Nous écrire →
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}

