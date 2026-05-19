import EauScrollytellingWrapper from './EauScrollytellingWrapper'
import eauData from '../lib/eau-data.json'
import styles from './EauScrollytellingLayout.module.css'

type ArticleProps = {
  article: {
    title: string
    description: string
    image?: string
    date?: string
    author?: string
    authorRole?: string
  }
  showPaywall?: boolean
  lang?: string
  hasEnglish?: boolean
}

export default function EauScrollytellingLayout({ article }: ArticleProps) {
  const chapitres = eauData.chapitres

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.tags}>
          <span className={styles.tag}>Environnement</span>
          <span className={styles.tagOutline}>Géopolitique</span>
          <span className={styles.tagFormat}>Grand format</span>
          <span className={styles.tagDate}>Avril 2026</span>
        </div>
        <h1 className={styles.title}>
          L&apos;eau : la prochaine grande<br />
          <em>fracture géopolitique</em>
        </h1>
        <p className={styles.chapeau}>{article.description}</p>
        <div className={styles.byline}>
          <div className={styles.avatar}>SM</div>
          <div>
            <div className={styles.bylineName}>{article.author || 'Steve Moradel'}</div>
            <div className={styles.bylineRole}>{article.authorRole || 'Environnement & Ressources'}</div>
          </div>
        </div>
      </header>

      <section className={styles.essentiel}>
        <div className={styles.essentielHeader}>
          <span className={styles.essentielLabel}>L&apos;essentiel</span>
          <span className={styles.essentielSub}>3 points</span>
        </div>
        <ul className={styles.essentielList}>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>1</span>
            <span>4 milliards de personnes subissent une pénurie d&apos;eau au moins un mois par an. La demande mondiale augmentera de 20 à 30% d&apos;ici 2050, sans que le stock global ne croisse.</span>
          </li>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>2</span>
            <span>Les conflits de l&apos;eau sont lents, diffus, souvent habillés en crises humanitaires. Mais ils structurent déjà les rapports de force entre États riverains de mêmes bassins.</span>
          </li>
          <li className={styles.essentielItem}>
            <span className={styles.essentielNum}>3</span>
            <span>Contrôler les sources, c&apos;est contrôler les États en aval. Le Grand Barrage de la Renaissance éthiopien et les barrages chinois sur le Mékong ne sont pas des projets hydrauliques, ce sont des instruments de domination.</span>
          </li>
        </ul>
      </section>

      <EauScrollytellingWrapper>
        {chapitres.map((ch, i) => (
          <section
            key={ch.id}
            id={`chapitre-${ch.id}`}
            data-chapter-idx={i}
            className={styles.chapter}
          >
            <div className={styles.chapterTag} style={{ color: ch.couleur }}>
              {ch.tag}
            </div>
            <h2 className={styles.chapterTitle}>
              <ChapterTitleSplit titre={ch.titre_court} em={ch.titre_em} />
            </h2>
            <p className={styles.chapterHook}>{ch.hook}</p>
            <div className={styles.chapterStat}>
              <span className={styles.chapterStatValue} style={{ color: ch.couleur }}>
                {ch.stat.valeur}
                {ch.stat.suffixe}
              </span>
              <span className={styles.chapterStatLabel}>{ch.stat.label}</span>
            </div>
            <div className={styles.chapterNarrative}>
              <p className={styles.placeholder}>
                Narration du chapitre {ch.ordre} ({ch.id}) à intégrer dans le prochain commit Phase A.
              </p>
            </div>
          </section>
        ))}
      </EauScrollytellingWrapper>

      <section className={styles.outro}>
        <p className={styles.placeholder}>
          Outro (Guerre invisible, Nouvelles puissances hydriques, Prospective, paragraphe final) à intégrer au prochain commit.
        </p>
      </section>

      <section className={styles.notes}>
        <p className={styles.placeholder}>Notes et sources à intégrer au prochain commit.</p>
      </section>
    </article>
  )
}

function ChapterTitleSplit({ titre, em }: { titre: string; em: string }) {
  const idx = titre.indexOf(em)
  if (idx === -1) return <>{titre}</>
  return (
    <>
      {titre.slice(0, idx)}
      <em>{em}</em>
      {titre.slice(idx + em.length)}
    </>
  )
}
