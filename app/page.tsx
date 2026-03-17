import Header from '../components/Header'
import styles from './page.module.css'
import Link from 'next/link'

// Données articles en dur — sera dynamique plus tard
const heroArticle = {
  slug: 'chine',
  title: 'La Chine, stratégie<br>d\'une <em>conquête</em>',
  description: 'En quatre décennies, Pékin a transformé une économie agraire en première puissance commerciale mondiale, et prépare maintenant la prochaine étape : devenir la première puissance technologique.',
  image: 'https://i.ibb.co/qLtNzNZP/img-chine.jpg',
  category: 'geo',
  categoryLabel: 'Géopolitique',
  readTime: '12',
  format: 'Grand format',
}

const heroAside = [
  {
    slug: 'afrique',
    title: 'La France en Afrique : la fin d\'un monde',
    excerpt: 'Coups d\'État au Sahel, retrait militaire. La France n\'a pas perdu l\'Afrique par accident.',
    category: 'geo',
    categoryLabel: 'Géopolitique',
    image: 'https://i.ibb.co/twCGQsPB/img-afrique.jpg',
  },
  {
    slug: 'rushkoff',
    title: 'Quand les bâtisseurs fuient leur propre création',
    excerpt: 'Les architectes de la Silicon Valley rêvent de bunkers. Ce n\'est pas anodin.',
    category: 'tech',
    categoryLabel: 'Technologie · Société',
    image: '',
  },
  {
    slug: 'ia_ecriture',
    title: 'Ce que l\'IA ne pourra jamais écrire',
    excerpt: 'Camus, Césaire et l\'imperfection nécessaire. Ce que la littérature contient d\'irréductible.',
    category: 'culture',
    categoryLabel: 'Culture · Technologie',
    image: '',
  },
]

const grandsFormats = [
  {
    slug: 'chine',
    title: 'La Chine, stratégie d\'une <em>conquête</em>',
    description: 'De l\'atelier du monde à l\'intelligence artificielle, de la Belt and Road aux terres rares.',
    image: 'https://i.ibb.co/qLtNzNZP/img-chine.jpg',
    categories: [{ label: 'Géopolitique', color: 'geo' }, { label: 'Économie', color: 'eco' }],
    readTime: '13', sections: '8 sections · 14 sources',
  },
  {
    slug: 'technosolutionnisme',
    title: 'Les limites du <em>techno-solutionnisme</em>',
    description: 'Theranos, Sidewalk Toronto, COMPAS, les biais algorithmiques. Ce que la croyance que la technologie résout tout produit quand elle rencontre la réalité.',
    image: 'https://i.ibb.co/VpYfCtzB/img-technosolutionnisme.jpg',
    categories: [{ label: 'Technologie', color: 'tech' }],
    readTime: '16', sections: '8 sections · 18 sources',
  },
  {
    slug: 'eau',
    title: 'L\'eau : la prochaine grande <em>fracture géopolitique</em>',
    description: 'Des glaciers himalayens aux barrages africains. Comment la maîtrise de l\'eau redessine silencieusement les rapports de puissance.',
    image: 'https://i.ibb.co/mVBDmC2j/img-eau.png',
    categories: [{ label: 'Environnement', color: 'env' }, { label: 'Géopolitique', color: 'geo' }],
    readTime: '18', sections: '8 sections · 11 sources',
  },
]

const categoryColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
  portrait: 'var(--portrait)', concept: 'var(--concept)'
}

const tickerItems = [
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Guerre Moyen-Orient J18 — Israël frappe Téhéran et Beyrouth' },
  { cat: 'Économie', color: 'var(--eco)', text: 'La Fed se réunit — stagflation en ligne de mire, pétrole à 103$' },
  { cat: 'Technologie', color: 'var(--tech)', text: 'Nvidia GPU H200 : rupture de stock mondiale, Taïwan sous pression' },
  { cat: 'Géopolitique', color: 'var(--geo)', text: 'Trump face au mur, alliés absents' },
  { cat: 'Environnement', color: 'var(--env)', text: 'Sécheresse record en Europe du Sud — 4e année consécutive' },
  { cat: 'Société', color: 'var(--soc)', text: 'France : réforme des retraites, mobilisation nationale jeudi' },
  { cat: 'Économie', color: 'var(--eco)', text: 'Bitcoin dépasse 94 000$ — institutionnels en retrait' },
]

export default function HomePage() {
  return (
    <>
      <Header />

      {/* TICKER LIVE */}
      <div className={styles.ticker}>
        <div className={styles.tickerLeft}>
          <span className={styles.livePill}>
            <span className={styles.liveDot}></span>
            LIVE
          </span>
          <span className={styles.tickerDate}>17 mars 2026</span>
        </div>
        <div className={styles.tickerWrap}>
          <div className={styles.tickerTrack}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className={styles.tickerItem}>
                <span className={styles.tickerDot} style={{ background: item.color }}></span>
                <span className={styles.tickerCat} style={{ color: item.color }}>{item.cat}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
        <Link href="/signal" className={styles.tickerSignal}>Signal →</Link>
      </div>

      {/* GRAND ENTRETIEN */}
      <section className={styles.ge}>
        <div className={styles.geContent}>
          <div className={styles.geEyebrow}>
            <span className={styles.geTag}>Le Grand Entretien</span>
            <span className={styles.geNum}>N°1 · À venir</span>
          </div>
          <h2 className={styles.geName}>
            Cheick<br />Modibo <em>Diarra</em>
          </h2>
          <div className={styles.geRole}>
            Astrophysicien · NASA<br />
            Ancien patron de Microsoft Afrique<br />
            Ancien Premier ministre du Mali
          </div>
          <p className={styles.geBio}>
            Cheick Modibo Diarra n'est pas un homme qu'on résume facilement. Astrophysicien formé à Paris et Washington, ingénieur de navigation interplanétaire à la NASA sur cinq missions, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali.
          </p>
          <Link href="/entretien/diarra" className={styles.geCta}>
            Lire l'entretien dès sa parution →
          </Link>
          <div className={styles.geQuestions}>
            {['L\'espace peut-il survivre à sa privatisation ?', 'L\'Afrique vient-elle de rater sa souveraineté numérique ?', 'Qu\'est-ce que Trump révèle sur la place réelle de l\'Afrique ?', 'Qu\'est-ce que doit être un dirigeant africain au XXIe siècle ?'].map((q, i) => (
              <span key={i} className={styles.geQuestion}>«&nbsp;{q}&nbsp;»</span>
            ))}
          </div>
        </div>
        <div className={styles.gePortrait}>
          <img
            src="https://i.ibb.co/DDXzwq0J/img-cmd-portrait.jpg"
            alt="Cheick Modibo Diarra"
            className={styles.gePortraitImg}
          />
        </div>
      </section>

      {/* HERO */}
      <section className={styles.hero}>
        <Link href={`/articles/${heroArticle.slug}`} className={styles.heroMain}>
          <div className={styles.heroImgWrap}>
            <img src={heroArticle.image} alt={heroArticle.title} className={styles.heroImg} />
          </div>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroTag} style={{ color: categoryColors[heroArticle.category] }}>
              {heroArticle.categoryLabel}
            </span>
            <span className={styles.heroFormat}>Grand format</span>
            <span className={styles.heroTime}>{heroArticle.readTime} min</span>
          </div>
          <h2 className={styles.heroTitle} dangerouslySetInnerHTML={{ __html: heroArticle.title }} />
          <p className={styles.heroDeck}>{heroArticle.description}</p>
          <div className={styles.heroMeta}>
            <span>{heroArticle.readTime} min de lecture</span>
            <span className={styles.heroCta}>Lire l'analyse →</span>
          </div>
        </Link>
        <div className={styles.heroAside}>
          {heroAside.map((item) => (
            <Link key={item.slug} href={`/articles/${item.slug}`} className={styles.heroAsideItem}>
              {item.image && (
                <div className={styles.heroAsideImgWrap}>
                  <img src={item.image} alt={item.title} className={styles.heroAsideImg} />
                </div>
              )}
              <span className={styles.heroAsideTag} style={{ color: categoryColors[item.category] }}>
                {item.categoryLabel}
              </span>
              <div className={styles.heroAsideTitle}>{item.title}</div>
              <div className={styles.heroAsideExcerpt}>{item.excerpt}</div>
              <span className={styles.heroAsideArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* GRANDS FORMATS */}
      <section className={styles.gfSection}>
        <div className={styles.gfHeader}>
          <span className={styles.gfLabel}>Grands formats</span>
          <span className={styles.gfSub}>Lectures de fond · 12–18 min</span>
        </div>
        <div className={styles.gfGrid}>
          {grandsFormats.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className={`${styles.gfCard} ${styles[article.categories[0].color]}`}>
              {article.image && (
                <div className={styles.gfImgWrap}>
                  <img src={article.image} alt={article.title} className={styles.gfImg} />
                </div>
              )}
              <div className={styles.gfEyebrow}>
                {article.categories.map((cat) => (
                  <span key={cat.label} className={styles.gfTag} style={{ background: categoryColors[cat.color] }}>
                    {cat.label}
                  </span>
                ))}
                <span className={styles.gfFormat}>Grand format</span>
                <span className={styles.gfReading}>{article.readTime} min</span>
              </div>
              <div className={styles.gfTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
              <p className={styles.gfDeck}>{article.description}</p>
              <div className={styles.gfFooter}>
                <span className={styles.gfSections}>{article.sections}</span>
                <span className={styles.gfCta} style={{ color: categoryColors[article.categories[0].color] }}>
                  Lire l'analyse →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
