import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'
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

  // Bloc "Pour prolonger" : configuration par lettre. Pour la lettre n°1,
  // deux articles cités dans le corps + un livre cité sans lien.
  const prolonger = params.slug === 'a-qui-appartient-l-orbite'
    ? {
        liens: [
          { slug: 'blackrock', label: findArticleTitle('blackrock') || 'BlackRock et Vanguard, les nouveaux maîtres du jeu' },
          { slug: 'dette-souveraine', label: findArticleTitle('dette-souveraine') || 'La dette souveraine' },
        ],
        livre: { auteur: 'Hannah Arendt', titre: 'Du mensonge à la violence' },
      }
    : null

  return (
    <>
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.head}>
            <div className={styles.bandeau}>
              La lettre du mardi <span className={styles.bandeauSep}>·</span> N° {String(lettre.numero).padStart(2, '0')}
            </div>
            <time className={styles.date} dateTime={lettre.dateISO}>{lettre.date}</time>
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

          {prolonger && (
            <aside className={styles.prolonger}>
              <h2 className={styles.prolongerTitle}>Pour prolonger</h2>
              <ul className={styles.prolongerList}>
                {prolonger.liens.map(l => (
                  <li key={l.slug} className={styles.prolongerItem}>
                    <Link href={hrefForArticle(l.slug)} className={styles.prolongerLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className={styles.prolongerItem}>
                  <span className={styles.prolongerAuthor}>{prolonger.livre.auteur},</span>{' '}
                  <cite className={styles.prolongerBook}>{prolonger.livre.titre}</cite>
                </li>
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
