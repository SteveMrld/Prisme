import Header from '../../../components/Header'
import Link from 'next/link'
import styles from './diarra.module.css'

export const metadata = {
  title: 'Cheick Modibo Diarra — Le Grand Entretien · Prisme',
  description: 'Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali. Un entretien à paraître.',
}

const questions = [
  'L\'espace peut-il survivre à sa privatisation ?',
  'L\'Afrique vient-elle de rater sa souveraineté numérique ?',
  'Qu\'est-ce que Trump révèle sur la place réelle de l\'Afrique ?',
  'Qu\'est-ce que doit être un dirigeant africain au XXIe siècle ?',
]

export default function DiarraPage() {
  return (
    <>
      <Header />

      <div className={styles.page}>
        <div className={styles.eyebrowRow}>
          <span className={styles.tag}>Le Grand Entretien</span>
          <span className={styles.num}>N°1</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroPortrait}>
            <img
              src="/portraits/diarra.png"
              alt="Cheick Modibo Diarra"
              className={styles.portrait}
            />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.name}>
              Cheick<br />Modibo <em>Diarra</em>
            </h1>
            <div className={styles.role}>
              Astrophysicien · NASA<br />
              Ancien patron de Microsoft Afrique<br />
              Ancien Premier ministre du Mali
            </div>
            <p className={styles.bio}>
              Cheick Modibo Diarra n'est pas un homme qu'on résume facilement.
              Astrophysicien formé à Paris et Washington, ingénieur de navigation
              interplanétaire à la NASA sur cinq missions — dont Mars Pathfinder et
              Mars Global Surveyor —, ancien président de Microsoft Afrique pendant
              dix ans, ancien Premier ministre du Mali entre 2012 et 2013 dans un
              contexte de crise institutionnelle majeure.
            </p>
            <p className={styles.bio}>
              C'est cette trajectoire singulière — la science, le capital technologique
              mondial, le pouvoir politique africain — qui en fait l'interlocuteur
              idéal pour l'entretien inaugural de Prisme. Un homme qui a navigué entre
              les étoiles et les palais de gouvernement, et qui peut parler des deux
              sans naïveté.
            </p>
          </div>
        </div>

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
          <div className={styles.comingInner}>
            <div className={styles.comingLabel}>À paraître prochainement</div>
            <p className={styles.comingDesc}>
              Inscrivez-vous ou connectez-vous pour être notifié à la parution.
            </p>
            <div className={styles.comingActions}>
              <Link href="/abonnement" className={styles.comingBtn}>S'abonner pour lire en avant-première</Link>
              <Link href="/connexion" className={styles.comingLink}>Déjà abonné ? Se connecter →</Link>
            </div>
          </div>
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
