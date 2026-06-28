export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroInline from '../components/HeroInline'
import PictureImg from '../components/PictureImg'
import SoaraUnivers from '../components/SoaraUnivers'
import BibliothequeHome from '../components/BibliothequeHome'
import AdSlot from '../components/AdSlot'
import HomeFeaturedInterviews from '../components/HomeFeaturedInterviews'
// import HomeInterviewsRow from '../components/HomeInterviewsRow' // retiré pour le lancement (réactiver dès 4+ entretiens)
import HomeGrandFormats from '../components/HomeGrandFormats'
import { FleuronIcon } from '../components/LettresIcons'
import { TV_EPISODES } from '../lib/tv-episodes'
import { getActiveAd } from '../lib/ads'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import metaphoresData from '../lib/metaphores.json'
import { isRecent } from '../lib/recency'
import { FadeSection, PortraitsSlider } from './HomeClient'
import Ticker from './TickerClient'
import { randomShuffle, pickRandom } from '../lib/rotation'
import {
  HERO_POOL, UNDER_HERO_POOL, GF_POOL_AFTER_LEAD,
  ALSO_READ_POOL, ATLAS_POOL, POPULAR_POOL,
  GF_LEAD_SLUG, GF_SECONDARY_1_SLUG, HERO_LEAD_SLUG,
  sortByRecency, pickByRecency,
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
function withCatLabel(nowTs: number) {
  return <T extends { category: string; date: string }>(a: T) => ({
    ...a,
    catLabel: CAT[a.category] || a.category,
    isRecent: isRecent(a.date, nowTs),
  })
}

// LEAD et 1er SECONDAIRE des grands formats : jugement éditorial figé,
// défini dans lib/home-pools.ts pour que les pools puissent les exclure
// du même endroit.

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

// ─────────────────────────────────────────────────────────
export default async function HomePage() {
  const homeAd = await getActiveAd('home')

  // ── Tirages à chaque requête ──────────────────────────
  // Rotation aléatoire pure : la home est `force-dynamic`, donc chaque
  // chargement déclenche un nouveau SSR avec son propre shuffle. Pas de
  // seed quotidien : variété maximale, contre-partie SEO mineure (les
  // crawlers verront aussi des sélections différentes mais le contenu
  // global est le même catalogue). Un article tiré entre dans `used`
  // pour éviter qu'il réapparaisse ailleurs sur la même page.
  const used = new Set<string>([GF_LEAD_SLUG, GF_SECONDARY_1_SLUG])
  const excludeArt = <T extends { slug: string }>(pool: readonly T[]) =>
    pool.filter(a => !used.has(a.slug))
  const consume = <T extends { slug: string }>(items: T[]) => {
    items.forEach(a => used.add(a.slug))
    return items
  }

  const allArticles = articlesData as any[]
  const nowTs = Date.now()
  const byDateDesc = (a: any, b: any) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()

  // ── Composition du HERO ──────────────────────────────
  // Règle : 6 slides. Si HERO_LEAD_SLUG est défini (cf. home-pools.ts),
  // l'article correspondant est épinglé en position 0 et sa catégorie
  // est retirée des cats non-geo tirées au sort, pour éviter qu'un
  // deuxième article de la même rubrique apparaisse juste derrière.
  // Les 5 (ou 6 si pas de lead) slides restantes : 2 en géopolitique
  // + 3-4 dans des catégories distinctes parmi {eco, tech, env, soc,
  // culture}. Pas de portrait dans le hero (les portraits ont leur
  // propre section dédiée).
  // Dans chaque créneau : priorité featured > récence > shuffle pour
  // varier l'article qui occupe la place de sa catégorie. À chaque
  // chargement la combinaison change, sauf le slide épinglé.
  const HERO_NON_GEO_CATS = ['eco', 'tech', 'env', 'soc', 'culture']
  const HERO_GEO_TARGET = 2
  const HERO_TOTAL = 6

  // Article épinglé (peut être null) : on le récupère du JSON et on le
  // garde seulement s'il existe, n'est pas futur, et passe l'éligibilité.
  // Tout le reste du tirage se fait sur HERO_POOL qui l'exclut déjà.
  const heroLeadArticle: any | null = (() => {
    if (!HERO_LEAD_SLUG) return null
    const a = (articlesData as any[]).find(x => x.slug === HERO_LEAD_SLUG)
    if (!a) return null
    if (!(a as any).image) return null
    if (new Date(a.date).getTime() > nowTs) return null
    return a
  })()

  const HERO_NON_GEO_TARGET = heroLeadArticle ? 3 : 4
  const heroLeadCat: string | undefined = heroLeadArticle?.category

  const heroCandidates = (cat: string): any[] =>
    (HERO_POOL as any[]).filter(a =>
      a.category === cat
      && !used.has(a.slug)
      && new Date(a.date).getTime() <= nowTs   // ignore les publications futures
    )

  // Score de récence + bonus featured : un article récent passe devant,
  // un featured ancien ne court-circuite plus la fraîcheur. À score
  // égal (même palier d'âge), shuffle pour varier entre chargements.
  const pickHeroForCat = (cat: string, n: number): any[] => {
    const all = heroCandidates(cat)
    if (!all.length || n <= 0) return []
    return sortByRecency(all, nowTs).slice(0, n)
  }

  // Cats non-geo retenues à chaque chargement, en ne gardant que celles
  // qui ont au moins un candidat éligible. La cat du lead (si non-geo)
  // est explicitement écartée pour ne pas dupliquer la rubrique.
  const chosenNonGeoCats: string[] = []
  for (const cat of randomShuffle(HERO_NON_GEO_CATS)) {
    if (cat === heroLeadCat) continue
    if (chosenNonGeoCats.length >= HERO_NON_GEO_TARGET) break
    if (heroCandidates(cat).length > 0) chosenNonGeoCats.push(cat)
  }

  const geoPicks = pickHeroForCat('geo', HERO_GEO_TARGET)
  geoPicks.forEach(a => used.add(a.slug))

  const nonGeoPicks: any[] = []
  for (const cat of chosenNonGeoCats) {
    const [pick] = pickHeroForCat(cat, 1)
    if (pick) {
      nonGeoPicks.push(pick)
      used.add(pick.slug)
    }
  }

  // Filet de secours : si on n'a pas atteint la cible (HERO_TOTAL moins
  // le lead s'il existe), on complète depuis HERO_POOL avec max-2 par
  // catégorie pour ne pas casser la diversité. Pas de portrait.
  const heroRotationTarget = heroLeadArticle ? HERO_TOTAL - 1 : HERO_TOTAL
  let heroPicks: any[] = [...geoPicks, ...nonGeoPicks]
  if (heroPicks.length < heroRotationTarget) {
    const fillPool = excludeArt(HERO_POOL).filter((a: any) =>
      a.category !== 'portrait' && new Date(a.date).getTime() <= nowTs
    )
    const fill = pickRandom(fillPool, heroRotationTarget - heroPicks.length, {
      diversifyBy: (a: any) => a.category, maxPerCat: 2,
    })
    fill.forEach(a => used.add(a.slug))
    heroPicks = [...heroPicks, ...fill]
  }

  // Ordre des slides : par score de récence (featured = bonus, pas un
  // bypass). Le hero s'ouvre normalement sur l'article le plus frais,
  // mais si un lead est épinglé il prend la position 0 quoi qu'il arrive.
  heroPicks = sortByRecency(heroPicks, nowTs)
  if (heroLeadArticle) {
    used.add(heroLeadArticle.slug)
    heroPicks = [heroLeadArticle, ...heroPicks].slice(0, HERO_TOTAL)
  }

  const HERO_ROTATION = heroPicks.map(withCatLabel(nowTs))

  // Sous le hero : 3 à gauche, 3 à droite. Triés par score de récence
  // (futur exclu, palier d'âge, shuffle à fraîcheur égale) avec cap
  // catégoriel pour garder la diversité éditoriale.
  const UNDER_HERO_LEFT = consume(
    pickByRecency(excludeArt(UNDER_HERO_POOL), 3, nowTs, {
      diversifyBy: (a: any) => a.category, maxPerCat: 2,
    })
  ).map(withCatLabel(nowTs))
  const UNDER_HERO_RIGHT = consume(
    pickByRecency(excludeArt(UNDER_HERO_POOL), 3, nowTs, {
      diversifyBy: (a: any) => a.category, maxPerCat: 2,
    })
  ).map(withCatLabel(nowTs))

  // Grands formats : LEAD + SECONDARY1 figés (sanctuaire éditorial).
  // SEC2 vit dans le bloc visuel gfSecondaryRow aux côtés de SEC1 (geo) :
  // on le force non-geo pour ne pas faire un bloc monocat. Les deux
  // autres blocs visuels (gfFeatureRow 3 cards, gfMoreList 6 cards) sont
  // calculés directement avec max-2 par catégorie, puis repliés dans
  // GF_TERTIARY/GF_QUATERNARY pour préserver le JSX d'origine.
  const GF_LEAD = art(GF_LEAD_SLUG)
  const GF_SECONDARY_1 = art(GF_SECONDARY_1_SLUG)
  const sec2NonGeoPool = excludeArt(GF_POOL_AFTER_LEAD).filter((a: any) => a.category !== 'geo')
  const sec2Raw = pickRandom(
    sec2NonGeoPool.length ? sec2NonGeoPool : excludeArt(GF_POOL_AFTER_LEAD), 1
  )[0]
  if (sec2Raw) used.add(sec2Raw.slug)
  const GF_SECONDARY_2 = sec2Raw ? withCatLabel(nowTs)(sec2Raw) : undefined
  const GF_SECONDARY = [GF_SECONDARY_1, GF_SECONDARY_2].filter(Boolean) as any[]

  const gfFeatureRow = consume(pickRandom(
    excludeArt(GF_POOL_AFTER_LEAD), 3,
    { diversifyBy: (a: any) => a.category, maxPerCat: 2 }
  ))
  const gfMore = consume(pickRandom(
    excludeArt(GF_POOL_AFTER_LEAD), 6,
    { diversifyBy: (a: any) => a.category, maxPerCat: 2 }
  ))
  // Repli vers TERT (3) et QUAT (6) tels que le JSX existant produise :
  //   gfFeatureRow = TERT[0:1] + QUAT[0:2]
  //   gfMoreList   = TERT[1:3] + QUAT[2:6]
  const GF_TERTIARY = [
    gfFeatureRow[0], gfMore[0], gfMore[1],
  ].filter(Boolean).map(withCatLabel(nowTs))
  const GF_QUATERNARY = [
    gfFeatureRow[1], gfFeatureRow[2], ...gfMore.slice(2),
  ].filter(Boolean).map(withCatLabel(nowTs))

  // À lire aussi (zone 1, colonne gauche). 3 items max-2 par cat.
  const ZONE1_ALSO_READ = consume(
    pickRandom(excludeArt(ALSO_READ_POOL), 3, {
      diversifyBy: (a: any) => a.category, maxPerCat: 2,
    })
  ).map(withCatLabel(nowTs))

  // Atlas (3 cartes, indépendant : ce ne sont pas des articles).
  const ZONE1_ATLAS = pickRandom(ATLAS_POOL, 3)

  // Dernières publications : 3 plus récents par date (canonique, ignore
  // `used` exprès : un article peut être à la fois dans le Hero et dans
  // "Dernières publications", c'est même attendu) + 2 redécouvertes
  // aléatoires (>30j, hors articles déjà au top). Tri secondaire par slug
  // pour stabilité quand deux articles partagent la même date.
  const byDateDescStable = (a: any, b: any) => {
    const d = new Date(b.date).getTime() - new Date(a.date).getTime()
    return d !== 0 ? d : (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
  }
  const recentByDate = allArticles
    .filter(a => !a.interviewType && !a.hideFromHome
                 && new Date(a.date).getTime() <= nowTs)
    .sort(byDateDescStable)
  const LATEST_RECENT = recentByDate.slice(0, 3).map(withCatLabel(nowTs))
  LATEST_RECENT.forEach((a: any) => used.add(a.slug))

  const thirtyDaysAgo = nowTs - 30 * 86400 * 1000
  const latestRecentSlugs = new Set(LATEST_RECENT.map((a: any) => a.slug))
  const olderPool = allArticles.filter(a =>
    !a.interviewType && !a.hideFromHome && !latestRecentSlugs.has(a.slug)
    && new Date(a.date).getTime() < thirtyDaysAgo
  )
  const LATEST_REDISCOVER = consume(
    pickRandom(olderPool, 2, {
      diversifyBy: (a: any) => a.category, maxPerCat: 1,
    })
  ).map(withCatLabel(nowTs))
  const LATEST = [...LATEST_RECENT, ...LATEST_REDISCOVER]

  // POPULAR (« Les plus lus »). 5 items aléatoires avec max-2 par cat.
  // Indépendant du reste : peut contenir des articles déjà affichés
  // ailleurs (la popularité ne consomme pas `used`, sinon la section se
  // viderait quand l'autre rotation a beaucoup pioché).
  const POPULAR_TARGET = 5
  const popularPrefer = pickRandom(
    POPULAR_POOL.filter(a => !used.has(a.slug)), POPULAR_TARGET,
    { diversifyBy: (a: any) => a.category, maxPerCat: 2 }
  )
  let popularList: any[] = popularPrefer
  if (popularList.length < POPULAR_TARGET) {
    const have = new Set(popularList.map(a => a.slug))
    const fill = pickRandom(
      POPULAR_POOL.filter(a => !have.has(a.slug)),
      POPULAR_TARGET - popularList.length,
      { diversifyBy: (a: any) => a.category, maxPerCat: 2 }
    )
    popularList = [...popularList, ...fill]
  }
  const POPULAR = popularList.map(withCatLabel(nowTs))

  // Portraits : 6 articles, ordre aléatoire à chaque chargement.
  const PORTRAITS = randomShuffle(PORTRAITS_BASE)

  // À redécouvrir : 3 articles >30j. Au plus 1 portrait, et les 3 cartes
  // doivent couvrir 3 catégories distinctes (sinon deux portraits ou
  // deux mêmes rubriques tombaient parfois côte à côte).
  const rediscoverPool = allArticles.filter(a =>
    !a.interviewType && !a.hideFromHome && !used.has(a.slug)
    && new Date(a.date).getTime() < thirtyDaysAgo
  )
  const rediscoverPortraits = rediscoverPool.filter(a => a.category === 'portrait')
  const rediscoverRest = rediscoverPool.filter(a => a.category !== 'portrait')
  const pickedPortrait = pickRandom(rediscoverPortraits, 1)
  const pickedRest = pickRandom(rediscoverRest, 3 - pickedPortrait.length, {
    diversifyBy: (a: any) => a.category, maxPerCat: 1,
  })
  const REDISCOVER = randomShuffle([...pickedPortrait, ...pickedRest]).map(withCatLabel(nowTs))

  // ── La Métaphore du Samedi : dernière édition ─────────
  // Indépendant du moteur d'articles : la rubrique vit dans son propre
  // JSON. On prend l'entrée la plus récente par dateISO.
  const METAPHORE_LATEST = (metaphoresData as any[]).slice().sort((a, b) =>
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )[0] || null

  return (
    <>
      <Header />
      <h1 className="sr-only">Soara, comprendre le monde, éclairer l'avenir</h1>
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
        </aside>

        <div className={styles.homeTopCenter}>
          <HeroInline articles={HERO_ROTATION} intervalMs={7000} />
          <HomeFeaturedInterviews />
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
          1ter. LES ENTRETIENS SOARA, bande pleine largeur
          Retiré pour le lancement : seulement 2 entretiens hors vedette, la
          bande paraissait clairsemée. À réactiver dès qu'il y en a 4+.
      ══════════════════════════════════════ */}
      {/* <HomeInterviewsRow /> */}

      {/* ══════════════════════════════════════
          1quater. LES GRANDS FORMATS, bande pleine largeur
      ══════════════════════════════════════ */}
      <HomeGrandFormats />

      {/* ══════════════════════════════════════
          1bis. LETTRE DU MARDI , bande pleine largeur
      ══════════════════════════════════════ */}
      <section className={styles.lettreMardi} aria-labelledby="lettre-mardi-title">
        <div className={styles.lettreMardiText}>
          <span className={styles.lettreMardiEyebrow}>La lettre du mardi</span>
          <h2 id="lettre-mardi-title" className={styles.lettreMardiTitle}>
            L'analyse qui manque à votre <em>semaine</em>
          </h2>
          <p className={styles.lettreMardiTeaser}>
            Une lecture longue chaque mardi matin. Sans algorithme, sans bruit.
          </p>
        </div>
        <div className={styles.lettreMardiActions}>
          <Link href="/lettres" className={styles.lettreMardiCta}>
            S'inscrire gratuitement →
          </Link>
          <Link href="/lettres" className={styles.lettreMardiArchive}>
            <FleuronIcon width={12} height={12} />
            <span>Lire les lettres</span>
          </Link>
        </div>
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
              <img src={GF_LEAD.image} alt={GF_LEAD.title} loading="lazy" />
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
                  <img src={a.image} alt={a.title} loading="lazy" />
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
                  <img src={a.image} alt={a.title} loading="lazy" />
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
                  <img src={featured.thumb} alt={featured.title} loading="lazy" />
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
                    <img src={ep.thumb} alt={ep.title} loading="lazy" />
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
          4a. LA MÉTAPHORE DU SAMEDI , section dédiée
          Met en avant la dernière édition : eyebrow, titre, thèse,
          illustration cliquable. Cohérent avec atlasSection / tvSection.
      ══════════════════════════════════════ */}
      {/* Rubrique La Métaphore du Samedi masquée temporairement, en attente de
          la validation d'Allison. Réactiver en retirant le `false &&`. */}
      {false && METAPHORE_LATEST && (
        <FadeSection>
        <section className={styles.metaphoreSection}>
          <div className={styles.metaphoreSectionHead}>
            <div>
              <span className={styles.metaphoreSectionEyebrow}>La Métaphore du Samedi</span>
              <h2 className={styles.metaphoreSectionTitle}>L'image de la <em>semaine</em></h2>
              <p className={styles.metaphoreSectionIntro}>
                Chaque samedi, une illustration transforme un fait du monde en une seule idée.
              </p>
            </div>
            <Link href="/metaphore" className={styles.metaphoreSectionAll}>Toutes les métaphores →</Link>
          </div>
          <Link href={`/metaphore/${METAPHORE_LATEST.slug}`} className={styles.metaphoreFeature}>
            <div className={styles.metaphoreFeatureImg}>
              <img src={METAPHORE_LATEST.image} alt={METAPHORE_LATEST.imageAlt} />
              <span className={styles.metaphoreFeatureNum}>
                N° {String(METAPHORE_LATEST.numero).padStart(2, '0')}
              </span>
            </div>
            <div className={styles.metaphoreFeatureBody}>
              <span className={styles.metaphoreFeatureDate}>{METAPHORE_LATEST.date}</span>
              <h3 className={styles.metaphoreFeatureTitle}>{METAPHORE_LATEST.title}</h3>
              <p className={styles.metaphoreFeatureThese}>{METAPHORE_LATEST.these}</p>
              <span className={styles.metaphoreFeatureCta}>Voir la métaphore →</span>
            </div>
          </Link>
        </section>
        </FadeSection>
      )}

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
                    {a.isRecent && <span className={styles.recentTag}>RÉCENT</span>}
                    <span className={styles.latestItem2Date}>
                      {new Date(a.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
                    </span>
                  </div>
                </div>
                <h3 className={styles.rowTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
                <span style={{display:'inline-flex',alignItems:'center'}}><ReadTime t={a.readTime || '7'} />{EN_SLUGS.has(a.slug) && <EnBadge />}</span>
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.rowThumb} loading="lazy" />}
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
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      style={a.imagePosition ? { objectPosition: a.imagePosition } : undefined}
                    />
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
