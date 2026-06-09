import Header from '../../components/Header'
import { AnimatedItem, AnimatedStat, HeroAnimated, ScrollProgress, MonthChart } from './RetroClient'
import Link from 'next/link'
import styles from './retrospective.module.css'
import { MOIS as mois } from '../../lib/retrospective-mois'

export const metadata = {
  title: 'Rétrospective 2025 · Soara',
  description: 'Les douze mois qui ont changé le monde. Retour analytique sur 2025.',
}

const catColors: Record<string, string> = {
  geo: 'var(--geo)', eco: 'var(--eco)', tech: 'var(--tech)',
  env: 'var(--env)', soc: 'var(--soc)', culture: 'var(--culture)',
}


export default function RetrospectivePage() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <HeroAnimated>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Rétrospective</span>
            <h1 className={styles.title}>2025 · L'année <em>des ruptures</em></h1>
            <p className={styles.subtitle}>
              Douze mois. Douze moments qui ont reconfiguré le monde.
              Retour analytique sur une année de basculements.
            </p>
          </div>
          <div className={styles.heroStats}>
            {[
              { n: '12', l: 'ruptures majeures' },
              { n: '5', l: 'continents touchés' },
              { n: '3', l: 'crises simultanées' },
            ].map((s, i) => (
              <div key={i} className={styles.heroStatItem}>
                <span className={styles.heroStatNum}>{s.n}</span>
                <span className={styles.heroStatLabel}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className={styles.heroYear}>2025</div>
        </div>
      </HeroAnimated>

      {/* BANDE CATÉGORIES */}
      <div className={styles.catBand}>
        {[
          { cat:'geo', label:'Géopolitique', n: mois.filter(m=>m.cat==='geo').length },
          { cat:'env', label:'Environnement', n: mois.filter(m=>m.cat==='env').length },
          { cat:'tech', label:'Tech', n: mois.filter(m=>m.cat==='tech').length },
          { cat:'eco', label:'Économie', n: mois.filter(m=>m.cat==='eco').length },
          { cat:'soc', label:'Société', n: mois.filter(m=>m.cat==='soc').length },
          { cat:'culture', label:'Culture', n: mois.filter(m=>m.cat==='culture').length },
        ].map(({ cat, label, n }) => (
          <div key={cat} className={styles.catPill} style={{ borderColor: catColors[cat] }}>
            <span style={{ color: catColors[cat], fontWeight: 700 }}>{n}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.timeline}>
        {mois.map((item, i) => (
          <AnimatedItem key={item.slug} index={i}>
            <div className={styles.item}>
              {/* BARRE COULEUR GAUCHE */}
              <div className={styles.itemBar} style={{ background: catColors[item.cat] }} />

              {/* MÉTA */}
              <div className={styles.itemMeta}>
                <div className={styles.itemNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.itemMois}>{item.m}</div>
                <div className={styles.itemCat} style={{ color: catColors[item.cat] }}>{item.catLabel}</div>
              </div>

              {/* CORPS */}
              <div className={styles.itemBody}>
                <h2 className={styles.itemTitre}>{item.titre}</h2>
                <p className={styles.itemDesc}>{item.desc}</p>
                <div className={styles.itemStat}>
                  <span className={styles.statNum}>
                    <AnimatedStat num={item.stat.num} label={item.stat.label} />
                    {item.stat.unit && <span className={styles.statUnit}> {item.stat.unit}</span>}
                  </span>
                  <span className={styles.statLabel}>{item.stat.label}</span>
                </div>
                <Link href={`/articles/${item.article}`} className={styles.itemCta}>
                  Lire l'analyse →
                </Link>
              </div>

              {/* VISUALISATION */}
              <div className={styles.itemViz}>
                <div className={styles.vizLabel}>{item.chartLabel}</div>
                <MonthChart
                  cat={item.cat}
                  chartType={item.chartType}
                  chartData={item.chartData}
                  color={catColors[item.cat].replace('var(--geo)', '#1A3E6B')
                    .replace('var(--eco)', '#B86A1A')
                    .replace('var(--tech)', '#4A2080')
                    .replace('var(--env)', '#2D6B4A')
                    .replace('var(--soc)', '#7A2D2D')
                    .replace('var(--culture)', '#6B1A3A')}
                />
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
