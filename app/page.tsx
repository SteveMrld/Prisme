export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroInline from '../components/HeroInline'
import SoaraUnivers from '../components/SoaraUnivers'
import AdSlot from '../components/AdSlot'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, PortraitsSlider } from './HomeClient'
import Ticker from './TickerClient'

// ── Helpers ───────────────────────────────────────────────
const CAT: Record<string,string> = {
  geo:'Géopolitique', eco:'Économie', tech:'Technologie',
  env:'Environnement', soc:'Société', culture:'Culture',
  portrait:'Portrait', concept:'Concept',
}
function art(slug: string) {
  const a = (articlesData as any[]).find(x => x.slug === slug)!
  return { ...a, catLabel: CAT[a.category] || a.category }
}

// ── Articles ──────────────────────────────────────────────
const PORTRAITS = ['morin','obama','morrison','musk','tutu','nooyi'].map(art)
const TV_EPISODES = [
  { id:'01', title:"L'Inde, le siècle qui vient",             duration:'1 min 19', href:'/articles/inde',       thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_inde_final-1_hitfsr.jpg' },
  { id:'02', title:"L'Afrique : ce qu'on ne vous a pas appris",duration:'2 min 02', href:'/articles/afrique',    thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_afrique_ep2-1_xp6mvu.jpg' },
  { id:'03', title:"La biologie devient un logiciel",           duration:'2 min 07', href:'/articles/biologie',   thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_biologie_ep3_ouqzr4.jpg' },
  { id:'04', title:"L'arme qui a failli nous tuer",             duration:'2 min 25', href:'/articles/nucleaire',  thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_arme_ep4_eo7uyk.jpg' },
  { id:'05', title:"8 hommes. 3,5 milliards.",                  duration:'2 min 07', href:'/articles/inegalites', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg' },
  { id:'06', title:"Nous sommes l'astéroïde",                   duration:'1 min 49', href:'/articles/asteroide',  thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_asteroide_ep6_qkipn3.jpg' },
]

// Sections de la une — ordre éditorial
// Hero — 5 articles mixtes qui tournent
const HERO_ROTATION = [
  art('wanghuning'), art('afrique'), art('pollinisation'), art('empire-du-droit'), art('terres-rares'),
  art('chambre-ratification'),
]

// Sous le hero — 6 articles en bande éditoriale 2 colonnes × 3 lignes
// Image carrée 96px à gauche, titre Playfair, lecture verticale type Le Monde "À la une"
const UNDER_HERO = [
  art('empire-du-droit'),
  art('societe-du-consentement'),
  art('terres-rares'),
  art('chambre-ratification'),
  art('dette-souveraine'),
  art('moreno'),
]
const ENTRETIEN_ART = {
  name: 'Cheick Modibo Diarra',
  italic: 'Diarra',
  deck: 'Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali.',
  href: '/entretien/diarra',
  img: '/portraits/diarra.png',
}
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
  .filter((a:any) => !a.featured)
  .sort((a:any,b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0,5)
  .map((a:any) => ({...a, catLabel: CAT[a.category]||a.category}))

const POPULAR = ['empire-du-droit','moreno','lecture','palantir','skunkworks'].map(art)

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
export default function HomePage() {
  return (
    <>
      <Header />
      <Ticker />

      {/* ══════════════════════════════════════
          1. HOME TOP — Grille NYT 3 colonnes
             Gauche : 3 stories texte+deck · Centre : hero inline (image+titre+deck)
             Droite : 2 stories avec image
      ══════════════════════════════════════ */}
      <section className={styles.homeTop}>
        {/* Colonne gauche : 3 articles texte avec deck court */}
        <aside className={styles.homeTopLeft}>
          {UNDER_HERO.slice(0, 3).map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.htSideItem}>
              <span className={styles.cat}>{a.catLabel}</span>
              <h3 className={styles.htSideTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
              {a.description && <p className={styles.htSideDesc}>{a.description}</p>}
              <span style={{display:'inline-flex',alignItems:'center'}}><ReadTime t={a.readTime || '7'} />{EN_SLUGS.has(a.slug) && <EnBadge />}</span>
            </Link>
          ))}
        </aside>

        {/* Colonne centre : hero inline rotatif */}
        <div className={styles.homeTopCenter}>
          <HeroInline articles={HERO_ROTATION} intervalMs={7000} />
        </div>

        {/* Colonne droite : 2 articles avec image */}
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
        </aside>
      </section>

      {/* @ts-expect-error Async Server Component */}
      <AdSlot slotId="home" />

      {/* ══════════════════════════════════════
          4. GRAND ENTRETIEN
      ══════════════════════════════════════ */}
      <FadeSection>
      <Link href={ENTRETIEN_ART.href} className={styles.entretien}>
        <div className={styles.entretienImgCol}>
          <img src={ENTRETIEN_ART.img} alt={ENTRETIEN_ART.name} className={styles.entretienImg} />
        </div>
        <div className={styles.entretienBody}>
          <span className={styles.entretienLabel}>Grand Entretien</span>
          <h2 className={styles.entretienName}>Cheick Modibo <em>Diarra</em></h2>
          <p className={styles.entretienRole}>{ENTRETIEN_ART.deck}</p>
          <p className={styles.entretienExcerpt}>Ingénieur de navigation sur cinq missions NASA dont Mars Pathfinder, ancien président de Microsoft Afrique pendant dix ans, ancien Premier ministre du Mali en pleine crise institutionnelle. Cette trajectoire — la science, le capital technologique mondial, le pouvoir politique africain — en fait l'interlocuteur inaugural de Soara&hellip;</p>
          <blockquote className={styles.entretienPullQuote}>
            « La science, le capital, le pouvoir — trois langues d'un même siècle. »
          </blockquote>
          <p className={styles.entretienAfterQuote}>
            Soara s'ouvrira par cet entretien fondateur. Diffusion le 1<sup>er</sup> juin 2026.
          </p>
          <span className={styles.entretienCta}>Lire dès la parution →</span>
        </div>
      </Link>
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

        {/* — TERTIAIRES : 3 colonnes, format carte classique */}
        <div className={styles.gfTertiaryRow}>
          {GF_TERTIARY.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfTertiary}>
              {a.image && (
                <div className={styles.gfTertiaryImg}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.gfTertiaryBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.gfTertiaryTitle}>
                  <SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} />
                </h3>
                <div className={styles.gfMeta}>
                  <ReadTime t={a.readTime || '12'} />
                  {EN_SLUGS.has(a.slug) && <EnBadge />}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* — QUATERNAIRES : 6 articles en format liste compacte 2 colonnes × 3 lignes */}
        <div className={styles.gfQuaternaryRow}>
          {GF_QUATERNARY.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfQuaternary}>
              {a.image && (
                <img src={a.image} alt={a.title} className={styles.gfQuaternaryThumb} />
              )}
              <div className={styles.gfQuaternaryBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.gfQuaternaryTitle}>
                  <SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} />
                </h3>
                <ReadTime t={a.readTime || '12'} />
              </div>
            </Link>
          ))}
        </div>

      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          6. SOARA TV
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.tvSection}>
        <div className={styles.tvHeader}>
          <div>
            <div className={styles.tvEyebrow}>Soara · Vidéo</div>
            <h2 className={styles.tvTitle}>Soara <em>TV</em></h2>
            <p className={styles.tvIntro}>Les grandes questions du monde en 60 à 90 secondes. Géopolitique, économie, société — vus autrement.</p>
          </div>
          <Link href="/prismetv" className={styles.tvSeeAll}>Tous les épisodes →</Link>
        </div>
        <div className={styles.tvStrip}>
          {TV_EPISODES.map(ep => (
            <Link key={ep.id} href={ep.href} className={styles.tvCard}>
              <div className={styles.tvThumbWrap}>
                <img src={ep.thumb} alt={ep.title} className={styles.tvThumb} />
                <div className={styles.tvPlay}>▶</div>
              </div>
              <div className={styles.tvInfo}>
                <span className={styles.tvNum}>Ép. {ep.id}</span>
                <span className={styles.tvTitle2}>{ep.title}</span>
                <span className={styles.tvDur}>{ep.duration}</span>
              </div>
            </Link>
          ))}
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
