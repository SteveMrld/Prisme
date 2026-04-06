export const dynamic = 'force-dynamic'

import Header from '../components/Header'
import NewsletterForm from '../components/NewsletterForm'
import ConfinsTV from '../components/ConfinsTV'
import styles from './page.module.css'
import Link from 'next/link'
import articlesData from '../lib/articles.json'
import { FadeSection, FadeCard, StaggerGrid, StaggerItem } from './HomeClient'
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
const heroAside = heroAsideSlugs.map(slug => {
  const a = getArticle(slug)
  return { ...a, excerpt: a.description }
})

const grandsFormatsSlugs = [
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

      {/* GRAND ENTRETIEN */}
      <FadeSection>
      <section className={styles.ge}>
        <div className={styles.geLeft}>
          <div className={styles.geEyebrow}>
            <span className={styles.geN}>N°1</span>
            <span className={styles.geLabel}>Le Grand Entretien</span>
          </div>
          <h2 className={styles.geName}>
            Cheick Modibo<br /><em>Diarra</em>
          </h2>
          <div className={styles.geRole}>
            Astrophysicien · NASA · Microsoft Afrique · Ancien Premier ministre du Mali
          </div>
          <p className={styles.geIntro}>
            Il a guidé des sondes spatiales depuis la NASA, restructuré Microsoft en Afrique, 
            et gouverné le Mali dans la tourmente. Cheick Modibo Diarra pense le continent 
            depuis les étoiles — et depuis le terrain.
          </p>
          <Link href="/entretien/diarra" className={styles.geCta}>
            Lire l'entretien dès sa parution →
          </Link>
          <div className={styles.geBadge}>Parution · 1er juin 2026</div>
        </div>
        <div className={styles.geRight}>
          <img src="/portraits/diarra.png" alt="Cheick Modibo Diarra" className={styles.geImg} />
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
          <h2 className={styles.heroTitle}><span className={styles.pBadge}>C</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span> <span dangerouslySetInnerHTML={{ __html: heroArticle.title }} /></h2>
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
          {grandsFormats.map((article, i) => (
            <StaggerItem key={article.slug} index={i}>
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
              <div className={styles.gfTitle}><span className={styles.pBadge}>C</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
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

      {/* ── CHAÎNE CONFINS ── */}
      <FadeSection>
        <ConfinsTV />
      </FadeSection>

      {/* ── STATS CONFINS ── */}
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

      {/* ── À LA UNE ── */}
      <FadeSection>
      <section className={styles.latestSection}>
        <div className={styles.latestHead}>
          <div className={styles.latestLabel}>À la une</div>
        </div>
        <div className={styles.latestGrid}>
          {(articlesData as any[]).filter((a: any) => a.featured).map((article: any) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.latestCard}>
              {article.image && (
                <div className={styles.latestImgWrap}>
                  <img src={article.image} alt={article.title} className={styles.latestImg} />
                </div>
              )}
              <div className={styles.latestBody}>
                <span className={styles.latestTag} style={{ color: categoryColors[article.category] }}>
                  {categoryLabels[article.category] || article.category}
                </span>
                <div className={styles.latestTitle}><span className={styles.pBadge}>C</span> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
                {article.author && <div className={styles.latestAuthor}>Par {article.author}</div>}
                <span className={styles.latestTime}>{article.readTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </FadeSection>

      {/* ── DERNIÈRES PUBLICATIONS + POPULAIRES — layout Atlantic ── */}
      <FadeSection>
      <section className={styles.atlanticSection}>
        <div className={styles.atlanticInner}>

          {/* COLONNE GAUCHE — Dernières */}
          <div className={styles.atlanticLeft}>
            <div className={styles.atlanticHead}>
              <span className={styles.atlanticLabel}>Dernières publications</span>
              <Link href="/geo" className={styles.atlanticSeeAll}>Tout voir →</Link>
            </div>
            {(articlesData as any[])
              .filter((a: any) => !a.featured)
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 6)
              .map((article: any) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.atlanticItem}>
                <img src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120'} alt={article.title} className={styles.atlanticThumb} />
                <div className={styles.atlanticItemBody}>
                  <span className={styles.atlanticItemCat} style={{ color: categoryColors[article.category] }}>
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <div className={styles.atlanticItemTitle}><span className={styles.pBadge}>C</span> <span dangerouslySetInnerHTML={{ __html: article.title }} /></div>
                  {article.author && <div className={styles.atlanticItemAuthor}>{article.author}</div>}
                </div>
              </Link>
            ))}
          </div>

          {/* COLONNE DROITE — Populaires */}
          <div className={styles.atlanticRight}>
            <div className={styles.atlanticHead}>
              <span className={styles.atlanticLabel}>Populaires</span>
            </div>
            {(articlesData as any[])
              .filter((a: any) => ['afrique', 'lecture', 'chine', 'empires', 'ia'].includes(a.slug))
              .sort((a: any, b: any) => ['afrique', 'lecture', 'chine', 'empires', 'ia'].indexOf(a.slug) - ['afrique', 'lecture', 'chine', 'empires', 'ia'].indexOf(b.slug))
              .slice(0, 5)
              .map((article: any, i: number) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.popularItem}>
                <span className={styles.popularNum}>{i + 1}</span>
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
              <div className={styles.portraitBody}>
                <span className={styles.portraitTag} style={{ color: 'var(--portrait)' }}>Portrait</span>
                <div className={styles.portraitTitle}><span className={styles.pBadge}>C</span><span className={styles.audioBadge} title="Disponible en audio">🎧</span>{article.title}</div>
                <p className={styles.portraitDesc}>{article.description}</p>
                <span className={styles.portraitCta}>Lire →</span>
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
