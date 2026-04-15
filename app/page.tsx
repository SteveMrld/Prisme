export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroRotator from '../components/HeroRotator'
import SoaraUnivers from '../components/SoaraUnivers'
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
  art('wanghuning'), art('afrique'), art('empire-du-droit'), art('terres-rares'),
  art('chambre-ratification'),
]

// Ligne 2 — 4 articles uniques (2 par colonne), titre + vignette
const ROW2 = [
  art('empire-du-droit'),
  art('societe-du-consentement'),
  art('terres-rares'),
  art('skunkworks'),
]
const TRIO = [                         // ligne 3 — 3 articles différents, texte seul
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
const GF = [
  art('terres-rares'), art('medias'),
  art('skunkworks'),   art('dette-souveraine'),
  art('france_maritime'), art('eau'),
  art('techgeo'),      art('taiwan'),
  art('semico'),       art('chambre-ratification'),
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

const SBadge = () => (
  <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:'14px',height:'14px',background:'#0A0A0A',color:'#C8A96E',fontFamily:"'DM Sans',sans-serif",fontSize:'8px',fontWeight:700,lineHeight:1,marginRight:'5px',flexShrink:0,verticalAlign:'middle',position:'relative',top:'-1px'}}>S</span>
)

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
          1. HERO — slider automatique
      ══════════════════════════════════════ */}
      <section className={styles.lead}>
        <HeroRotator articles={HERO_ROTATION} intervalMs={4000} />
      </section>

      {/* ══════════════════════════════════════
          2. LIGNE 2 — 2 colonnes × 3 articles (titre + vignette)
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.row2}>
        {/* Col gauche */}
        <div className={styles.rowCol}>
          {ROW2.slice(0,2).map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.rowItem}>
              <div className={styles.rowItemBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.rowTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
                <ReadTime t={a.readTime || '7'} />
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.rowThumb} />}
            </Link>
          ))}
        </div>
        {/* Col droite */}
        <div className={styles.rowCol}>
          {ROW2.slice(2,4).map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.rowItem}>
              <div className={styles.rowItemBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={styles.rowTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
                <ReadTime t={a.readTime || '7'} />
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.rowThumb} />}
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          3. TRIO — 3 articles texte seul
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.trio}>
        {TRIO.map(a => (
          <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.trioCard}>
            <span className={styles.cat}>{a.catLabel}</span>
            <h3 className={styles.trioTitle}><SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} /></h3>
            <ReadTime t={a.readTime || '7'} />
          </Link>
        ))}
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          4. GRAND ENTRETIEN
      ══════════════════════════════════════ */}
      <FadeSection>
      <Link href={ENTRETIEN_ART.href} className={styles.entretien}>
        {/* Photo en bannière pleine largeur */}
        <div className={styles.entretienBanner}>
          <img src={ENTRETIEN_ART.img} alt={ENTRETIEN_ART.name} className={styles.entretienBannerImg} />
          <div className={styles.entretienBannerGrad} />
          <span className={styles.entretienBannerLabel}>Grand Entretien · N°1</span>
        </div>
        {/* Texte en dessous, aéré */}
        <div className={styles.entretienBody}>
          <h2 className={styles.entretienName}>Cheick Modibo <em>Diarra</em></h2>
          <p className={styles.entretienDeck}>{ENTRETIEN_ART.deck}</p>
          <p className={styles.entretienExcerpt}>Ingénieur de navigation sur cinq missions NASA dont Mars Pathfinder, ancien président de Microsoft Afrique pendant dix ans, ancien Premier ministre du Mali en pleine crise institutionnelle. Cette trajectoire — la science, le capital technologique mondial, le pouvoir politique africain — en fait l'interlocuteur inaugural de Soara…</p>
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
        {GF.map((a, i) => {
          const hasImg = i % 4 < 2
          return (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfCard}>
              {hasImg && a.image && (
                <div className={styles.gfImgWrap}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.gfBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={`${styles.gfTitle} ${!hasImg ? styles.gfTitleLarge : ''}`}>
                  <SBadge /><span dangerouslySetInnerHTML={{__html: a.title}} />
                </h3>
                <div className={styles.gfMeta}>
                  <ReadTime t={a.readTime || '12'} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,opacity:.7}}>
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
                    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
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
                <ReadTime t={a.readTime || '7'} />
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
