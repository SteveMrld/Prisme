import Header from '../../../components/Header'
import Link from 'next/link'
import styles from './diarra.module.css'

export const metadata = {
  title: 'Cheick Modibo Diarra, Le Grand Entretien · Soara',
  description: "Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali.",
}

const questions = [
  "L'espace peut-il survivre à sa privatisation ?",
  "L'Afrique vient-elle de rater sa souveraineté numérique ?",
  "Qu'est-ce que Trump révèle sur la place réelle de l'Afrique ?",
  "Qu'est-ce que doit être un dirigeant africain au XXIe siècle ?",
]

export default function DiarraPage() {
  return (
    <>
      <Header />

      <article className={styles.article}>

        <div className={styles.portraitBlock}>
          <img
            src="/portraits/diarra.png"
            alt="Cheick Modibo Diarra"
            className={styles.portrait}
          />
        </div>

        <div className={styles.textCol}>

          <div className={styles.eyebrow}>
            <span className={styles.tag}>Grand Entretien</span>
            <span className={styles.num}>N° 1</span>
          </div>

          <h1 className={styles.name}>
            Cheick Modibo <em>Diarra</em>
          </h1>

          <div className={styles.role}>
            Astrophysicien · NASA &nbsp;·&nbsp; Ancien président de Microsoft Afrique &nbsp;·&nbsp; Ancien Premier ministre du Mali
          </div>

          <p className={styles.deck}>
            Cheick Modibo Diarra n'est pas un homme qu'on résume facilement.
            Ingénieur de navigation interplanétaire à la NASA sur cinq missions —
            dont Mars Pathfinder et Mars Global Surveyor —, ancien président de Microsoft Afrique
            pendant dix ans, ancien Premier ministre du Mali en 2012–2013 dans un contexte
            de crise institutionnelle majeure. C'est cette trajectoire singulière — la science,
            le capital technologique mondial, le pouvoir politique africain — qui en fait
            l'interlocuteur idéal pour l'entretien inaugural de Soara.
          </p>

          <div className={styles.questionsSection}>
            <div className={styles.questionsLabel}>Les questions qui seront posées</div>
            <div className={styles.questions}>
              {questions.map((q, i) => (
                <div key={i} className={styles.question}>
                  <span className={styles.questionNum}>0{i + 1}</span>
                  <span className={styles.questionText}>«&nbsp;{q}&nbsp;»</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.coming}>
            <div className={styles.comingLabel}>À paraître prochainement</div>
            <p className={styles.comingDesc}>Inscrivez-vous pour être notifié à la parution.</p>
            <div className={styles.comingActions}>
              <Link href="/abonnement" className={styles.comingBtn}>S'abonner pour lire en avant-première</Link>
              <Link href="/connexion" className={styles.comingLink}>Déjà abonné ? Se connecter →</Link>
            </div>
          </div>

        </div>
      </article>

      <footer className={styles.footer}>
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
