import Header from '../../components/Header'
import Link from 'next/link'
import styles from './contributeurs.module.css'

export const metadata = {
  title: 'Contributeurs — Prisme',
  description: 'Les auteurs qui écrivent pour Prisme.',
}

const contributeurs = [
  {
    name: 'Steve Moradel',
    role: 'Fondateur · Directeur de la rédaction',
    bio: 'Enseignant en stratégie à l\'ESSEC, l\'INSEEC et Audencia. Ses analyses portent sur les mutations géopolitiques, les transformations technologiques et leurs effets sur les structures économiques.',
    domaines: ['Géopolitique', 'Économie', 'Technologie'],
    linkedin: 'https://linkedin.com',
  },
  {
    name: 'Jade Desroses',
    role: 'Contributrice · Culture & Société',
    bio: 'Professeure de lettres et essayiste. Elle explore les liens entre littérature, mémoire et politique, avec une attention particulière aux voix longtemps marginalisées du canon occidental.',
    domaines: ['Culture', 'Société', 'Portraits'],
    linkedin: null,
  },
]

export default function ContributeursPage() {
  return (
    <>
      <Header />

      <div className={styles.band}>
        <span className={styles.eyebrow}>Contributeurs</span>
        <h1 className={styles.title}>Celles et ceux <em>qui écrivent</em></h1>
        <p className={styles.desc}>
          Prisme est construit sur des contributions singulières. Chaque auteur apporte un regard,
          une méthode, un angle. Ce qui les unit : la conviction que l'analyse rigoureuse est utile.
        </p>
      </div>

      <div className={styles.list}>
        {contributeurs.map((c) => (
          <div key={c.name} className={styles.item}>
            <div className={styles.itemLeft}>
              <div className={styles.avatar}>{c.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
            <div className={styles.itemRight}>
              <div className={styles.itemName}>{c.name}</div>
              <div className={styles.itemRole}>{c.role}</div>
              <p className={styles.itemBio}>{c.bio}</p>
              <div className={styles.itemDomaines}>
                {c.domaines.map(d => (
                  <span key={d} className={styles.domaine}>{d}</span>
                ))}
              </div>
              {c.linkedin && (
                <a href={c.linkedin} className={styles.linkedin} target="_blank" rel="noopener">
                  LinkedIn →
                </a>
              )}
            </div>
          </div>
        ))}

        <div className={styles.openCall}>
          <div className={styles.openCallLabel}>Rejoindre Prisme</div>
          <h3 className={styles.openCallTitle}>Vous souhaitez contribuer ?</h3>
          <p className={styles.openCallDesc}>
            Prisme accueille des contributions ponctuelles ou régulières d'analystes, chercheurs,
            praticiens et journalistes indépendants. Le critère central n'est pas le statut — c'est
            la rigueur et la singularité du point de vue.
          </p>
          <a href="mailto:contact@prisme.media" className={styles.openCallCta}>
            Nous écrire →
          </a>
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
