import Header from '../../components/Header'
import Link from 'next/link'
import styles from './mentions.module.css'

export const metadata = {
  title: 'Mentions légales — Confins',
  description: 'Mentions légales et politique de confidentialité de Confins.',
}

export default function MentionsPage() {
  return (
    <>
      <Header />
      <div className={styles.band}>
        <span className={styles.eyebrow}>Mentions légales</span>
        <h1 className={styles.title}>Informations <em>légales</em></h1>
      </div>
      <div className={styles.body}>
        {[
          {
            title: 'Éditeur',
            content: `Confins est édité par Steve Moradel, personne physique.
Contact : contact@confins.media
Directeur de la publication : Steve Moradel`,
          },
          {
            title: 'Hébergement',
            content: `Le site confins.fr est hébergé par Vercel Inc.
440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.`,
          },
          {
            title: 'Propriété intellectuelle',
            content: `L'ensemble des contenus publiés sur Confins (textes, analyses, visuels, infographies) sont protégés par le droit d'auteur. Toute reproduction, même partielle, est soumise à autorisation préalable de l'éditeur.

Les citations et références aux sources sont effectuées dans le respect des droits des auteurs cités.`,
          },
          {
            title: 'Données personnelles',
            content: `Confins ne collecte pas de données personnelles au-delà des informations strictement nécessaires à la gestion des abonnements.

Aucune donnée n'est revendue ou transmise à des tiers à des fins commerciales. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à contact@confins.media.`,
          },
          {
            title: 'Cookies',
            content: `Confins utilise uniquement des cookies techniques nécessaires au bon fonctionnement du site. Aucun cookie publicitaire ou de traçage tiers n'est utilisé.`,
          },
          {
            title: 'Liens externes',
            content: `Les liens vers des sites tiers présents dans nos articles sont fournis à titre informatif. Confins ne saurait être tenu responsable du contenu de ces sites externes.`,
          },
        ].map(s => (
          <section key={s.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{s.title}</h2>
            <p className={styles.sectionContent}>{s.content}</p>
          </section>
        ))}
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Con<em>fins</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Confins · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
