import Header from '../../components/Header'
import styles from './visuels.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Visuels — Prisme',
  description: 'Motions, infographies et concepts animés. Les idées qui se comprennent mieux en les voyant.',
}

interface Visual {
  slug: string
  title: string
  subtitle?: string
  category: string
  categoryColor: string
  description: string
  slides?: number
  series?: string
}

const VISUALS: Visual[] = [
  // ── Concepts
  {
    slug: 'cygne-noir',
    title: 'Le Cygne Noir',
    subtitle: 'Les événements que personne ne voit venir',
    category: 'Concept',
    categoryColor: 'var(--concept)',
    description: 'Le concept de Nassim Taleb décrypté en 13 slides animées — imprévisibilité, biais cognitifs, résilience.',
    slides: 13,
  },
  {
    slug: 'overton',
    title: 'La Fenêtre d'Overton',
    subtitle: 'Comment l'impensable devient politique',
    category: 'Concept',
    categoryColor: 'var(--concept)',
    description: 'Visualisation du spectre des idées politiquement acceptables, et des mécanismes qui le font glisser.',
    slides: 9,
  },
  // ── Géopolitique
  {
    slug: 'predateurs',
    title: 'Le Monde des Prédateurs',
    subtitle: 'USA · Russie · Chine',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Les trois grandes puissances et leurs stratégies d'influence à l'échelle du globe.',
  },
  {
    slug: 'predateurs-carte',
    title: 'Prédateurs — Carte',
    subtitle: 'Zones d'influence mondiales',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Carte interactive des zones d'influence et de contrôle des trois puissances.',
    series: 'Prédateurs',
  },
  {
    slug: 'afrique',
    title: 'Afrique',
    subtitle: 'La fin d'un monde',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Comment le continent africain se reconfigure face au retrait occidental et à la montée des nouvelles puissances.',
  },
  {
    slug: 'arctique',
    title: 'Arctique',
    subtitle: 'La fonte qui change le monde',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'La fonte des glaces ouvre de nouvelles routes maritimes et relance la compétition géopolitique au pôle Nord.',
  },
  {
    slug: 'chine',
    title: 'La Chine',
    subtitle: 'Montée en puissance',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Stratégie d'influence économique, militaire et technologique de la Chine sur la scène mondiale.',
  },
  {
    slug: 'france_maritime',
    title: 'France Maritime',
    subtitle: 'L'empire ignoré',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'La France dispose du 2e espace maritime mondial. Un atout stratégique encore sous-estimé.',
  },
  {
    slug: 'taiwan',
    title: 'Taïwan',
    subtitle: 'Le détroit le plus dangereux du monde',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Enjeux militaires, économiques et technologiques autour du détroit de Taïwan.',
  },
  {
    slug: 'venezuela',
    title: 'Venezuela',
    subtitle: 'La doctrine Monroe est de retour',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Comment Washington ressort la doctrine Monroe pour réaffirmer son hégémonie en Amérique latine.',
  },
  {
    slug: 'empires',
    title: 'La France face à la loi des empires',
    subtitle: 'Cycles de puissance',
    category: 'Géopolitique',
    categoryColor: 'var(--geo)',
    description: 'Tous les empires suivent un cycle. Où en est la France dans ce mouvement long ?',
  },
  // ── Économie
  {
    slug: 'dollar1',
    title: 'Le Dollar I',
    subtitle: 'La naissance d'un empire',
    category: 'Économie',
    categoryColor: 'var(--eco)',
    description: 'Comment le dollar est devenu la monnaie de réserve mondiale — de Bretton Woods à la domination absolue.',
    series: 'Trilogie Dollar',
  },
  {
    slug: 'dollar2',
    title: 'Le Dollar II',
    subtitle: 'L'arme financière',
    category: 'Économie',
    categoryColor: 'var(--eco)',
    description: 'Le dollar comme instrument de puissance : sanctions, pétrodollar, SWIFT.',
    series: 'Trilogie Dollar',
  },
  {
    slug: 'dollar3',
    title: 'Le Dollar III',
    subtitle: 'Le crépuscule ?',
    category: 'Économie',
    categoryColor: 'var(--eco)',
    description: 'La dédollarisation est-elle en marche ? BRICS, yuan, cryptos — les alternatives crédibles.',
    series: 'Trilogie Dollar',
  },
  {
    slug: 'blackrock',
    title: 'BlackRock',
    subtitle: 'La concentration du capital',
    category: 'Économie',
    categoryColor: 'var(--eco)',
    description: 'Comment le plus grand gestionnaire d'actifs du monde est devenu un acteur politique à part entière.',
  },
  {
    slug: 'fiscalite',
    title: 'L'impôt que vous ne voyez pas',
    subtitle: 'Fiscalité invisible',
    category: 'Économie',
    categoryColor: 'var(--eco)',
    description: 'TVA, cotisations, taxes cachées — la pression fiscale réelle sur les ménages français.',
  },
  // ── Tech
  {
    slug: 'musk',
    title: 'Elon Musk',
    subtitle: 'L'homme qui défie son époque',
    category: 'Tech',
    categoryColor: 'var(--tech)',
    description: 'Portrait géopolitique d'Elon Musk — Tesla, SpaceX, X, xAI. Quand un individu devient une puissance.',
  },
  {
    slug: 'rushkoff',
    title: 'Rushkoff',
    subtitle: 'Quand les bâtisseurs fuient leur propre création',
    category: 'Tech',
    categoryColor: 'var(--tech)',
    description: 'Douglas Rushkoff face aux ultra-riches de la Silicon Valley qui préparent leur bunker de fin du monde.',
  },
  {
    slug: 'semico',
    title: 'Semi-conducteurs',
    subtitle: 'La bataille des puces',
    category: 'Tech',
    categoryColor: 'var(--tech)',
    description: 'La chaîne de valeur des semi-conducteurs décryptée — et pourquoi elle est au cœur de la guerre technologique.',
  },
  {
    slug: 'techgeo',
    title: 'TechGeo',
    subtitle: 'La bataille pour le sous-sol du monde numérique',
    category: 'Tech',
    categoryColor: 'var(--tech)',
    description: 'Câbles sous-marins, data centers, orbites satellitaires — la géographie physique d'internet.',
  },
  {
    slug: 'technosolutionnisme',
    title: 'Technosolutionnisme',
    subtitle: 'Les limites de l'idéologie',
    category: 'Tech',
    categoryColor: 'var(--tech)',
    description: 'Quand la technologie est présentée comme la réponse à tout — et pourquoi c'est un problème.',
  },
  // ── Environnement
  {
    slug: 'eau-carte',
    title: 'Carte des bassins transfrontaliers',
    subtitle: 'L'eau, enjeu géopolitique',
    category: 'Environnement',
    categoryColor: 'var(--env)',
    description: 'Visualisation mondiale des bassins hydrographiques partagés entre plusieurs États.',
  },
]

const CATEGORY_ORDER = ['Concept', 'Géopolitique', 'Économie', 'Tech', 'Environnement']

function groupByCategory(visuals: Visual[]) {
  const groups: Record<string, Visual[]> = {}
  for (const cat of CATEGORY_ORDER) groups[cat] = []
  for (const v of visuals) {
    if (!groups[v.category]) groups[v.category] = []
    groups[v.category].push(v)
  }
  return groups
}

export default function VisuelsPage() {
  const groups = groupByCategory(VISUALS)
  const total = VISUALS.length

  return (
    <>
      <Header activeNav="concept" />

      {/* BANDEAU */}
      <div className={styles.band}>
        <div className={styles.bandInner}>
          <div className={styles.bandLabel}>Visuels</div>
          <h1 className={styles.bandTitle}>Motions &amp; Concepts</h1>
          <p className={styles.bandDesc}>
            Infographies animées, cartes interactives, visualisations de concepts.
            Les idées qui se comprennent mieux en les voyant.
          </p>
        </div>
        <div className={styles.bandCount}>{total} visuels</div>
      </div>

      {/* CATALOGUE PAR RUBRIQUE */}
      <div className={styles.catalogue}>
        {CATEGORY_ORDER.map(cat => {
          const items = groups[cat]
          if (!items || items.length === 0) return null
          return (
            <section key={cat} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle} style={{ color: items[0].categoryColor }}>
                  {cat}
                </h2>
                <span className={styles.sectionCount}>{items.length}</span>
              </div>
              <div className={styles.grid}>
                {items.map(v => (
                  <a
                    key={v.slug}
                    href={`/visuels/${v.slug}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.card}
                  >
                    <div className={styles.cardAccent} style={{ background: v.categoryColor }} />
                    <div className={styles.cardBody}>
                      {v.series && (
                        <div className={styles.series}>{v.series}</div>
                      )}
                      <div className={styles.cardEyebrow}>
                        <span className={styles.cardTag} style={{ color: v.categoryColor }}>
                          {v.category}
                        </span>
                        {v.slides && (
                          <span className={styles.cardSlides}>{v.slides} slides</span>
                        )}
                      </div>
                      <h3 className={styles.cardTitle}>{v.title}</h3>
                      {v.subtitle && (
                        <p className={styles.cardSubtitle}>{v.subtitle}</p>
                      )}
                      <p className={styles.cardDesc}>{v.description}</p>
                      <span className={styles.cardCta} style={{ color: v.categoryColor }}>
                        Voir le motion →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pris<em>me</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Prisme · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
