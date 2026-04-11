export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import SoaraTV from '../components/SoaraTV'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, FadeCard, StaggerGrid, StaggerItem, HeroParallax } from './HomeClient'
import Ticker from './TickerClient'
import { EnCeMoment, StatCount, AnimatedGrain } from './HomeEnhancements'
import HeroSlider from '../components/HeroSlider'

const signalItems = [
  { cat: 'Moyen-Orient', color: 'var(--geo)', headline: "Cessez-le-feu Iran–États-Unis — 3e jour fragile, sirènes en Israël après tirs de roquettes du Liban, Netanyahu dit «le doigt sur la gâchette»", date: '10 avril' },
  { cat: 'Détroit d\'Ormuz', color: 'var(--geo)', headline: "Trump met en garde l'Iran contre tout péage dans le détroit d'Ormuz — «Ce n'est pas l'accord que nous avons», dit-il sur Truth Social", date: '10 avril' },
  { cat: 'Liban', color: 'var(--geo)', headline: "Pourparlers Israël–Liban prévus la semaine prochaine à Washington — 303 morts dans les frappes israéliennes de mercredi, le Hezbollah revendique des tirs en représailles", date: '10 avril' },
  { cat: 'Iran', color: 'var(--geo)', headline: "Négociations Iran–États-Unis à Islamabad dès vendredi — Téhéran exige enrichissement de l'uranium, retrait américain du Golfe et réparations de guerre dans son plan en 10 points", date: '10 avril' },
  { cat: 'Énergie', color: 'var(--eco)', headline: "Pétrole — baril de Brent remonte à 96,77 $ après la trêve, trafic dans le détroit d'Ormuz reste très limité, deux navires non-iraniens autorisés", date: '10 avril' },
  { cat: 'Koweït', color: 'var(--geo)', headline: "Premier drone attack dans le Golfe depuis le cessez-le-feu — les défenses aériennes koweïtiennes activées, «installations vitales» visées", date: '10 avril' },
  { cat: 'Ukraine', color: 'var(--geo)', headline: "Poutine annonce un cessez-le-feu de 48h pour la Pâque orthodoxe — Zelensky maintient les experts en drones ukrainiens déployés au Moyen-Orient", date: '10 avril' },
  { cat: 'Géopolitique', color: 'var(--geo)', headline: "«L'Iran a remporté une grande victoire» — Moscou et Pékin jubilent, un axe Chine–Iran–Russie contrôlant 30% du pétrole mondial inquiète Washington", date: '10 avril' },
  { cat: 'Tarifs', color: 'var(--eco)', headline: "Trump suspend 90 jours de droits de douane sur la plupart des partenaires commerciaux, maintient 145% sur la Chine — les Bourses rebondissent fortement", date: '10 avril' },
  { cat: 'Soudan', color: 'var(--geo)', headline: "Soudan — les FSR renforcent leur emprise sur le Darfour, l'ONU dénonce la pire crise humanitaire mondiale, 14 millions de déplacés", date: '10 avril' },
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
const rightColSlugs = ['chine', 'taiwan', 'semico', 'orbite']
const rightCol = rightColSlugs.map(slug => getArticle(slug))
const heroAside = heroAsideSlugs.map(slug => {
  const a = getArticle(slug)
  return { ...a, excerpt: a.description }
})

const grandsFormatsSlugs = [
  { slug: 'chambre-ratification', extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '5 sections · 4 illustrations' },
  { slug: 'skunkworks',           extraCategories: [{ label: 'Technologie', color: 'tech' }], sections: '5 sections · 5 illustrations' },
  { slug: 'dette-souveraine',     extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '6 sections · données en temps réel' },
  { slug: 'france_maritime',      extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '7 sections · 12 sources' },
  { slug: 'eau',                  extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '8 sections · 11 sources' },
  { slug: 'techgeo',              extraCategories: [{ label: 'Technologie', color: 'tech' }], sections: '7 sections · 16 sources' },
  { slug: 'taiwan',               extraCategories: [{ label: 'Géopolitique', color: 'geo' }], sections: '6 sections · 10 sources' },
  { slug: 'semico',               extraCategories: [{ label: 'Technologie', color: 'tech' }], sections: '6 sections · 10 sources' },
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

      {/* ── À LA UNE — slider ── */}
      <FadeSection>
      <section className={styles.uneSection}>
        <div className={styles.uneLabel}>À la une</div>
        {(() => {
          const featured = (articlesData as any[]).filter((a: any) => a.featured)
          const sliderArticles = featured.slice(0, 4)
          const rest = featured.slice(4)
          return (
            <>
              <HeroSlider articles={sliderArticles} />
              {rest.length > 0 && (
                <div className={styles.uneGrid}>
                  {rest.map((article: any) => (
                    <Link key={article.slug} href={article.grandFormatUrl || `/articles/${article.slug}`} className={styles.uneCard}>
                      {article.image && (
                        <div className={styles.uneCardImg}>
                          <img src={article.image} alt={article.title} />
                        </div>
                      )}
                      <div className={styles.uneCardBody}>
                        <span className={styles.uneCardTag} style={{ color: categoryColors[article.category] }}>
                          {categoryLabels[article.category] || article.category}
                        </span>
                        <div className={styles.uneCardTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
                        {article.description && <p className={styles.uneCardDesc}>{article.description}</p>}
                        <span className={styles.uneCardMeta}>{isNaN(parseInt(article.readTime)) ? article.readTime : `${article.readTime} min`} · {article.author || 'Steve Moradel'}</span>
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

      {/* ATLANTIC HERO */}
      <FadeSection>
      <section className={styles.atlanticHero}>

        {/* Colonne gauche */}
        <div className={styles.atlanticLeft}>
          {heroAside.slice(0, 2).map((item) => (
            <Link key={item.slug} href={`/articles/${item.slug}`} className={styles.atlanticSideItem}>
              {item.image && <img src={item.image} alt={item.title} className={styles.atlanticSideImg} />}
              <span className={styles.atlanticSideCat} style={{ color: categoryColors[item.category] }}>{item.categoryLabel}</span>
              <div className={styles.atlanticSideTitle}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",background:"#0a0a0a",color:"#C8A96E",fontFamily:"'DM Sans',sans-serif",fontSize:"8px",fontWeight:700,lineHeight:1,marginRight:"6px",flexShrink:0,verticalAlign:"middle",position:"relative",top:"-1px"}}>S</span><span dangerouslySetInnerHTML={{ __html: item.title }} /></div>
              <div className={styles.atlanticSideExcerpt}>{(item as any).excerpt || item.description}</div>
            </Link>
          ))}
        </div>

        {/* Centre — logo + Grand Entretien */}
        <div className={styles.atlanticCenter}>
          {/* B1+B2 — bandeau bordeaux */}
          <div style={{ width: '100%', background: '#8B1A1A', padding: '20px 16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '56px', fontWeight: 700, color: '#F5E6D0', lineHeight: 1, fontStyle: 'italic' }}>S</div>
            <div style={{ width: '32px', height: '1px', background: 'rgba(245,230,208,0.4)', margin: '2px 0' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#F5E6D0' }}>Grand Entretien &nbsp;·&nbsp; N°1</span>
          </div>

          {/* B3 — Photo */}
          <div className={styles.cb3}>
            <img src="/portraits/diarra.png" alt="Cheick Modibo Diarra" className={styles.atlanticMainImg} />
          </div>

          {/* B4 — Texte */}
          <Link href="/entretien/diarra" className={styles.cb4}>
            <h2 className={styles.atlanticMainTitle}>Cheick Modibo <em>Diarra</em></h2>
            <p className={styles.atlanticMainDeck} style={{textAlign:'left'}}>Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali.<br />L'entretien inaugural de Soara.</p>
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
              {item.image && <img src={item.image} alt={item.title} style={{width:'140px',height:'100px',objectFit:'cover',flexShrink:0}} />}
            </Link>
          ))}
        </div>

      </section>
      </FadeSection>

      {/* GRANDS FORMATS */}
      <FadeSection delay={0.05}>
      <section className={styles.gfSection}>
        <div style={{ background: '#0D1F3C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#E8D9C0' }}>Grands formats</span>
          <span style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,217,192,0.65)' }}>Lectures de fond · 12–18 min</span>
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
              <div className={styles.gfTitle}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",background:"#0a0a0a",color:"#C8A96E",fontFamily:"'DM Sans',sans-serif",fontSize:"8px",fontWeight:700,lineHeight:1,marginRight:"6px",flexShrink:0,verticalAlign:"middle",position:"relative",top:"-1px"}}>S</span><span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
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

      {/* ── SOARA TV ── */}
      <FadeSection>
        <div style={{ background: '#0D1F3C', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#E8D9C0' }}>Soara TV</span>
          <span style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,217,192,0.5)' }}>Analyses en mouvement</span>
        </div>
        <SoaraTV />
      </FadeSection>

      {/* ── MANIFESTE ── */}
      <FadeSection>
      <section className={styles.manifeste}>
        <p className={styles.manifesteText}>
          Soara est un média d'analyse indépendant. Pas un agrégateur. Pas un éditorialiste de plus.
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
                  <div className={styles.atlanticItemTitle}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",background:"#0a0a0a",color:"#C8A96E",fontFamily:"'DM Sans',sans-serif",fontSize:"8px",fontWeight:700,lineHeight:1,marginRight:"6px",flexShrink:0,verticalAlign:"middle",position:"relative",top:"-1px"}}>S</span><span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
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
                  <div className={styles.popularTitle}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",background:"#0a0a0a",color:"#C8A96E",fontFamily:"'DM Sans',sans-serif",fontSize:"8px",fontWeight:700,lineHeight:1,marginRight:"6px",flexShrink:0,verticalAlign:"middle",position:"relative",top:"-1px"}}>S</span><span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
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
            getArticle('obama'),
            getArticle('musk'),
            getArticle('morrison'),
            getArticle('nooyi'),
            getArticle('morin'),
          ].map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.portraitCard}>
              <div className={styles.portraitImgWrap}>
                <img src={article.image} alt={article.title} className={styles.portraitImg} />
              </div>
              <div className={styles.portraitBody}> <span className={styles.portraitTag} style={{ color: 'var(--portrait)' }}>Portrait</span>
                <div className={styles.portraitTitle} dangerouslySetInnerHTML={{ __html: article.title }} />
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
            <div className={styles.nlLabel}>Soara · Newsletter</div>
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
        <div className={styles.footerLogo}>So<em>ara</em></div>
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
// Wed Apr  8 12:29:54 UTC 2026
