export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import HeroRotator from '../components/HeroRotator'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, PortraitsSlider } from './HomeClient'
import Ticker from './TickerClient'

// ── Helpers ──────────────────────────────────────────────────────────────────
const CAT_LABELS: Record<string,string> = {
  geo:'Géopolitique', eco:'Économie', tech:'Technologie',
  env:'Environnement', soc:'Société', culture:'Culture',
  portrait:'Portrait', concept:'Concept',
}
const CAT_COLORS: Record<string,string> = {
  geo:'var(--geo)', eco:'var(--eco)', tech:'var(--tech)',
  env:'var(--env)', soc:'var(--soc)', culture:'var(--culture)',
  portrait:'var(--portrait)', concept:'var(--concept)',
}
function art(slug: string) {
  const a = (articlesData as any[]).find(x => x.slug === slug)!
  return { ...a, catLabel: CAT_LABELS[a.category] || a.category, catColor: CAT_COLORS[a.category] || 'var(--encre)' }
}

// ── Data ─────────────────────────────────────────────────────────────────────
const HERO_ROTATION = ['afrique','terres-rares','empire-du-droit','chine','chambre-ratification'].map(art)
const HERO_SIDE   = ['societe-du-consentement','ceux-qui-nont-pas-cede','rushkoff','moreno'].map(art)
const GF_SLUGS    = ['terres-rares','medias','chambre-ratification','skunkworks','dette-souveraine','france_maritime','eau','techgeo','taiwan','semico']
const grandsFormats = GF_SLUGS.map(slug => {
  const a = art(slug)
  return { ...a, readTime: a.readTime || '15' }
})
const TV_EPISODES = [
  { id:'01', title:"L'Inde, le siècle qui vient",             duration:'1 min 19', href:'/articles/inde',       thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_inde_final-1_hitfsr.jpg' },
  { id:'02', title:"L'Afrique : ce qu'on ne vous a pas appris",duration:'2 min 02', href:'/articles/afrique',    thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_afrique_ep2-1_xp6mvu.jpg' },
  { id:'03', title:"La biologie devient un logiciel",           duration:'2 min 07', href:'/articles/biologie',   thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_biologie_ep3_ouqzr4.jpg' },
  { id:'04', title:"L'arme qui a failli nous tuer",             duration:'2 min 25', href:'/articles/nucleaire',  thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_arme_ep4_eo7uyk.jpg' },
  { id:'05', title:"8 hommes. 3,5 milliards.",                  duration:'2 min 07', href:'/articles/inegalites', thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/PRISME5_v3_kauhvi.jpg' },
  { id:'06', title:"Nous sommes l'astéroïde",                   duration:'1 min 49', href:'/articles/asteroide',  thumb:'https://res.cloudinary.com/dnbyi8fw6/video/upload/so_5,w_640,h_360,c_fill,f_jpg,q_80/soara_asteroide_ep6_qkipn3.jpg' },
]
const PORTRAITS   = ['morin','obama','morrison','musk','tutu','nooyi'].map(art)
const LATEST      = (articlesData as any[]).filter((a:any) => !a.featured).sort((a:any,b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,7).map((a:any) => ({ ...a, catLabel: CAT_LABELS[a.category]||a.category, catColor: CAT_COLORS[a.category]||'var(--encre)' }))
const POPULAR     = ['arctique','moreno','lecture','chine','empires'].map(art)

const SIGNAL_ITEMS = [
  { cat:'Moyen-Orient', color:'var(--geo)', text:"Cessez-le-feu Iran–États-Unis — 3e jour fragile, sirènes en Israël", date:'10 avr.' },
  { cat:'Tarifs',       color:'var(--eco)', text:"Trump suspend 90 jours de droits sur la plupart des partenaires, maintient 145% sur la Chine", date:'10 avr.' },
  { cat:'Ukraine',      color:'var(--geo)', text:"Poutine annonce un cessez-le-feu de 48h pour la Pâque orthodoxe", date:'10 avr.' },
  { cat:'Soudan',       color:'var(--geo)', text:"L'ONU dénonce la pire crise humanitaire mondiale — 14 millions de déplacés", date:'10 avr.' },
  { cat:'Énergie',      color:'var(--eco)', text:"Brent remonte à 96,77 $ après la trêve, trafic dans le détroit d'Ormuz très limité", date:'10 avr.' },
]

// ── Section label (NYT style — discret, pas un bandeau) ────────────────────────
function SectionLabel({ label, title, href, linkLabel }: { label:string; title:string; href?:string; linkLabel?:string }) {
  return (
    <div className={styles.sectionLabel}>
      <div className={styles.sectionLabelInner}>
        <span className={styles.sectionLabelEyebrow}>{label}</span>
        <span className={styles.sectionLabelTitle} dangerouslySetInnerHTML={{__html: title}} />
      </div>
      {href && <Link href={href} className={styles.sectionLabelLink}>{linkLabel || 'Tout voir →'}</Link>}
    </div>
  )
}

// ── Premium badge ─────────────────────────────────────────────────────────────
const PremiumBadge = () => (
  <span className={styles.premiumBadge}>★ Premium</span>
)

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Header />
      <Ticker />

      {/* ══════════════════════════════════════
          1. HERO — article principal + sidebar
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.heroZone}>

        {/* Article principal — rotation automatique */}
        <div className={styles.heroMain}>
          <HeroRotator articles={HERO_ROTATION} />
        </div>

        {/* Sidebar — 4 articles */}
        <div className={styles.heroSidebar}>
          {HERO_SIDE.map((a, i) => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.heroSideItem}>
              <div className={styles.heroSideBody}>
                <span className={styles.heroCat} style={{color: a.catColor}}>{a.catLabel}</span>
                <div className={styles.heroSideTitle} dangerouslySetInnerHTML={{__html: a.title}} />
                {a.premium && <PremiumBadge />}
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.heroSideImg} />}
            </Link>
          ))}
        </div>

      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          2. GRAND ENTRETIEN
      ══════════════════════════════════════ */}
      <SectionLabel label="Soara · Grand Entretien N°1" title="L'entretien <em>inaugural</em>" />
      <FadeSection>
      <section className={styles.entretienSection}>
        <div className={styles.entretienPortrait}>
          <img src="/portraits/diarra.png" alt="Cheick Modibo Diarra" className={styles.entretienImg} />
        </div>
        <div className={styles.entretienContent}>
          <div className={styles.entretienLabel}>Grand Entretien · N°1</div>
          <h2 className={styles.entretienName}>Cheick Modibo <em>Diarra</em></h2>
          <p className={styles.entretienDeck}>Astrophysicien à la NASA, ancien patron de Microsoft Afrique, ancien Premier ministre du Mali. L'entretien inaugural de Soara.</p>
          <Link href="/entretien/diarra" className={styles.entretienCta}>Lire dès la parution →</Link>
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          3. GRANDS FORMATS
      ══════════════════════════════════════ */}
      <SectionLabel label="Soara · Analyse" title="Grands <em>formats</em>" href="/grands-formats" linkLabel="Tous les formats →" />
      <FadeSection>
      <section className={styles.gfSection}>
        <div className={styles.gfGrid}>
        {grandsFormats.map((a, i) => {
          const showImg = i % 4 !== 2 && i % 4 !== 3
          return (
          <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={`${styles.gfCard} ${!showImg ? styles.gfCardTextOnly : ''}`}>
            {showImg && a.image && <div className={styles.gfImgWrap}><img src={a.image} alt={a.title} className={styles.gfImg} /></div>}
            <div className={styles.gfBody}>
              <span className={styles.gfCat}>{a.catLabel}</span>
              <div className={styles.gfTitle} dangerouslySetInnerHTML={{__html: a.title}} />
              {a.description && showImg && <p className={styles.gfDescShort}>{a.description}</p>}
              {a.premium && <PremiumBadge />}
            </div>
          </Link>
          )
        })}
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          4. SOARA TV — bandeau compact
      ══════════════════════════════════════ */}
      <SectionLabel label="Soara · Vidéo" title="Soara <em>TV</em>" href="/tv" linkLabel="Tous les épisodes →" />
      <FadeSection>
      <div className={styles.tvStrip}>
        {TV_EPISODES.map(ep => (
          <Link key={ep.id} href={ep.href} className={styles.tvCard}>
            <div className={styles.tvThumbWrap}>
              <img src={ep.thumb} alt={ep.title} className={styles.tvThumb} />
              <div className={styles.tvPlay}>▶</div>
            </div>
            <div className={styles.tvInfo}>
              <div className={styles.tvNum}>Ep. {ep.id}</div>
              <div className={styles.tvTitle}>{ep.title}</div>
              <div className={styles.tvDuration}>{ep.duration}</div>
            </div>
          </Link>
        ))}
      </div>
      </FadeSection>

      {/* ══════════════════════════════════════
          5. PORTRAITS
      ══════════════════════════════════════ */}
      <SectionLabel label="Soara · Portraits" title="Figures qui ont <em>marqué leur époque</em>" href="/portraits" linkLabel="Tous les portraits →" />
      <FadeSection>
      <section className={styles.portraitsSection}>
        <PortraitsSlider articles={PORTRAITS} />
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          6. ARTICLES — Dernières + Populaires
      ══════════════════════════════════════ */}
      <SectionLabel label="Soara · Analyse" title="L'actualité <em>décryptée</em>" />
      <FadeSection>
      <section className={styles.articlesSection}>

        {/* Dernières publications */}
        <div className={styles.latestCol}>
          <div className={styles.colHead}>
            <span className={styles.colLabel}>Dernières publications</span>
            <Link href="/articles" className={styles.colSeeAll}>Tout voir →</Link>
          </div>
          {LATEST.map(a => (
            <Link key={a.slug} href={a.grandFormatUrl || `/articles/${a.slug}`} className={styles.latestItem}>
              <div className={styles.latestBody}>
                <span className={styles.latestCat} style={{color: a.catColor}}>{a.catLabel}</span>
                <div className={styles.latestTitle} dangerouslySetInnerHTML={{__html: a.title}} />
                {a.premium && <PremiumBadge />}
                <span className={styles.latestTime}>{isNaN(parseInt(a.readTime)) ? a.readTime : `${a.readTime} min`}</span>
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.latestImg} />}
            </Link>
          ))}
        </div>

        {/* Populaires */}
        <div className={styles.popularCol}>
          <div className={styles.colHead}>
            <span className={styles.colLabel}>Populaires</span>
          </div>
          {POPULAR.map((a, i) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className={styles.popularItem}>
              <span className={styles.popularNum}>{i + 1}</span>
              <div className={styles.popularBody}>
                <div className={styles.popularTitle} dangerouslySetInnerHTML={{__html: a.title}} />
                {a.author && <div className={styles.popularAuthor}>{a.author}</div>}
              </div>
              {a.image && <img src={a.image} alt={a.title} className={styles.popularImg} />}
            </Link>
          ))}
        </div>

      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          7. NEWSLETTER
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.nlSection}>
        <div className={styles.nlInner}>
          <div className={styles.nlText}>
            <div className={styles.nlEyebrow}>Soara · Newsletter</div>
            <h2 className={styles.nlTitle}>L'analyse qui manque<br/>à votre semaine</h2>
            <p className={styles.nlDesc}>Grands formats, Signal, Portraits — sans algorithme, sans bruit. Chaque semaine.</p>
          </div>
          <div className={styles.nlForm}>
            <NewsletterForm />
          </div>
        </div>
      </section>
      </FadeSection>

      {/* ══════════════════════════════════════
          8. SIGNAL
      ══════════════════════════════════════ */}
      <FadeSection>
      <section className={styles.signalSection}>
        <div className={styles.signalHead}>
          <span className={styles.signalDot} />
          <span className={styles.signalLabel}>Signal</span>
          <Link href="/signal" className={styles.signalAll}>Tout le signal →</Link>
        </div>
        <div className={styles.signalList}>
          {SIGNAL_ITEMS.map((s, i) => (
            <div key={i} className={styles.signalItem}>
              <span className={styles.signalCat} style={{color: s.color}}>{s.cat}</span>
              <span className={styles.signalText}>{s.text}</span>
              <span className={styles.signalDate}>{s.date}</span>
            </div>
          ))}
        </div>
      </section>
      </FadeSection>
    </>
  )
}
