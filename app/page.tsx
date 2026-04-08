export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import ConfinsTV from '../components/ConfinsTV'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, FadeCard, StaggerGrid, StaggerItem, HeroParallax } from './HomeClient'
import Ticker from './TickerClient'
import { EnCeMoment, StatCount, AnimatedGrain } from './HomeEnhancements'

const signalItems = [
  { cat: 'Moyen-Orient', color: 'var(--geo)', headline: "Détroit d'Ormuz — Iran maintient le blocus, Trump menace de frapper les infrastructures le 6 avril", date: '5 avril' },
  { cat: 'Énergie', color: 'var(--eco)', headline: "Choc pétrolier — le baril franchit 140 dollars, pire choc depuis 1973, inflation mondiale relancée", date: '4 avril' },
  { cat: 'Géopolitique', color: 'var(--geo)', headline: "Macron appelle à une coalition d'indépendance européenne face aux influences américaine et chinoise", date: '3 avril' },
  { cat: 'Iran', color: 'var(--geo)', headline: "35e jour du conflit — Lavrov et l'Égypte appellent au cessez-le-feu, Washington campe sur ses positions", date: '3 avril' },
  { cat: 'Tech', color: 'var(--tech)', headline: "IA générative — 48% des Français l'utilisent désormais, adoption la plus rapide de toute technologie numérique", date: '2 avril' },
  { cat: 'Environnement', color: 'var(--env)', headline: "Traité sur la biodiversité marine — les 60 ratifications franchies, la haute mer protégée pour la première fois", date: '2 avril' },
  { cat: 'Économie', color: 'var(--eco)', headline: "FMI abaisse ses prévisions — choc énergétique et tensions géopolitiques pèsent sur la croissance 2026", date: '1 avril' },
  { cat: 'Société', color: 'var(--soc)', headline: "Réseaux sociaux — l'exposition aux contenus problématiques concerne 1 jeune sur 3 en France selon l'Arcom", date: '1 avril' },
  { cat: 'Afrique', color: 'var(--geo)', headline: "Soudan — les RSF contrôlent désormais un territoire plus riche que certains États, poids géopolitique inédit", date: '31 mars' },
  { cat: 'Environnement', color: 'var(--env)', headline: "Déchets plastiques en Europe — baisse de 40% depuis 2015, les politiques d'interdiction montrent leur effet", date: '30 mars' },
  { cat: 'Tech', color: 'var(--tech)', headline: "Énergie et IA — la hausse des coûts électriques liée au conflit remet en cause les valorisations des géants du cloud", date: '2 avril' },
  { cat: 'Géopolitique', color: 'var(--geo)', headline: "Minéraux critiques — la Chine contrôle 90% du raffinage mondial, levier de puissance contre les sanctions occidentales", date: '3 avril' },
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
const rightColSlugs = ['chine', 'taiwan', 'semico']
const rightCol = rightColSlugs.map(slug => getArticle(slug))
const heroAside = heroAsideSlugs.map(slug => {
  const a = getArticle(slug)
  return { ...a, excerpt: a.description }
})

const grandsFormatsSlugs = [
  { slug: 'dette-souveraine',   extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '6 sections · données en temps réel' },
  { slug: 'france_maritime',    extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '7 sections · 12 sources' },
  { slug: 'eau',                extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '8 sections · 11 sources' },
  { slug: 'techgeo',            extraCategories: [{ label: 'Technologie', color: 'tech' }], sections: '7 sections · 16 sources' },
  { slug: 'taiwan',             extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '6 sections · 10 sources' },
  { slug: 'semico',             extraCategories: [{ label: 'Technologie', color: 'tech' }],  sections: '6 sections · 10 sources' },
]
const grandsFormats = grandsFormatsSlugs.map(({ slug, extraCategories, sections }) => {
  const a = getArticle(slug)
  const allCats = [{ label: a.categoryLabel, color: a.category }, ...extraCategories]
  const seen = new Set<string>()
  const categories = allCats.filter(cat => { if (seen.has(cat.label)) return false; seen.add(cat.label); return true; })
  return { ...a, categories, sections }
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

      {/* ATLANTIC HERO */}
      <FadeSection>
      <section className={styles.atlanticHero}>

        {/* Colonne gauche */}
        <div className={styles.atlanticLeft}>
          {heroAside.slice(0, 2).map((item) => (
            <Link key={item.slug} href={`/articles/${item.slug}`} className={styles.atlanticSideItem}>
              {item.image && <img src={item.image} alt={item.title} className={styles.atlanticSideImg} />}
              <span className={styles.atlanticSideCat} style={{ color: categoryColors[item.category] }}>{item.categoryLabel}</span>
              <div className={styles.atlanticSideTitle} dangerouslySetInnerHTML={{ __html: item.title }} />
              <div className={styles.atlanticSideExcerpt}>{(item as any).excerpt || item.description}</div>
            </Link>
          ))}
        </div>

        {/* Centre — logo + Grand Entretien */}
        <div className={styles.atlanticCenter}>
          {/* B1 — C */}
          <div className={styles.cb1}>
            <div className={styles.atlanticLogo}><em>C</em></div>
          </div>

          {/* B2 — Grand Entretien */}
          <div className={styles.cb2}>
            <span className={styles.atlanticMainTag}>Grand Entretien &nbsp;·&nbsp; N°1</span>
            <div className={styles.atlanticDivider} />
          </div>

          {/* B3 — Photo */}
          <div className={styles.cb3}>
            <img src="/portraits/diarra.png" alt="Cheick Modibo Diarra" className={styles.atlanticMainImg} />
          </div>

          {/* B4 — Texte */}
          <Link href="/entretien/diarra" className={styles.cb4}>
            <h2 className={styles.atlanticMainTitle}>Cheick Modibo <em>Diarra</em></h2>
            <p className={styles.atlanticMainDeck}>Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali. L'entretien inaugural de Prisme.</p>
            <span className={styles.atlanticMainCta}>Lire dès la parution →</span>
          </Link>
        </div>

        {/* Colonne droite — vignettes */}
        <div style={{borderLeft:'1px solid #DDD9D2',paddingLeft:'32px',display:'flex',flexDirection:'column',gap:'0',padding:'32px 0 32px 32px'}}>
          {rightCol.map((item) => (
            <Link key={item.slug} href={`/articles/${item.slug}`} style={{display:'flex',flexDirection:'row',alignItems:'flex-start',gap:'14px',textDecoration:'none',padding:'16px 0',borderBottom:'1px solid #EEE8E0'}}>
              <div style={{flex:1,display:'flex',flexDirection:'column',gap:'4px'}}>
                <span style={{fontSize:'9px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:categoryColors[item.category]}}>{item.categoryLabel}</span>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'15px',fontWeight:700,color:'#1a1a1a',lineHeight:1.3}} dangerouslySetInnerHTML={{ __html: item.title }} />
                <div style={{fontSize:'12px',color:'#888',lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.description}</div>
              </div>
              {item.image && <img src={item.image} alt={item.title} style={{width:'72px',height:'72px',objectFit:'cover',flexShrink:0}} />}
            </Link>
          ))}
        </div>

      </section>
      </FadeSection>

      {/* GRANDS FORMATS */}
      <FadeSection delay={0.05}>
      <section className={styles.gfSection}>
        <div className={styles.gfHeader}> <span className={styles.gfLabel}>Grands formats</span> <span className={styles.gfSub}>Lectures de fond · 12–18 min</span>
        </div>
        <StaggerGrid className={styles.gfGrid}>
          {grandsFormats.map((article, i) => (
            <StaggerItem key={article.slug} index={i}>
            <Link href={(article as typeof article & {customRoute?:string}).customRoute || `/articles/${article.slug}`} className={`${styles.gfCard} ${styles[article.categories[0].color]}`}>
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
                ))} <span className={styles.gfFormat}>Grand format</span> <span className={styles.gfReading}>{isNaN(parseInt(article.readTime)) ? article.readTime : `${article.readTime} min`}</span>
              </div>
              <div className={styles.gfTitle}><span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
              <p className={styles.gfDeck}>{article.description}</p>
              <div className={styles.gfFooter}> <span className={styles.gfSections}>{article.sections}</span> <span className={styles.gfCta} style={{ color: categoryColors[article.categories[0].color] }}>
                  Lire l'analyse →
                </span>
              </div>
            </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
      </FadeSection>

      {/* ── CHAÎNE CONFINS ── */}
      <FadeSection>
        <ConfinsTV />
      </FadeSection>

      {/* ── MANIFESTE ── */}
      <FadeSection>
      <section className={styles.manifeste}>
        <p className={styles.manifesteText}>
          Confins est un média d'analyse indépendant. Pas un agrégateur. Pas un éditorialiste de plus.
          Un outil pour comprendre ce qui se passe vraiment — sans algorithme, sans actionnaire, sans bruit.
        </p>
        <div className={styles.manifesteMeta}>
          <span>30 analyses publiées</span>
          <span className={styles.manifesteDot}>·</span>
          <span>11 contributeurs</span>
          <span className={styles.manifesteDot}>·</span>
          <span>Fondé en 2026</span>
        </div>
      </section>
      </FadeSection>

      {/* ── À LA UNE — NYT hero layout ── */}
      <FadeSection>
      <section className={styles.uneSection}>
        <div className={styles.uneLabel}>À la une</div>
        {(() => {
          const featured = (articlesData as any[]).filter((a: any) => a.featured)
          const hero = featured[0]
          const rest = featured.slice(1)
          if (!hero) return null
          return (
            <>
              {/* HERO — pleine largeur */}
              <Link href={`/articles/${hero.slug}`} className={styles.uneHero}>
                {hero.image && (
                  <div className={styles.uneHeroImg}>
                    <img
                      src={hero.image}
                      alt={hero.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
                    />
                    <div className={styles.uneHeroOverlay} />
                  </div>
                )}
                <div className={styles.uneHeroBody}> <span className={styles.uneHeroTag} style={{ background: categoryColors[hero.category] }}>
                    {categoryLabels[hero.category] || hero.category}
                  </span>
                  <h2 className={styles.uneHeroTitle} dangerouslySetInnerHTML={{ __html: hero.title }} />
                  {hero.description && <p className={styles.uneHeroDesc}>{hero.description}</p>}
                  <div className={styles.uneHeroMeta}> <span>{hero.author || 'Steve Moradel'}</span> <span className={styles.uneHeroDot}>·</span> <span>{isNaN(parseInt(hero.readTime)) ? hero.readTime : `${hero.readTime} min de lecture`}</span>
                  </div>
                </div>
              </Link>

              {/* GRILLE — articles suivants */}
              {rest.length > 0 && (
                <div className={styles.uneGrid}>
                  {rest.map((article: any) => (
                    <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.uneCard}>
                      {article.image && (
                        <div className={styles.uneCardImg}>
                          <img src={article.image} alt={article.title} />
                        </div>
                      )}
                      <div className={styles.uneCardBody}> <span className={styles.uneCardTag} style={{ color: categoryColors[article.category] }}>
                          {categoryLabels[article.category] || article.category}
                        </span>
                        <div className={styles.uneCardTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
                        {article.description && <p className={styles.uneCardDesc}>{article.description}</p>} <span className={styles.uneCardMeta}>{isNaN(parseInt(article.readTime)) ? article.readTime : `${article.readTime} min`} · {article.author || 'Steve Moradel'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </section>
      </FadeSection>

      {/* ── DERNIÈRES PUBLICATIONS + POPULAIRES — layout Atlantic ── */}
      <FadeSection>
      <section className={styles.atlanticSection}>
        <div className={styles.atlanticInner}>

          {/* COLONNE GAUCHE — Dernières */}
          <div className={styles.atlanticLeft}>
            <div className={styles.atlanticHead}> <span className={styles.atlanticLabel}>Dernières publications</span>
              <Link href="/geo" className={styles.atlanticSeeAll}>Tout voir →</Link>
            </div>
            {(articlesData as any[])
              .filter((a: any) => !a.featured)
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 6)
              .map((article: any) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.atlanticItem}>
                <img src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120'} alt={article.title} className={styles.atlanticThumb} />
                <div className={styles.atlanticItemBody}> <span className={styles.atlanticItemCat} style={{ color: categoryColors[article.category] }}>
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <div className={styles.atlanticItemTitle}> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
                  {article.author && <div className={styles.atlanticItemAuthor}>{article.author}</div>}
                </div>
              </Link>
            ))}
          </div>

          {/* COLONNE DROITE — Populaires */}
          <div className={styles.atlanticRight}>
            <div className={styles.atlanticHead}> <span className={styles.atlanticLabel}>Populaires</span>
            </div>
            {(articlesData as any[])
              .filter((a: any) => ['arctique', 'moreno', 'lecture', 'chine', 'empires'].includes(a.slug))
              .sort((a: any, b: any) => ['arctique', 'moreno', 'lecture', 'chine', 'empires'].indexOf(a.slug) - ['arctique', 'moreno', 'lecture', 'chine', 'empires'].indexOf(b.slug))
              .slice(0, 5)
              .map((article: any, i: number) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.popularItem}> <span className={styles.popularNum}>{i + 1}</span>
                <div className={styles.popularBody}>
                  <div className={styles.popularTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
                  {article.author && <div className={styles.popularAuthor}>{article.author}</div>}
                </div>
              </Link>
            ))}
          </div>

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
              <div className={styles.portraitBody}> <span className={styles.portraitTag} style={{ color: 'var(--portrait)' }}>Portrait</span>
                <div className={styles.portraitTitle}>{article.title}</div>
                <p className={styles.portraitDesc}>{article.description}</p> <span className={styles.portraitCta}>Lire →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ── NEWSLETTER HOME ── */}
      <FadeSection>
      <section className={styles.nlSection}>
        <div className={styles.nlInner}>
          <div className={styles.nlText}>
            <div className={styles.nlLabel}>Confins · Newsletter</div>
            <div className={styles.nlTitle}>L'analyse qui manque<br />à votre semaine</div>
            <p className={styles.nlDesc}>Grands formats, Signal, Portraits — sans algorithme, sans bruit. Chaque semaine.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
      </FadeSection>

      {/* ── SIGNAL ── */}
      <FadeSection>
      <section className={styles.signalSection}>
        <div className={styles.signalHead}>
          <div className={styles.signalLabel}> <span className={styles.signalDot} />
            Signal
          </div>
          <Link href="/signal" className={styles.signalSeeAll}>Tout le signal →</Link>
        </div>
        <div className={styles.signalGrid}>
          {signalItems.map((item, i) => (
            <Link key={i} href="/signal" className={styles.signalItem}> <span className={styles.signalCat} style={{ color: item.color }}>{item.cat}</span> <span className={styles.signalDate}>{item.date}</span>
              <div className={styles.signalHeadline}>{item.headline}</div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

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
