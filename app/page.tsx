export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroInline from '../components/HeroInline'
import PictureImg from '../components/PictureImg'
import SoaraUnivers from '../components/SoaraUnivers'
import AdSlot from '../components/AdSlot'
import HomeInterviewBanner from '../components/HomeInterviewBanner'
import { getActiveAd } from '../lib/ads'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, PortraitsSlider } from './HomeClient'
import Ticker from './TickerClient'

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

// ── Articles ──────────────────────────────────────────────
const PORTRAITS = ['morin','obama','morrison','musk','tutu','nooyi'].map(art)
const TV_EPISODES = [
  { id:'01', title:"L'Inde, le siècle qui vient",             duration:'1 min 19', href:'/tv?ep=01',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_inde_final-1_hitfsr.jpg' },
  { id:'02', title:"L'Afrique : ce qu'on ne vous a pas appris",duration:'2 min 02', href:'/tv?ep=02',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_afrique_ep2-1_xp6mvu.jpg' },
  { id:'03', title:"La biologie devient un logiciel",           duration:'2 min 07', href:'/tv?ep=03',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_biologie_ep3_ouqzr4.jpg' },
  { id:'04', title:"L'arme qui a failli nous tuer",             duration:'2 min 25', href:'/tv?ep=04',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_arme_ep4_eo7uyk.jpg' },
  { id:'05', title:"8 hommes. 3,5 milliards.",                  duration:'2 min 07', href:'/tv?ep=05',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg' },
  { id:'06', title:"Nous sommes l'astéroïde",                   duration:'1 min 49', href:'/tv?ep=06',            thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_asteroide_ep6_qkipn3.jpg' },
]

// Sections de la une — ordre éditorial
// Hero — 5 articles mixtes qui tournent
const HERO_ROTATION = [
  art('wanghuning'), art('afrique'), art('pollinisation'), art('empire-du-droit'), art('terres-rares'),
  art('chambre-ratification'),
]

// Sous le hero — 5 articles utilisés (3 gauche texte + 2 droite avec image)
// Règle de la home : chaque article apparaît au max 2 fois sur la page,
// hero carousel inclus. Les triples ont été retirés.
const UNDER_HERO = [
  art('empire-du-droit'),       // gauche · 2e occurrence (HERO + Zone 1)
  art('societe-du-consentement'),// gauche · unique
  art('wanghuning'),             // gauche · 2e occurrence (HERO + Zone 1) — remplace terres-rares (retiré : était HERO+Zone 1+GF)
  art('moreno'),                 // droite · 2e occurrence (Zone 1 + POPULAR) — remplace chambre-ratification (retiré : était HERO+Zone 1+GF Lead)
  art('dette-souveraine'),       // droite · 2e occurrence (Zone 1 + GF Tertiaire)
]
// 12 grands formats — hiérarchie 4 niveaux type NYT / Le Grand Continent
// 1 Lead pleine largeur + 2 Secondaires + 3 Tertiaires + 6 Quaternaires (liste compacte)
const GF_LEAD = art('chambre-ratification')
const GF_SECONDARY = [art('terres-rares'), art('palantir')]
const GF_TERTIARY = [art('skunkworks'), art('dette-souveraine'), art('france_maritime')]
const GF_QUATERNARY = [
  art('taiwan'), art('semico'), art('architecture-desordre'),
  art('medias'), art('eau'),    art('techgeo'),
]
const LATEST = (articlesData as any[])
  .filter((a:any) => !a.featured && !a.interviewType)
  .sort((a:any,b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0,5)
  .map((a:any) => ({...a, catLabel: CAT[a.category]||a.category}))

// architecture-desordre remplace empire-du-droit (qui était en HERO + Zone 1 + POPULAR = triple)
const POPULAR = ['architecture-desordre','moreno','lecture','palantir','skunkworks'].map(art)

// Zone 1 — colonne gauche : mini-liste « À lire aussi » entre les 3 articles et
// la citation, pour densifier la colonne et résorber le vide blanc.
// Articles à 1 occurrence ailleurs, qui passent à 2 en y figurant.
const ZONE1_ALSO_READ = [art('eau'), art('lecture'), art('france_maritime')]

// Zone 1 — colonne centre : bande Atlas sous le hero inline, pour ancrer
// la colonne centrale à la hauteur des deux latérales. Ce sont des
// visualisations, pas des articles : aucun impact sur le décompte des doublons.
const ZONE1_ATLAS = [
  {
    href: '/visuels/predateurs',
    tag: 'Géopolitique',
    title: 'Le monde des prédateurs',
    image: '/articles/img-predateurs.jpg',
  },
  {
    href: '/visuels/naval',
    tag: 'Géopolitique',
    title: 'Les mers du pouvoir',
    image: '/articles/atlas/09_les-mers-du-pouvoir.jpg',
  },
  {
    href: '/visuels/cables',
    tag: 'Tech',
    title: 'Câbles sous-marins',
    image: '/articles/atlas/13_cables-sous-marins.jpg',
  },
]

// ── Composants atomiques ──────────────────────────────────
function ReadTime({ t }: { t: string }) {
  const n = parseInt(t)
  return <span className={styles.readTime}>{isNaN(n) ? t : `${n} min`}</span>
}

// Slugs disponibles en anglais
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

const AudioIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'5px',flexShrink:0,verticalAlign:'middle'}}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
)

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
  // Pré-fetch de l'annonce home pour la placer en sidebar verticale
  // dans la colonne droite de .homeTop, sous les 2 articles avec image.
  const homeAd = await getActiveAd('home')

  return (
    <>
      <Header />
      <Ticker />

      {/* ══════════════════════════════════════
          1. HOME TOP — Grille NYT 3 colonnes
             Gauche : 3 stories texte+deck · Centre : hero inline (image+titre+deck)
             Droite : 2 stories avec image + sidebar pub
      ══════════════════════════════════════ */}
      <section className={styles.homeTop}>
        {/* Colonne gauche : 3 articles texte avec deck court + signature éditoriale */}
        <aside className={styles.homeTopLeft}>
          {UNDER_HERO.slice(0, 3).map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.htSideItem}>
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
                  <Link href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.zone1AlsoReadLink}>
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
          </div>
        </aside>

        {/* Colonne centre : hero inline rotatif + bandeau Interview alterné.
            Le bandeau lit getNextInterviewForHome() : published récent prioritaire,
            fallback coming proche. Variante visuelle pilotée par data-interview-type. */}
        <div className={styles.homeTopCenter}>
          <HeroInline articles={HERO_ROTATION} intervalMs={7000} />

          <HomeInterviewBanner />
        </div>

        {/* Colonne droite : 2 articles avec image + sidebar pub (si annonce) */}
        <aside className={styles.homeTopRight}>
          {UNDER_HERO.slice(3, 5).map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.htRightItem}>
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
          4. ATLAS — bande pleine largeur
             Remplace l'ancien Grand Entretien, déplacé dans Zone 1
             pour combler l'espace blanc de la colonne centre.
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.atlasSection}>
        <div className={styles.atlasSectionHead}>
          <div>
            <span className={styles.atlasSectionEyebrow}>Atlas</span>
            <h2 className={styles.atlasSectionTitle}>Cartes pour <em>comprendre</em></h2>
            <p className={styles.atlasSectionIntro}>
              Six visualisations interactives pour traverser ce que les mots ne suffisent pas à dire.
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
          5. GRANDS FORMATS
      ══════════════════════════════════════ */}
      <SectionHead label="Grands formats" href="/grands-formats" />
      <FadeSection>
      <section className={styles.gfSection}>

        {/* — LEAD : pleine largeur, format couverture magazine */}
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

        {/* — SECONDAIRES : 2 colonnes, image 16/9 + extrait court */}
        <div className={styles.gfSecondaryRow}>
          {GF_SECONDARY.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfSecondary}>
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

        {/* — FEATURES : 3 colonnes uniformes, format NYT magazine
             (image 16/9 + catégorie + titre Playfair + deck Georgia + meta) */}
        <div className={styles.gfFeatureRow}>
          {[...GF_TERTIARY.slice(0, 1), ...GF_QUATERNARY.slice(0, 2)].map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfFeature}>
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

        {/* — LISTE COMPACTE : textuelle, sans image, façon NYT « More in this section ».
             6 articles supplémentaires sur deux colonnes, séparés par filets. */}
        <div className={styles.gfMoreSection}>
          <span className={styles.gfMoreLabel}>Aussi dans Grands formats</span>
          <ul className={styles.gfMoreList}>
            {[...GF_TERTIARY.slice(1), ...GF_QUATERNARY.slice(2)].map(a => (
              <li key={a.slug} className={styles.gfMoreItem}>
                <Link href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfMoreLink}>
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
          6. SOARA TV — featured + sidelist façon NYT Video
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
          {/* Épisode featured : dernier en date, grand format avec play overlay */}
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
          {/* Liste latérale des autres épisodes : pas de carrés, juste
              thumb compacte + titre + durée en ligne, façon NYT Video index */}
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
          7. PORTRAITS
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
          8. DERNIÈRES + POPULAIRES
      ══════════════════════════════════════ */}
      <div className={`${styles.row2} ${styles.row2LastSection}`}>
        {/* Dernières publications */}
        <div className={styles.rowCol}>
          <SectionHead label="Dernières publications" />
          {LATEST.map((a, i) => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.latestItem2}>
              <div className={styles.latestItem2Bar} style={{background: a.catColor || '#C8A96E', width: i === 0 ? '4px' : '3px'}} />
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

        {/* Les plus lus */}
        <div className={styles.rowCol}>
          <SectionHead label="Les plus lus" />
          {POPULAR.map((a, i) => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.popularItem}>
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
          9. L'UNIVERS SOARA
      ══════════════════════════════════════ */}
      <SoaraUnivers />

      {/* ══════════════════════════════════════
          10. NEWSLETTER
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.nl}>
        <div className={styles.nlInner}>
          <div className={styles.nlEyebrow}>Newsletter</div>
          <h2 className={styles.nlTitle}>L'analyse qui manque à votre semaine</h2>
          <p className={styles.nlDesc}>Sans algorithme, sans bruit. Chaque semaine.</p>
          <NewsletterForm />
        </div>
      </section>
      </FadeSection>
    </>
  )
}
