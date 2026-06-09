export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroInline from '../components/HeroInline'
import PictureImg from '../components/PictureImg'
import SoaraUnivers from '../components/SoaraUnivers'
import BibliothequeHome from '../components/BibliothequeHome'
import AdSlot from '../components/AdSlot'
import HomeInterviewBanner from '../components/HomeInterviewBanner'
import { FleuronIcon } from '../components/LettresIcons'
import { getActiveAd } from '../lib/ads'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, PortraitsSlider } from './HomeClient'
import Ticker from './TickerClient'
import {
  dailySeed, slotSeed, pickFromPool, seededShuffle,
  parseDateOverride, applyHourOverride,
} from '../lib/rotation'
import {
  HERO_POOL, UNDER_HERO_POOL, GF_POOL_AFTER_LEAD,
  ALSO_READ_POOL, ATLAS_POOL, POPULAR_POOL,
} from '../lib/home-pools'

// ── Helpers ───────────────────────────────────────────────
const CAT: Record<string,string> = {
  geo:'Géopolitique', eco:'Économie', tech:'Technologie',
  env:'Environnement', soc:'Société', culture:'Culture',
  portrait:'Portrait',
}
function art(slug: string) {
  const a = (articlesData as any[]).find(x => x.slug === slug)!
  return { ...a, catLabel: CAT[a.category] || a.category }
}
function withCatLabel<T extends { category: string }>(a: T) {
  return { ...a, catLabel: CAT[a.category] || a.category }
}

// LEAD et 1er SECONDAIRE des grands formats : jugement éditorial figé.
const GF_LEAD_SLUG = 'chambre-ratification'
const GF_SECONDARY_1_SLUG = 'terres-rares'

// TV : 6 épisodes fixes (catalogue clos, peu de valeur à faire tourner).
const TV_EPISODES = [
  { id:'01', title:"L'Inde, le siècle qui vient",             duration:'1 min 19', href:'/tv?ep=01', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_inde_final-1_hitfsr.jpg' },
  { id:'02', title:"L'Afrique : ce qu'on ne vous a pas appris",duration:'2 min 02', href:'/tv?ep=02', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_afrique_ep2-1_xp6mvu.jpg' },
  { id:'03', title:"La biologie devient un logiciel",          duration:'2 min 07', href:'/tv?ep=03', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_biologie_ep3_ouqzr4.jpg' },
  { id:'04', title:"L'arme qui a failli nous tuer",            duration:'2 min 25', href:'/tv?ep=04', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_arme_ep4_eo7uyk.jpg' },
  { id:'05', title:"8 hommes. 3,5 milliards.",                  duration:'2 min 07', href:'/tv?ep=05', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg' },
  { id:'06', title:"Nous sommes l'astéroïde",                  duration:'1 min 49', href:'/tv?ep=06', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_asteroide_ep6_qkipn3.jpg' },
]

const PORTRAITS_BASE = ['morin','obama','morrison','musk','tutu','nooyi'].map(art)

// ── Composants atomiques ──────────────────────────────────
function ReadTime({ t }: { t: string }) {
  const n = parseInt(t)
  return <span className={styles.readTime}>{isNaN(n) ? t : `${n} min`}</span>
}

const EN_SLUGS = new Set(["societe-du-consentement","ceux-qui-nont-pas-cede","empire-du-droit","terres-rares","moreno","afrique","arctique","blackrock","chine","cygne","empires","fiscalite","fragilite","france_maritime","ia","ia_ecriture","kintsugi","lecture","medias","morrison","morin","tutu","musk","nooyi","pessimisme","predateurs","reseaux","rushkoff","semico","silence","taiwan","technosolutionnisme","venezuela","orbite","obama","wanghuning","monopoly","darkfactories","eau","techgeo","dette-souveraine","palantir","skunkworks","chambre-ratification","pollinisation","ce-que-nous-laissons-entrer"])

const EnBadge = () => (
  <span style={{display:'inline-flex',alignItems:'center',gap:'3px',fontSize:'9px',fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:'1.5px',color:'#C8A96E',textTransform:'uppercase',verticalAlign:'middle',marginLeft:'6px',flexShrink:0}}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    EN
  </span>
)

const SBADGE_SIZES = {
  sm: { box: 14, fs: 8,  mr: 5,  top: -1 },
  md: { box: 18, fs: 10, mr: 7,  top: -2 },
  lg: { box: 26, fs: 14, mr: 10, top: -3 },
} as const
const SBadge = ({ size = 'sm' }: { size?: keyof typeof SBADGE_SIZES }) => {
  const d = SBADGE_SIZES[size]
  return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:`${d.box}px`,height:`${d.box}px`,background:'#0A0A0A',color:'#C8A96E',fontFamily:"'DM Sans',sans-serif",fontSize:`${d.fs}px`,fontWeight:700,lineHeight:1,marginRight:`${d.mr}px`,flexShrink:0,verticalAlign:'middle',position:'relative',top:`${d.top}px`}}>S</span>
  )
}

function SectionHead({ label, href }: { label: string; href?: string }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionHeadLabel}>{label}</span>
      {href && <Link href={href} className={styles.sectionHeadAll}>Tout voir</Link>}
    </div>
  )
}

// Bandeau discret affiché en haut de page si ?date= ou ?hour= est utilisé.
// Permet à Steve de vérifier qu'il prévisualise bien un autre jour.
function PreviewPin({ date, hour }: { date?: string; hour?: string }) {
  if (!date && !hour) return null
  return (
    <div style={{
      background:'#C8A96E', color:'#0A0A0A',
      fontFamily:"'DM Mono', ui-monospace, monospace",
      fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase',
      padding:'6px 16px', textAlign:'center',
      borderBottom:'1px solid #0A0A0A',
    }}>
      Preview de rotation · seed simulé {date ? `date=${date}` : ''}{hour ? ` hour=${hour}` : ''} · rendu réel à {new Date().toISOString().slice(0,10)}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
export default async function HomePage({
  searchParams,
}: {
  searchParams?: { date?: string; hour?: string }
}) {
  const homeAd = await getActiveAd('home')

  // ── Seeds ──────────────────────────────────────────────
  // ?date=YYYYMMDD et ?hour=0-23 servent à prévisualiser la rotation
  // d'autres jours sans attendre. Sans paramètre, seed = jour courant.
  const dateOverride = parseDateOverride(searchParams?.date)
  const baseDate = dateOverride ?? new Date()
  const refDate = applyHourOverride(baseDate, searchParams?.hour)
  const daily = dailySeed(refDate)
  const slot4h = slotSeed(4, refDate)

  // ── Tirages déterministes ──────────────────────────────
  // On consomme les pools dans l'ordre éditorial. Chaque article tiré
  // entre dans `used` pour éviter les doublons sur la home (règle
  // historique : un article max 2 fois sur la page).
  const used = new Set<string>([GF_LEAD_SLUG, GF_SECONDARY_1_SLUG])
  const excludeArt = <T extends { slug: string }>(pool: readonly T[]) =>
    pool.filter(a => !used.has(a.slug))
  const consume = <T extends { slug: string }>(items: T[]) => {
    items.forEach(a => used.add(a.slug))
    return items
  }

  // Hero rotatif (6 articles, diversifié sur 3 catégories min)
  const HERO_ROTATION = consume(
    pickFromPool(excludeArt(HERO_POOL), `${daily}:hero`, 6, {
      diversifyBy: (a: any) => a.category, minDiversity: 3,
    })
  ).map(withCatLabel)

  // Sous le hero : 3 à gauche, 2 à droite (avec image)
  const withImagePool = (UNDER_HERO_POOL as any[]).filter(a => a.image)
  const UNDER_HERO_LEFT = consume(
    pickFromPool(excludeArt(UNDER_HERO_POOL), `${daily}:under-left`, 3, {
      diversifyBy: (a: any) => a.category, minDiversity: 3,
    })
  ).map(withCatLabel)
  const UNDER_HERO_RIGHT = consume(
    pickFromPool(excludeArt(withImagePool), `${daily}:under-right`, 2, {
      diversifyBy: (a: any) => a.category, minDiversity: 2,
    })
  ).map(withCatLabel)

  // Grands formats : LEAD + SECONDARY1 figés, le reste tourne
  const GF_LEAD = art(GF_LEAD_SLUG)
  const GF_SECONDARY_1 = art(GF_SECONDARY_1_SLUG)
  const GF_SECONDARY_2 = consume(
    pickFromPool(excludeArt(GF_POOL_AFTER_LEAD), `${daily}:gf-sec2`, 1)
  ).map(withCatLabel)[0]
  const GF_SECONDARY = [GF_SECONDARY_1, GF_SECONDARY_2]
  const GF_TERTIARY = consume(
    pickFromPool(excludeArt(GF_POOL_AFTER_LEAD), `${daily}:gf-tert`, 3, {
      diversifyBy: (a: any) => a.category, minDiversity: 2,
    })
  ).map(withCatLabel)
  const GF_QUATERNARY = consume(
    pickFromPool(excludeArt(GF_POOL_AFTER_LEAD), `${daily}:gf-quat`, 6, {
      diversifyBy: (a: any) => a.category, minDiversity: 3,
    })
  ).map(withCatLabel)

  // À lire aussi (zone 1 colonne gauche)
  const ZONE1_ALSO_READ = consume(
    pickFromPool(excludeArt(ALSO_READ_POOL), `${daily}:also-read`, 3, {
      diversifyBy: (a: any) => a.category, minDiversity: 2,
    })
  ).map(withCatLabel)

  // Atlas (3 cartes, pas d'exclusion : ce ne sont pas des articles)
  const ZONE1_ATLAS = pickFromPool(ATLAS_POOL, `${daily}:atlas`, 3)

  // Dernières publications : 3 plus récents par date + 2 redécouvertes seedées
  const allArticles = articlesData as any[]
  const recentByDate = allArticles
    .filter(a => !a.featured && !a.interviewType && !used.has(a.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const LATEST_RECENT = consume(recentByDate.slice(0, 3)).map(withCatLabel)

  const thirtyDaysAgo = refDate.getTime() - 30 * 86400 * 1000
  const olderPool = allArticles.filter(a =>
    !a.featured && !a.interviewType && !used.has(a.slug)
    && new Date(a.date).getTime() < thirtyDaysAgo
  )
  const LATEST_REDISCOVER = consume(
    pickFromPool(olderPool, `${daily}:latest-redisc`, 2, {
      diversifyBy: (a: any) => a.category, minDiversity: 2,
    })
  ).map(withCatLabel)
  const LATEST = [...LATEST_RECENT, ...LATEST_REDISCOVER]

  // POPULAR (tourne toutes les 4h)
  // Les plus lus est un axe de popularité indépendant : un article peut y
  // figurer même s'il apparaît ailleurs sur la home. On préfère les non-
  // déjà-affichés, puis on complète depuis le pool complet pour atteindre
  // la cible de 5. POPULAR ne consomme PAS used : la section ne se vide
  // jamais et REDISCOVER (tiré après) garde son pool intact.
  const POPULAR_TARGET = 5
  const popularPrefer = pickFromPool(excludeArt(POPULAR_POOL), `${slot4h}:popular`, POPULAR_TARGET, {
    diversifyBy: (a: any) => a.category, minDiversity: 3,
  })
  let popularList: any[] = popularPrefer
  if (popularList.length < POPULAR_TARGET) {
    const have = new Set(popularList.map(a => a.slug))
    const fill = pickFromPool(
      POPULAR_POOL.filter(a => !have.has(a.slug)),
      `${slot4h}:popular-fill`,
      POPULAR_TARGET - popularList.length,
      { diversifyBy: (a: any) => a.category, minDiversity: 2 }
    )
    popularList = [...popularList, ...fill]
  }
  const POPULAR = popularList.map(withCatLabel)

  // Portraits : 6 articles, simple shuffle journalier de l'ordre
  const PORTRAITS = seededShuffle(PORTRAITS_BASE, `${daily}:portraits`)

  // À redécouvrir (bas de home) : 3 articles >30j, diversifiés
  const rediscoverPool = allArticles.filter(a =>
    !a.interviewType && !used.has(a.slug)
    && new Date(a.date).getTime() < thirtyDaysAgo
  )
  const REDISCOVER = pickFromPool(rediscoverPool, `${daily}:rediscover-zone`, 3, {
    diversifyBy: (a: any) => a.category, minDiversity: 3,
  }).map(withCatLabel)

  return (
    <>
      <Header />
      <PreviewPin date={searchParams?.date} hour={searchParams?.hour} />
      <Ticker />

      {/* ══════════════════════════════════════
          1. HOME TOP , Grille NYT 3 colonnes
      ══════════════════════════════════════ */}
      <section className={styles.homeTop}>
        <aside className={styles.homeTopLeft}>
          {UNDER_HERO_LEFT.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.htSideItem} data-cat={a.category}>
              <span className={styles.cat}>{a.catLabel}</span>
              <h3 className={styles.htSideTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
              {a.description && <p className={styles.htSideDesc}>{a.description}</p>}
              <span style={{display:'inline-flex',alignItems:'center'}}><ReadTime t={a.readTime || '7'} />{EN_SLUGS.has(a.slug) && <EnBadge />}</span>
            </Link>
          ))}

          <div className={styles.zone1AlsoRead}>
            <span className={styles.zone1AlsoReadLabel}>À lire aussi</span>
            <ul className={styles.zone1AlsoReadList}>
              {ZONE1_ALSO_READ.map(a => (
                <li key={a.slug} className={styles.zone1AlsoReadItem}>
                  <Link href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.zone1AlsoReadLink} data-cat={a.category}>
                    <span className={styles.zone1AlsoReadCat}>{a.catLabel}</span>
                    <span className={styles.zone1AlsoReadTitle} dangerouslySetInnerHTML={{__html: a.title}} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className={styles.zone1Quote}>
            <p className={styles.zone1QuoteText}>
              «&nbsp;Ce qui nous oblige à penser autrement, ce n'est pas l'événement mais la durée.&nbsp;»
            </p>
            <cite className={styles.zone1QuoteCite}>Soara</cite>
          </blockquote>

          <div className={styles.zone1Newsletter}>
            <span className={styles.zone1NewsletterEyebrow}>La lettre du mardi</span>
            <h3 className={styles.zone1NewsletterTitle}>L'analyse qui manque à votre semaine</h3>
            <p className={styles.zone1NewsletterTeaser}>
              Une lecture longue chaque mardi matin. Sans algorithme, sans bruit.
            </p>
            <Link href="/abonnement" className={styles.zone1NewsletterCta}>
              S'abonner gratuitement →
            </Link>
            <Link href="/lettres" className={styles.zone1NewsletterArchive}>
              <FleuronIcon width={14} height={14} />
              <span>Lire les lettres</span>
            </Link>
          </div>
        </aside>

        <div className={styles.homeTopCenter}>
          <HeroInline articles={HERO_ROTATION} intervalMs={7000} />
          <HomeInterviewBanner />
        </div>

        <aside className={styles.homeTopRight}>
          {UNDER_HERO_RIGHT.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.htRightItem} data-cat={a.category}>
              {a.image && (
                <div className={styles.htRightImg}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <span className={styles.cat}>{a.catLabel}</span>
              <h3 className={styles.htRightTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
              {a.description && <p className={styles.htRightDesc}>{a.description}</p>}
              <span style={{display:'inline-flex',alignItems:'center'}}><ReadTime t={a.readTime || '7'} />{EN_SLUGS.has(a.slug) && <EnBadge />}</span>
            </Link>
          ))}
          {homeAd && (
            <div className={styles.homeTopAdSlot}>
              <AdSlot slotId="home" variant="sidebar" preloadedAd={homeAd} />
            </div>
          )}
        </aside>
      </section>

      {/* ══════════════════════════════════════
          2. ATLAS , bande pleine largeur
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.atlasSection}>
        <div className={styles.atlasSectionHead}>
          <div>
            <span className={styles.atlasSectionEyebrow}>Atlas</span>
            <h2 className={styles.atlasSectionTitle}>Cartes pour <em>comprendre</em></h2>
            <p className={styles.atlasSectionIntro}>
              Des visualisations interactives pour traverser ce que les mots ne suffisent pas à dire.
            </p>
          </div>
          <Link href="/visuels" className={styles.atlasSectionAll}>Toutes les cartes →</Link>
        </div>
        <div className={styles.atlasSectionGrid}>
          {ZONE1_ATLAS.map(card => (
            <Link
              key={card.href}
              href={card.href}
              className={styles.atlasSectionCard}
            >
              <div className={styles.atlasSectionImg}>
                <img src={card.image} alt={card.title} loading="lazy" />
              </div>
              <span className={styles.atlasSectionTag}>{card.tag}</span>
              <h4 className={styles.atlasSectionTitle2}>{card.title}</h4>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          3. GRANDS FORMATS
      ══════════════════════════════════════ */}
      <SectionHead label="Grands formats" href="/grands-formats" />
      <FadeSection>
      <section className={styles.gfSection}>
        <Link href={GF_LEAD.grandFormatUrl || `/articles/${GF_LEAD.slug}`} className={styles.gfLead}>
          {GF_LEAD.image && (
            <div className={styles.gfLeadImg}>
              <img src={GF_LEAD.image} alt={GF_LEAD.title} />
            </div>
          )}
          <div className={styles.gfLeadBody}>
            <span className={styles.gfLeadEyebrow}>{GF_LEAD.catLabel} · Enquête</span>
            <h3 className={styles.gfLeadTitle}>
              <SBadge size="lg" /><span dangerouslySetInnerHTML={{__html: GF_LEAD.title}} />
            </h3>
            {GF_LEAD.description && (
              <p className={styles.gfLeadDesc}>{GF_LEAD.description}</p>
            )}
            <div className={styles.gfLeadMeta}>
              <ReadTime t={GF_LEAD.readTime || '18'} />
              {EN_SLUGS.has(GF_LEAD.slug) && <EnBadge />}
              <span className={styles.gfLeadCta}>Lire l'enquête →</span>
            </div>
          </div>
        </Link>

        <div className={styles.gfSecondaryRow}>
          {GF_SECONDARY.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfSecondary} data-cat={a.category}>
              {a.image && (
                <div className={styles.gfSecondaryImg}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.gfSecondaryBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.gfSecondaryTitle}>
                  <SBadge size="md" /><span dangerouslySetInnerHTML={{__html: a.title}} />
                </h3>
                {a.description && (
                  <p className={styles.gfSecondaryDesc}>{a.description}</p>
                )}
                <div className={styles.gfMeta}>
                  <ReadTime t={a.readTime || '12'} />
                  {EN_SLUGS.has(a.slug) && <EnBadge />}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.gfFeatureRow}>
          {[...GF_TERTIARY.slice(0, 1), ...GF_QUATERNARY.slice(0, 2)].map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfFeature} data-cat={a.category}>
              {a.image && (
                <div className={styles.gfFeatureImg}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.gfFeatureBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.gfFeatureTitle}>
                  <SBadge size="md" /><span dangerouslySetInnerHTML={{__html: a.title}} />
                </h3>
                {a.description && (
                  <p className={styles.gfFeatureDesc}>{a.description}</p>
                )}
                <div className={styles.gfMeta}>
                  <ReadTime t={a.readTime || '12'} />
                  {EN_SLUGS.has(a.slug) && <EnBadge />}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.gfMoreSection}>
          <span className={styles.gfMoreLabel}>Aussi dans Grands formats</span>
          <ul className={styles.gfMoreList}>
            {[...GF_TERTIARY.slice(1), ...GF_QUATERNARY.slice(2)].map(a => (
              <li key={a.slug} className={styles.gfMoreItem}>
                <Link href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfMoreLink} data-cat={a.category}>
                  <span className={styles.gfMoreCat}>{a.catLabel}</span>
                  <h4 className={styles.gfMoreTitle} dangerouslySetInnerHTML={{__html: a.title}} />
                  <span className={styles.gfMoreMeta}>
                    <ReadTime t={a.readTime || '12'} />
                    {EN_SLUGS.has(a.slug) && <EnBadge />}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          4. SOARA TV
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.tvSection}>
        <div className={styles.tvHeader}>
          <div>
            <div className={styles.tvEyebrow}>Soara · Vidéo</div>
            <h2 className={styles.tvTitle}>Soara <em>TV</em></h2>
            <p className={styles.tvIntro}>Les grandes questions du monde en 60 à 90 secondes. Géopolitique, économie, société, vus autrement.</p>
          </div>
          <Link href="/tv" className={styles.tvSeeAll}>Tous les épisodes →</Link>
        </div>
        <div className={styles.tvLayout}>
          {(() => {
            const featured = TV_EPISODES[TV_EPISODES.length - 1]
            return (
              <Link href={featured.href} className={styles.tvFeatured}>
                <div className={styles.tvFeaturedImg}>
                  <img src={featured.thumb} alt={featured.title} />
                  <div className={styles.tvFeaturedPlay}>
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <circle cx="28" cy="28" r="27" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
                      <path d="M22 18 L40 28 L22 38 Z" fill="#fff"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.tvFeaturedBody}>
                  <span className={styles.tvFeaturedEyebrow}>À l'affiche · Ép. {featured.id}</span>
                  <h3 className={styles.tvFeaturedTitle}>{featured.title}</h3>
                  <span className={styles.tvFeaturedDur}>{featured.duration}</span>
                </div>
              </Link>
            )
          })()}
          <ul className={styles.tvSidelist}>
            {TV_EPISODES.slice(0, -1).reverse().map(ep => (
              <li key={ep.id}>
                <Link href={ep.href} className={styles.tvSideItem}>
                  <div className={styles.tvSideThumb}>
                    <img src={ep.thumb} alt={ep.title} />
                  </div>
                  <div className={styles.tvSideBody}>
                    <span className={styles.tvSideNum}>Ép. {ep.id}</span>
                    <span className={styles.tvSideTitle}>{ep.title}</span>
                    <span className={styles.tvSideDur}>{ep.duration}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          4b. BIBLIOTHÈQUE
      ══════════════════════════════════════ */}
      <FadeSection>
      <BibliothequeHome />
      </FadeSection>

      {/* ══════════════════════════════════════
          5. PORTRAITS
      ══════════════════════════════════════ */}
      <SectionHead label="Portraits" href="/portraits" />
      <FadeSection>
      <section className={styles.portraits}>
        <p className={styles.portraitsIntro}>
          Ils ont façonné leur époque, souvent contre elle. Des hommes et des femmes dont les trajectoires éclairent les grandes fractures du monde contemporain.
        </p>
        <PortraitsSlider articles={PORTRAITS} />
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          6. DERNIÈRES + POPULAIRES
      ══════════════════════════════════════ */}
      <div className={`${styles.row2} ${styles.row2LastSection}`}>
        <div className={styles.rowCol}>
          <SectionHead label="Dernières publications" />
          {LATEST.map((a, i) => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.latestItem2} data-cat={a.category}>
              <div className={styles.latestItem2Bar} style={{width: i === 0 ? '6px' : '5px'}} />
              <div className={styles.rowItemBody}>
                <div className={styles.latestItem2Top}>
                  <span className={styles.cat}>{a.catLabel}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    {i === 0 && <span className={styles.recentTag}>Récent</span>}
                    <span className={styles.latestItem2Date}>
                      {new Date(a.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
                    </span>
                  </div>
                </div>
                <h3 className={styles.rowTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
                <span style={{display:'inline-flex',alignItems:'center'}}><ReadTime t={a.readTime || '7'} />{EN_SLUGS.has(a.slug) && <EnBadge />}</span>
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.rowThumb} />}
            </Link>
          ))}
        </div>

        <div className={styles.rowCol}>
          <SectionHead label="Les plus lus" />
          {POPULAR.map((a, i) => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.popularItem} data-cat={a.category}>
              <span className={styles.popularRank}>0{i + 1}</span>
              <div className={styles.rowItemBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.rowTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
                <ReadTime t={a.readTime || '7'} />
              </div>
              <span className={styles.popularArrow}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          7. À REDÉCOUVRIR , puise dans l'archive (>30 jours)
      ══════════════════════════════════════ */}
      {REDISCOVER.length > 0 && (
        <FadeSection>
        <section className={styles.rediscover}>
          <div className={styles.rediscoverHead}>
            <span className={styles.rediscoverEyebrow}>Choix du jour · Archive</span>
            <h2 className={styles.rediscoverTitle}>À <em>redécouvrir</em></h2>
            <p className={styles.rediscoverIntro}>
              Trois textes parus il y a quelques semaines, replacés en haut de page aujourd'hui.
              Le fond ne périme pas à la même vitesse que l'actualité.
            </p>
          </div>
          <div className={styles.rediscoverGrid}>
            {REDISCOVER.map(a => (
              <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.rediscoverCard} data-cat={a.category}>
                {a.image && (
                  <div className={styles.rediscoverImg}>
                    <img src={a.image} alt={a.title} loading="lazy" />
                  </div>
                )}
                <div className={styles.rediscoverBody}>
                  <span className={styles.cat}>{a.catLabel}</span>
                  <h3 className={styles.rediscoverCardTitle}>
                    <SBadge size="md" /><span dangerouslySetInnerHTML={{__html: a.title}} />
                  </h3>
                  {a.description && (
                    <p className={styles.rediscoverDesc}>{a.description}</p>
                  )}
                  <div className={styles.rediscoverMeta}>
                    <span className={styles.rediscoverDate}>
                      {new Date(a.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <ReadTime t={a.readTime || '7'} />
                    {EN_SLUGS.has(a.slug) && <EnBadge />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </FadeSection>
      )}

      {/* ══════════════════════════════════════
          8. L'UNIVERS SOARA
      ══════════════════════════════════════ */}
      <SoaraUnivers />

      {/* ══════════════════════════════════════
          9. NEWSLETTER
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.nl}>
        <div className={styles.nlInner}>
          <div className={styles.nlEyebrow}>Newsletter</div>
          <h2 className={styles.nlTitle}>L'analyse qui manque à votre semaine</h2>
          <p className={styles.nlDesc}>Sans algorithme, sans bruit. Chaque semaine.</p>
          <NewsletterForm />
          <Link href="/lettres" className={styles.nlArchive}>
            <FleuronIcon width={16} height={16} />
            <span>Lire les lettres →</span>
          </Link>
        </div>
      </section>
      </FadeSection>
    </>
  )
}
