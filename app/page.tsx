import Header from '../components/Header'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, FadeCard, StaggerGrid, StaggerItem } from './HomeClient'
import Ticker from './TickerClient'
import { EnCeMoment, StatCount, AnimatedGrain } from './HomeEnhancements'

const signalItems = [
  { cat: 'Géopolitique', color: 'var(--geo)', headline: 'QatarEnergy déclare force majeure sur l'ensemble de sa production GNL', date: '20 mars' },
  { cat: 'Économie', color: 'var(--eco)', headline: 'Brent à 108$ — marchés énergétiques sous tension maximale', date: '20 mars' },
  { cat: 'Afrique', color: 'var(--geo)', headline: 'Sahel — 50% des morts du terrorisme mondial selon le Global Terrorism Index', date: '20 mars' },
  { cat: 'Société', color: 'var(--soc)', headline: 'Aïd el-Fitr ce vendredi — fin du Ramadan 2026 confirmée en France', date: '20 mars' },
]

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept',
}

function getArticle(slug: string) {
  const a = articlesData.find((x: any) => x.slug === slug)!
  return { ...a, categoryLabel: categoryLabels[a.category] || a.category }
}

const heroArticleRaw = getArticle('chine')
const heroArticle = {
  ...heroArticleRaw,
  title: 'La Chine, stratégie<br>d\'une <em>conquête</em>',
  format: 'Grand format',
}

const heroAsideSlugs = ['afrique', 'rushkoff', 'ia_ecriture']
const heroAside = heroAsideSlugs.map(slug => {
  const a = getArticle(slug)
  return { ...a, excerpt: a.description }
})

const grandsFormatsSlugs = [
  { slug: 'france_maritime',    extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '7 sections · 12 sources' },
  { slug: 'eau',                extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '8 sections · 11 sources' },
  { slug: 'techgeo',            extraCategories: [{ label: 'Technologie', color: 'tech' }], sections: '7 sections · 16 sources' },
  { slug: 'taiwan',             extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '6 sections · 10 sources' },
  { slug: 'chine',              extraCategories: [{ label: 'Économie', color: 'eco' }],     sections: '8 sections · 14 sources' },
]
const grandsFormats = grandsFormatsSlugs.map(({ slug, extraCategories, sections }) => {
  const a = getArticle(slug)
  return {
    ...a,
    categories: [{ label: a.categoryLabel, color: a.category }, ...extraCategories],
    sections,
  }
})

const categoryColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
  portrait: 'var(--portrait)', concept: 'var(--concept)', sciences: 'var(--sciences)'
}


export default function HomePage() {
  return (
    <>
      <Header />

      {/* TICKER LIVE */}
      <Ticker />

      {/* GRAND ENTRETIEN */}
      <FadeSection>
      <section className={styles.ge}>
        <div className={styles.geDecor} aria-hidden="true">
          <div className={styles.geDecorLine} />
          <span className={styles.geDecorN}>N°1</span>
          <div className={styles.geDecorLine} />
        </div>
        <div className={styles.geTextBlock}>
          <div className={styles.geLabel}>Le Grand Entretien · À venir</div>
          <h2 className={styles.geName}>
            Cheick Modibo <em>Diarra</em>
          </h2>
          <div className={styles.geRole}>
            Astrophysicien · NASA · Microsoft Afrique · Ancien Premier ministre du Mali
          </div>
          <Link href="/entretien/diarra" className={styles.geCta}>
            Lire l'entretien dès sa parution →
          </Link>
        </div>
      </section>
      </FadeSection>

      {/* HERO */}
      <FadeSection delay={0.1}>
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
          <h2 className={styles.heroTitle}><span className={styles.pBadge}>P</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span> <span dangerouslySetInnerHTML={{ __html: heroArticle.title }} /></h2>
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
      </FadeSection>

      {/* GRANDS FORMATS */}
      <FadeSection delay={0.05}>
      <section className={styles.gfSection}>
        <div className={styles.gfHeader}>
          <span className={styles.gfLabel}>Grands formats</span>
          <span className={styles.gfSub}>Lectures de fond · 12–18 min</span>
        </div>
        <StaggerGrid className={styles.gfGrid}>
          {grandsFormats.map((article) => (
            <StaggerItem key={article.slug}>
            <Link href={`/articles/${article.slug}`} className={`${styles.gfCard} ${styles[article.categories[0].color]}`}>
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
              <div className={styles.gfTitle}><span className={styles.pBadge}>P</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
              <p className={styles.gfDeck}>{article.description}</p>
              <div className={styles.gfFooter}>
                <span className={styles.gfSections}>{article.sections}</span>
                <span className={styles.gfCta} style={{ color: categoryColors[article.categories[0].color] }}>
                  Lire l'analyse →
                </span>
              </div>
            </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
      </FadeSection>

      {/* ── STATS PRISME ── */}
      <FadeSection>
      <section style={{
        borderTop: '1px solid var(--bord)',
        borderBottom: '1px solid var(--bord)',
        padding: '0 64px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0',
      }}>
        {[
          { value: 29, suffix: '', label: 'Analyses publiées', prefix: '' },
          { value: 18, suffix: ' min', label: 'Lecture la plus longue', prefix: '' },
          { value: 8, suffix: '', label: 'Minutes de lecture en moyenne', prefix: '' },
          { value: 11, suffix: '', label: 'Contributeurs', prefix: '' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '32px 28px', borderRight: i < 3 ? '1px solid var(--bord)' : 'none' }}>
            <StatCount value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
          </div>
        ))}
      </section>
      </FadeSection>

      {/* ── DERNIÈRES ANALYSES ── */}
      <FadeSection>
      <section className={styles.latestSection}>
        <div className={styles.latestHead}>
          <div className={styles.latestLabel}>Dernières analyses</div>
          <Link href="/geo" className={styles.latestSeeAll}>Tout voir →</Link>
        </div>
        <div className={styles.latestGrid}>
          {[
            getArticle('semico'),
            getArticle('blackrock'),
            getArticle('afrique'),
            getArticle('reseaux'),
            getArticle('technosolutionnisme'),
            getArticle('overton'),
          ].map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.latestCard}>
              {article.image && (
                <div className={styles.latestImgWrap}>
                  <img src={article.image} alt={article.title} className={styles.latestImg} />
                </div>
              )}
              <div className={styles.latestBody}>
                <span className={styles.latestTag} style={{ color: categoryColors[article.category] }}>
                  {article.categoryLabel}
                </span>
                <div className={styles.latestTitle}><span className={styles.pBadge}>P</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
                <p className={styles.latestDesc}>{article.description}</p>
                <span className={styles.latestTime}>{article.readTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ── PORTRAITS ── */}
      <FadeSection>
      <section className={styles.portraitsSection}>
        <div className={styles.portraitsHead}>
          <div className={styles.portraitsLabel}>Portraits</div>
          <Link href="/portraits" className={styles.portraitsSeeAll}>Tous les portraits →</Link>
        </div>
        <div className={styles.portraitsGrid}>
          {[
            getArticle('musk'),
            getArticle('morrison'),
            getArticle('nooyi'),
          ].map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.portraitCard}>
              <div className={styles.portraitImgWrap}>
                <img src={article.image} alt={article.title} className={styles.portraitImg} />
              </div>
              <div className={styles.portraitBody}>
                <span className={styles.portraitTag} style={{ color: 'var(--portrait)' }}>Portrait</span>
                <div className={styles.portraitTitle}><span className={styles.pBadge}>P</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span>{article.title}</div>
                <p className={styles.portraitDesc}>{article.description}</p>
                <span className={styles.portraitCta}>Lire →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ── SIGNAL ── */}
      <FadeSection>
      <section className={styles.signalSection}>
        <div className={styles.signalHead}>
          <div className={styles.signalLabel}>
            <span className={styles.signalDot} />
            Signal
          </div>
          <Link href="/signal" className={styles.signalSeeAll}>Tout le signal →</Link>
        </div>
        <div className={styles.signalGrid}>
          {signalItems.map((item, i) => (
            <Link key={i} href="/signal" className={styles.signalItem}>
              <span className={styles.signalCat} style={{ color: item.color }}>{item.cat}</span>
              <span className={styles.signalDate}>{item.date}</span>
              <div className={styles.signalHeadline}>{item.headline}</div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

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
