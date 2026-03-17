import Header from '../../components/Header'
import Link from 'next/link'
import styles from './apropos.module.css'

export const metadata = {
  title: 'À propos — Prisme',
  description: 'Ce que Prisme est, ce qu\'il n\'est pas, et pourquoi.',
}

export default function AProposPage() {
  return (
    <>
      <Header />
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>À propos</span>
          <h1 className={styles.title}>Voir <em>autrement</em></h1>
          <p className={styles.subtitle}>
            Prisme est un média d'analyse indépendant. Pas un agrégateur. Pas un éditorialiste de plus.
            Un outil pour comprendre ce qui se passe vraiment.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>La conviction fondatrice</h2>
          <p>
            L'information abonde. La compréhension manque. Chaque jour, des milliers d'articles décrivent
            des événements sans jamais expliquer les structures qui les produisent. Prisme part du principe
            inverse : les événements sont des symptômes. Ce qui mérite analyse, c'est ce qui les rend possibles.
          </p>
          <p>
            Un coup d'État au Sahel n'est pas une surprise — c'est l'aboutissement d'une décennie de politique
            française mal calibrée, de compétition sino-russe et de frustrations démographiques non résolues.
            L'effondrement d'une startup technologique n'est pas un accident — c'est la conséquence logique
            d'une idéologie qui a substitué la foi en la technologie à la rigueur analytique.
          </p>
          <p>
            Prisme écrit sur les structures. Sur ce qui dure. Sur ce qu'il faut avoir compris pour que
            les prochains événements ne surprennent pas.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ce que nous faisons</h2>
          <div className={styles.cards}>
            {[
              { label: 'Grands formats', desc: 'Des analyses de fond de 10 à 20 minutes. Géopolitique, économie, technologie, environnement. Sourcées, structurées, sans jargon inutile.' },
              { label: 'Signal', desc: 'L\'actualité qui compte, sans bruit. Les faits bruts, contextualisés en trois phrases.' },
              { label: 'Portraits', desc: 'Des trajectoires singulières. Des femmes et des hommes dont les vies éclairent leur époque mieux que n\'importe quelle synthèse abstraite.' },
              { label: 'Visuels', desc: 'Infographies, animations, visualisations interactives. Les idées qui se comprennent mieux quand on les voit.' },
            ].map(c => (
              <div key={c.label} className={styles.card}>
                <div className={styles.cardLabel}>{c.label}</div>
                <p className={styles.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>L'indépendance, concrètement</h2>
          <p>
            Prisme n'a pas d'actionnaire industriel. Pas de régie publicitaire. Pas de dépendance à une
            subvention publique qui conditionnerait une ligne éditoriale. Le modèle est simple : des lecteurs
            qui paient pour de l'analyse qui leur est utile.
          </p>
          <p>
            Cela signifie que nous pouvons écrire que la politique africaine de la France a échoué, que
            le techno-solutionnisme est une idéologie, que certains dirigeants admirés ont des trajectoires
            moralement ambiguës — sans que personne ne nous appelle pour nous demander de nuancer.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Le fondateur</h2>
          <div className={styles.founder}>
            <div className={styles.founderText}>
              <p>
                Steve Moradel est enseignant en stratégie à l'ESSEC, à l'INSEEC et à Audencia. Ses travaux
                portent sur les mutations géopolitiques, les transformations technologiques et leurs effets
                sur les structures économiques et sociales.
              </p>
              <p>
                Il a fondé Prisme avec une conviction simple : le niveau moyen du débat public est inférieur
                à ce dont nos sociétés ont besoin pour prendre de bonnes décisions. La presse généraliste
                manque de profondeur. La littérature académique manque d'accessibilité. Il y a un espace
                entre les deux. C'est cet espace que Prisme cherche à occuper.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.ctas}>
          <Link href="/abonnement" className={styles.ctaPrimary}>S'abonner</Link>
          <Link href="/contributeurs" className={styles.ctaSecondary}>Voir les contributeurs →</Link>
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
