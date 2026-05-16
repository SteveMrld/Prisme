import Header from '../../components/Header'
import styles from './mentions.module.css'

export const metadata = {
  title: 'Mentions légales · Soara',
  description: 'Mentions légales, politique de confidentialité et informations légales de Soara.',
}

export default function MentionsPage() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.inner}>

          <h1 className={styles.title}>Mentions légales</h1>

          <section className={styles.section}>
            <h2>Éditeur</h2>
            <p><strong>Soara</strong> est une publication éditée par :</p>
            <p>
              Steve Moradel<br />
              Directeur de la publication<br />
              Contact : <a href="mailto:contact@soara.fr">contact@soara.fr</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>Hébergement</h2>
            <p>
              Ce site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              340 Pine Street, Suite 701<br />
              San Francisco, CA 94104, États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener">vercel.com</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus publiés sur Soara (textes, analyses, visuels, infographies, vidéos) est protégé par le droit d'auteur. Toute reproduction, même partielle, est soumise à autorisation préalable de l'éditeur, sauf mention contraire explicite.
            </p>
            <p>
              Conformément à la loi du 11 mars 1957 et au Code de la propriété intellectuelle, toute utilisation non autorisée des contenus constitue une contrefaçon passible de sanctions civiles et pénales.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Données personnelles</h2>
            <p>
              Soara collecte uniquement les données strictement nécessaires à la relation avec ses abonnés et lecteurs : adresse e-mail pour la newsletter et le compte abonné.
            </p>
            <p>
              Ces données sont traitées conformément au Règlement général sur la protection des données (RGPD, Règlement UE 2016/679). Elles ne sont ni vendues, ni cédées à des tiers.
            </p>
            <p>
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits : <a href="mailto:contact@soara.fr">contact@soara.fr</a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>Cookies</h2>
            <p>
              Soara utilise des cookies fonctionnels nécessaires au bon fonctionnement du site (authentification, préférences). Aucun cookie publicitaire ni tracker tiers n'est utilisé.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Responsabilité</h2>
            <p>
              Soara s'efforce de maintenir l'exactitude et l'actualité de ses informations. Les analyses publiées reflètent l'opinion de leurs auteurs et n'engagent que ces derniers. Soara décline toute responsabilité quant aux décisions prises sur la base des informations publiées.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Charte éditoriale</h2>
            <p>
              Soara adhère aux principes de la Charte de Munich (1971), déclaration internationale des droits et devoirs des journalistes. L'indépendance éditoriale est garantie par l'absence de tout actionnaire ou annonceur susceptible d'influer sur les contenus publiés.
            </p>
          </section>

          <p className={styles.updated}>Dernière mise à jour : avril 2026</p>

        </div>
      </div>
    </>
  )
}
