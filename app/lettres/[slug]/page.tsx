import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'
import { FleuronIcon } from '../../../components/LettresIcons'
import lettres from '../../../lib/lettres.json'
import articlesData from '../../../lib/articles.json'
import styles from './lettre.module.css'

const BASE_URL = 'https://soara.fr'

export function generateStaticParams() {
  return (lettres as any[]).map(l => ({ slug: l.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const lettre = (lettres as any[]).find(l => l.slug === params.slug)
  if (!lettre) return {}
  const url = `${BASE_URL}/lettres/${params.slug}`
  return {
    title: `${lettre.title} · La lettre du mardi`,
    description: lettre.teaser,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${lettre.title} · La lettre du mardi`,
      description: lettre.teaser,
      siteName: 'Soara',
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${lettre.title} · La lettre du mardi`,
      description: lettre.teaser,
    },
  }
}

// Slugs des références "Pour prolonger" résolus depuis articles.json.
// Si un slug a une route grand format dédiée, on pointe directement /grands-formats/[slug].
const GRAND_FORMAT_REDIRECT = new Set([
  'pollinisation', 'chambre-ratification', 'architecture-desordre',
  'skunkworks', 'palantir', 'bases-militaires', 'dette-souveraine', 'terres-rares',
])

function hrefForArticle(slug: string): string {
  if (GRAND_FORMAT_REDIRECT.has(slug)) return `/grands-formats/${slug}`
  return `/articles/${slug}`
}

function findArticleTitle(slug: string): string | null {
  const a = (articlesData as any[]).find(x => x.slug === slug)
  if (!a) return null
  return (a.title || '').replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim()
}

export default function LettrePage({ params }: { params: { slug: string } }) {
  const lettre = (lettres as any[]).find(l => l.slug === params.slug)
  if (!lettre) notFound()

  const contentPath = path.join(process.cwd(), 'lib', 'content', 'lettres', `${lettre.content}.html`)
  let body = ''
  try {
    body = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    body = '<p>Contenu à venir.</p>'
  }

  // Bloc "Pour prolonger" : configuration par lettre. Mélange possible
  // de liens vers des articles ou grands formats du site (kind: 'link')
  // et de références sans lien (kind: 'book') rendues auteur + titre
  // italique via <cite>, avec un éventuel contexte court après le titre.
  type ProlongerLink = { kind: 'link'; slug: string; label: string }
  type ProlongerBook = { kind: 'book'; auteur: string; titre: string; context?: string }
  type ProlongerItem = ProlongerLink | ProlongerBook

  const PROLONGER: Record<string, ProlongerItem[]> = {
    'a-qui-appartient-l-orbite': [
      { kind: 'link', slug: 'blackrock', label: findArticleTitle('blackrock') || 'BlackRock et Vanguard, les nouveaux maîtres du jeu' },
      { kind: 'link', slug: 'dette-souveraine', label: findArticleTitle('dette-souveraine') || 'La dette souveraine' },
      { kind: 'book', auteur: 'Hannah Arendt', titre: 'Du mensonge à la violence' },
    ],
    'ce-que-letat-doit-a-un-enfant': [
      { kind: 'book', auteur: 'Édouard Durand', titre: '160 000 enfants. Violences sexuelles et déni social' },
      { kind: 'book', auteur: 'Alexis de Tocqueville', titre: 'De la démocratie en Amérique', context: 'sur le pouvoir tutélaire' },
      { kind: 'book', auteur: 'Albert Camus', titre: 'La Peste' },
      { kind: 'book', auteur: 'François Sureau', titre: 'Pour la liberté' },
    ],
  }
  const prolonger: ProlongerItem[] | null = PROLONGER[params.slug] || null

  return (
    <>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.head}>
            {/* Cartouche réduit : picto + label "La lettre du mardi",
                déclinaison de l'en-tête de /lettres, au-dessus du bandeau N°. */}
            <div className={styles.miniCartouche}>
              <span className={styles.miniCartouchePicto} aria-hidden="true">
                <FleuronIcon width={16} height={16} />
              </span>
              <span className={styles.miniCartoucheLabel}>La lettre du mardi</span>
            </div>
            <div className={styles.bandeau}>
              N° {String(lettre.numero).padStart(2, '0')}
              <span className={styles.bandeauSep}>·</span>
              <time dateTime={lettre.dateISO}>{lettre.date}</time>
            </div>
            <h1 className={styles.title}>{lettre.title}</h1>
            {lettre.teaser && <p className={styles.teaser}>{lettre.teaser}</p>}
          </header>

          <div
            className={`${styles.body} soara-article soara-lettre`}
            dangerouslySetInnerHTML={{ __html: body }}
          />

          <footer className={styles.signature}>
            <p className={styles.signatureSalut}>À mardi prochain,</p>
            <p className={styles.signatureAuteur}>{lettre.auteur}</p>
            {lettre.auteurRole && (
              <p className={styles.signatureRole}>{lettre.auteurRole}</p>
            )}
          </footer>

          {prolonger && prolonger.length > 0 && (
            <aside className={styles.prolonger}>
              <h2 className={styles.prolongerTitle}>Pour prolonger</h2>
              <ul className={styles.prolongerList}>
                {prolonger.map((item, idx) => (
                  <li key={idx} className={styles.prolongerItem}>
                    {item.kind === 'link' ? (
                      <Link href={hrefForArticle(item.slug)} className={styles.prolongerLink}>
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <span className={styles.prolongerAuthor}>{item.auteur},</span>{' '}
                        <cite className={styles.prolongerBook}>{item.titre}</cite>
                        {item.context && <>, {item.context}</>}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className={styles.cta}>
            <Link href="/lettres" className={styles.ctaBack}>← Toutes les lettres</Link>
            <Link href="/abonnement" className={styles.ctaSubscribe}>
              Recevoir la lettre chaque mardi →
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
