import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import PictureImg from '../../../components/PictureImg'
import { CONTRIBUTEURS, contributeurBySlug } from '../../../lib/contributeurs'
import { authorSameAs } from '../../../lib/authorLinks'
import articlesData from '../../../lib/articles.json'
import styles from './profil.module.css'

const BASE_URL = 'https://soara.fr'

const CATEGORIE_LABEL: Record<string, string> = {
  tech: 'Technologie',
  culture: 'Culture',
  geo: 'Géopolitique',
  env: 'Environnement',
  soc: 'Société',
  eco: 'Économie',
  portrait: 'Portrait',
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return ''
  return `${d} ${mois[m - 1]} ${y}`
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('')
}

function articlesDe(name: string) {
  return (articlesData as any[])
    .filter((a) => a.author === name)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export async function generateStaticParams() {
  return CONTRIBUTEURS.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = contributeurBySlug(params.slug)
  if (!c) return {}
  const description = c.bio.length > 160 ? `${c.bio.slice(0, 157)}…` : c.bio
  const url = `${BASE_URL}/contributeurs/${c.slug}`
  return {
    title: `${c.name} — Contributeur`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'profile',
      title: `${c.name} — Soara`,
      description,
      url,
      images: c.portrait ? [`${BASE_URL}${c.portrait}`] : undefined,
    },
  }
}

export default function ContributeurPage({ params }: { params: { slug: string } }) {
  const c = contributeurBySlug(params.slug)
  if (!c) notFound()

  const articles = articlesDe(c.name)

  const sameAs = authorSameAs(c.name)
  if (c.linkedin && !sameAs.includes(c.linkedin)) sameAs.push(c.linkedin)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: c.name,
      description: c.bio,
      url: `${BASE_URL}/contributeurs/${c.slug}`,
      ...(c.portrait ? { image: `${BASE_URL}${c.portrait}` } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
  }

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className={styles.breadcrumb}>
        <Link href="/contributeurs">Contributeurs</Link>
        <span className={styles.sep}>·</span>
        <span className={styles.current}>{c.name}</span>
      </nav>

      <header className={styles.profil}>
        <div className={styles.portraitWrap}>
          {c.portrait
            ? <PictureImg src={c.portrait} alt={c.name} className={styles.portrait} style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            : <div className={styles.portrait}>{initials(c.name)}</div>
          }
        </div>
        <div className={styles.profilText}>
          <span className={styles.eyebrow}>Contributeur</span>
          <h1 className={styles.name}>{c.name}</h1>
          <div className={styles.role}>{c.role}</div>
          <p className={styles.bio}>{c.bio}</p>
          <div className={styles.domaines}>
            {c.domaines.map((d) => (
              <span key={d} className={styles.domaine}>{d}</span>
            ))}
          </div>
          {c.linkedin && (
            <a href={c.linkedin} className={styles.linkedin} target="_blank" rel="noopener">
              LinkedIn →
            </a>
          )}
        </div>
      </header>

      <section className={styles.articles}>
        <h2 className={styles.articlesTitle}>
          {articles.length > 0
            ? <>Ses textes <em>pour Soara</em></>
            : <>Bientôt <em>publié</em></>
          }
        </h2>

        {articles.length > 0 ? (
          <div className={styles.grid}>
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={a.grandFormatUrl || `/articles/${a.slug}`}
                className={styles.card}
                data-cat={a.category}
              >
                {a.image && (
                  <div className={styles.cardImg}>
                    <img src={a.image} alt="" loading="lazy" />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <span className={styles.cardCat}>{CATEGORIE_LABEL[a.category] || a.category}</span>
                  <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: a.title }} />
                  {a.description && <p className={styles.cardDesc}>{a.description}</p>}
                  <div className={styles.cardMeta}>
                    {formatDate(a.date)}
                    {a.readTime ? <span className={styles.dot}>·</span> : null}
                    {a.readTime ? `${a.readTime} min` : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            Les premiers textes de {c.name} pour Soara paraîtront prochainement.
          </p>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
