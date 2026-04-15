export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroRotator from '../components/HeroRotator'
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
  art('afrique'), art('empire-du-droit'), art('terres-rares'),
  art('chambre-ratification'), art('ceux-qui-nont-pas-cede'),
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
  .slice(0,8)
  .map((a:any) => ({...a, catLabel: CAT[a.category]||a.category}))

// ── Composants atomiques ──────────────────────────────────
function ReadTime({ t }: { t: string }) {
  const n = parseInt(t)
  return <span className={styles.readTime}>{isNaN(n) ? t : `${n} min`}</span>
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
                <h3 className={styles.rowTitle} dangerouslySetInnerHTML={{__html: a.title}} />
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
                <h3 className={styles.rowTitle} dangerouslySetInnerHTML={{__html: a.title}} />
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
            <h3 className={styles.trioTitle} dangerouslySetInnerHTML={{__html: a.title}} />
            <ReadTime t={a.readTime || '7'} />
          </Link>
        ))}
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          4. GRAND ENTRETIEN
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.entretien}>
        <div className={styles.entretienImg}>
          <img src={ENTRETIEN_ART.img} alt={ENTRETIEN_ART.name} />
        </div>
        <div className={styles.entretienBody}>
          <span className={styles.entretienLabel}>Grand Entretien · N°1</span>
          <h2 className={styles.entretienName}>
            Cheick Modibo <em>Diarra</em>
          </h2>
          <p className={styles.entretienDeck}>{ENTRETIEN_ART.deck}</p>
          <Link href={ENTRETIEN_ART.href} className={styles.entretienCta}>Lire dès la parution</Link>
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          5. GRANDS FORMATS
      ══════════════════════════════════════ */}
      <SectionHead label="Grands formats" href="/grands-formats" />
      <FadeSection>
      <section className={styles.gfSection}>
        {GF.map((a, i) => {
          const hasImg = i % 4 < 2  // rangées paires = avec image, impaires = sans
          return (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.gfCard}>
              {hasImg && a.image && (
                <div className={styles.gfImgWrap}>
                  <img src={a.image} alt={a.title} />
                </div>
              )}
              <div className={styles.gfBody}>
                <span className={styles.cat}>{a.catLabel}</span>
                <h3 className={`${styles.gfTitle} ${!hasImg ? styles.gfTitleLarge : ''}`}
                    dangerouslySetInnerHTML={{__html: a.title}} />
                <ReadTime t={a.readTime || '12'} />
              </div>
            </Link>
          )
        })}
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          6. SOARA TV
      ══════════════════════════════════════ */}
      <SectionHead label="Soara TV" href="/tv" />
      <FadeSection>
      <div className={styles.tvStrip}>
        {TV_EPISODES.map(ep => (
          <Link key={ep.id} href={ep.href} className={styles.tvCard}>
            <div className={styles.tvThumbWrap}>
              <img src={ep.thumb} alt={ep.title} className={styles.tvThumb} />
              <div className={styles.tvPlay}>▶</div>
            </div>
            <div className={styles.tvInfo}>
              <span className={styles.tvNum}>Ép. {ep.id}</span>
              <span className={styles.tvTitle}>{ep.title}</span>
              <span className={styles.tvDur}>{ep.duration}</span>
            </div>
          </Link>
        ))}
      </div>
      </FadeSection>

      {/* ══════════════════════════════════════
          7. PORTRAITS
      ══════════════════════════════════════ */}
      <SectionHead label="Portraits" href="/portraits" />
      <FadeSection>
      <section className={styles.portraits}>
        <PortraitsSlider articles={PORTRAITS} />
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          8. DERNIÈRES PUBLICATIONS
      ══════════════════════════════════════ */}
      <SectionHead label="Dernières publications" href="/articles" />
      <FadeSection>
      <section className={styles.latestSection}>
        {LATEST.map((a, i) => (
          <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.latestItem}>
            <div className={styles.latestBody}>
              <span className={styles.cat}>{a.catLabel}</span>
              <h3 className={styles.latestTitle} dangerouslySetInnerHTML={{__html: a.title}} />
              <ReadTime t={a.readTime || '7'} />
            </div>
            {i % 3 === 0 && a.image && (
              <div className={styles.latestImgWrap}>
                <img src={a.image} alt={a.title} />
              </div>
            )}
          </Link>
        ))}
      </section>
      </FadeSection>

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
        </div>
      </section>
      </FadeSection>
    </>
  )
}
