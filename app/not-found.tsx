import Header from '../components/Header'
import Link from 'next/link'
import Image from 'next/image'
import articlesData from '../lib/articles.json'
import styles from './not-found.module.css'

export const metadata = {
  title: '404 : Page introuvable · Soara',
  robots: { index: false, follow: true },
}

const rubriques = [
  { label: 'Signal', href: '/signal' },
  { label: 'Géopolitique', href: '/geo' },
  { label: 'Économie', href: '/eco' },
  { label: 'Tech', href: '/tech' },
  { label: 'Environnement', href: '/env' },
  { label: 'Société', href: '/soc' },
  { label: 'Culture', href: '/culture' },
  { label: 'Portraits', href: '/portraits' },
  { label: 'Indicateurs', href: '/indicateurs' },
]

type Article = {
  slug: string
  title: string
  description: string
  category: string
  categoryLabel?: string
  date: string
  readTime?: string
  image?: string
  featured?: boolean
}

function pickReadings(): Article[] {
  const all = (articlesData as Article[]).filter(a => !(a as any).interviewType)
  const featured = all
    .filter(a => a.featured)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const fallback = all
    .slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const picks: Article[] = []
  for (const a of [...featured, ...fallback]) {
    if (picks.find(p => p.slug === a.slug)) continue
    picks.push(a)
    if (picks.length === 3) break
  }
  return picks
}

const categoryLabels: Record<string, string> = {
  signal: 'Signal',
  geo: 'Géopolitique',
  eco: 'Économie',
  tech: 'Tech',
  env: 'Environnement',
  soc: 'Société',
  culture: 'Culture',
  portraits: 'Portraits',
  portrait: 'Portrait',
  indicateurs: 'Indicateurs',
}

export default function NotFound() {
  const readings = pickReadings()

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.inner}>

          {/* Bandeau supérieur : eyebrow + filets */}
          <div className={styles.eyebrowRow}>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.eyebrow}>Erreur 404 · Page introuvable</span>
            <span className={styles.rule} aria-hidden="true" />
          </div>

          {/* Numéro géant */}
          <div className={styles.num} aria-hidden="true">404</div>

          {/* Titre éditorial */}
          <h1 className={styles.title}>
            La page que vous cherchiez<br />
            <em>n&apos;a pas (encore) été écrite.</em>
          </h1>

          {/* Sous-titre / chapeau */}
          <p className={styles.lede}>
            Cette adresse ne renvoie à aucun article publié sur Soara. Le lien est
            peut-être périmé, l&apos;URL mal recopiée, ou le sujet attend encore son
            auteur.
          </p>

          {/* Citation éditoriale */}
          <blockquote className={styles.quote}>
            <p>
              «&nbsp;Tout ce qui mérite d&apos;être su demande qu&apos;on le
              cherche au moins deux fois.&nbsp;»
            </p>
            <footer className={styles.quoteAttr}>Soara, note d&apos;intention</footer>
          </blockquote>

          {/* CTA principal + secondaire */}
          <div className={styles.ctas}>
            <Link href="/" className={styles.btnPrimary}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/signal" className={styles.btnSecondary}>
              Parcourir le Signal →
            </Link>
          </div>

          {/* Lectures recommandées */}
          <section className={styles.readings} aria-labelledby="readings-title">
            <div className={styles.sectionHead}>
              <span className={styles.sectionEyebrow}>À lire pendant que vous êtes ici</span>
              <h2 id="readings-title" className={styles.sectionTitle}>
                Trois lectures choisies
              </h2>
            </div>

            <div className={styles.readingsGrid}>
              {readings.map((a) => {
                const cat = a.categoryLabel || categoryLabels[a.category] || a.category
                const dateStr = a.date
                  ? new Date(a.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : ''
                return (
                  <Link
                    key={a.slug}
                    href={`/articles/${a.slug}`}
                    className={styles.card}
                  >
                    {a.image && (
                      <div className={styles.cardImgWrap}>
                        <Image
                          src={a.image}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 100vw, 360px"
                          className={styles.cardImg}
                        />
                      </div>
                    )}
                    <div className={styles.cardBody}>
                      <div className={styles.cardCat}>{cat}</div>
                      <h3
                        className={styles.cardTitle}
                        dangerouslySetInnerHTML={{ __html: a.title }}
                      />
                      <p className={styles.cardDesc}>{a.description}</p>
                      <div className={styles.cardMeta}>
                        {dateStr}
                        {a.readTime && <> · {a.readTime} min</>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Chips rubriques */}
          <section className={styles.rubriques} aria-label="Rubriques principales">
            <div className={styles.rubriquesLabel}>Ou explorer une rubrique</div>
            <div className={styles.chips}>
              {rubriques.map(r => (
                <Link key={r.href} href={r.href} className={styles.chip}>
                  {r.label}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
