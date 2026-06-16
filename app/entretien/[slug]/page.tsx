import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'
import { getAllInterviews, getInterview } from '../../../lib/interviews'
import { categoryLabel } from '../../../lib/categories'
import styles from './entretien.module.css'

const BASE_URL = 'https://soara.fr'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return getAllInterviews().map((i) => ({ slug: i.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const i = getInterview(params.slug)
  if (!i) return {}

  const label = i.interviewType === 'grand' ? 'Le Grand Entretien' : 'Interview'
  const subject = i.interviewSubject || i.title.replace(/<[^>]+>/g, '')
  const title = `${subject}, ${label}`
  const url = `${BASE_URL}/entretien/${i.slug}`
  const ogImage = i.image || `${BASE_URL}/og-default.jpg`

  // Présence d'une version EN (fichier `<slug>-en.html`). Sert à émettre
  // hreflang fr/en/x-default. Routage EN : ?lang=en.
  const enPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}-en.html`)
  let hasEnglishMeta = false
  try { hasEnglishMeta = fs.existsSync(enPath) } catch {}

  return {
    title,
    description: i.description,
    alternates: {
      canonical: url,
      ...(hasEnglishMeta ? {
        languages: {
          'fr-FR': url,
          'en-US': `${url}?lang=en`,
          'x-default': url,
        },
      } : {}),
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description: i.description,
      siteName: 'Soara',
      locale: 'fr_FR',
      images: [{ url: ogImage, width: 1200, height: 630, alt: subject }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: i.description,
      images: [ogImage],
    },
  }
}

// JSON-LD NewsArticle pour l'entretien. headline = "Sujet, Le Grand Entretien"
// ou "Sujet, Interview" selon le type, pour rester cohérent avec l'OG.
// Normalise YYYY-MM-DD → ISO 8601 complet pour Google Rich Results.
function toIsoDateTime(raw?: string): string {
  if (!raw) return ''
  const d = new Date(raw)
  return isNaN(d.getTime()) ? raw : d.toISOString()
}

function buildInterviewJsonLd(i: ReturnType<typeof getInterview>, slug: string) {
  if (!i) return null
  const label = i.interviewType === 'grand' ? 'Le Grand Entretien' : 'Interview'
  const subject = i.interviewSubject || i.title.replace(/<[^>]+>/g, '')
  const headline = `${subject}, ${label}`
  const url = `${BASE_URL}/entretien/${slug}`
  const imageRaw: string = i.image || '/og-default.jpg'
  const imageAbs = imageRaw.startsWith('http') ? imageRaw : `${BASE_URL}${imageRaw}`
  const author = i.author || 'Steve Moradel'
  const authorEntry: Record<string, any> = { '@type': 'Person', name: author }
  if (i.authorRole) authorEntry.jobTitle = i.authorRole
  const datePublished = toIsoDateTime(i.date)
  const dateModified = toIsoDateTime((i as any).dateModified || i.date)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    description: i.description || '',
    image: [imageAbs],
    datePublished,
    dateModified,
    author: [authorEntry],
    publisher: {
      '@type': 'Organization',
      name: 'Soara',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}

function renderSubjectName(i: ReturnType<typeof getInterview>) {
  if (!i) return null
  const full = i.interviewSubject || ''
  const italic = i.interviewSubjectItalic || ''
  if (italic && full.endsWith(italic)) {
    const head = full.slice(0, full.length - italic.length).trim()
    return (
      <>
        {head} <em>{italic}</em>
      </>
    )
  }
  return full
}

export default function EntretienPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { lang?: string }
}) {
  const i = getInterview(params.slug)
  if (!i) notFound()

  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const label = i.interviewType === 'grand' ? 'Grand Entretien' : 'Interview'
  const catLabel = categoryLabel(i.category, (i as any).categoryLabel)
  const isComing = i.interviewStatus === 'coming'

  let content = ''
  let hasEnglish = false
  if (!isComing) {
    try {
      const enPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}-en.html`)
      hasEnglish = fs.existsSync(enPath)
    } catch {}
    const file = lang === 'en' && hasEnglish ? `${params.slug}-en.html` : `${params.slug}.html`
    const p = path.join(process.cwd(), 'lib', 'content', file)
    try {
      content = fs.readFileSync(p, 'utf-8')
    } catch {
      content = ''
    }
  }

  const displayTitle = lang === 'en' && i.titleEn ? i.titleEn : i.title
  const displayDeck = i.interviewDeck
  const interviewJsonLd = buildInterviewJsonLd(i, params.slug)

  return (
    <>
      {interviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(interviewJsonLd) }}
        />
      )}
      <Header />

      <article className={styles.article} data-interview-type={i.interviewType}>
        <div className={styles.portraitBlock}>
          <picture>
            <img src={i.image} alt={i.interviewSubject} className={styles.portrait} />
          </picture>
        </div>

        <div className={styles.textCol}>
          <div className={styles.eyebrow}>
            <span className={styles.tag}>{label}</span>
            <span className={styles.num}>N° {i.interviewIssue}</span>
            {catLabel && (
              <span className={styles.cat} data-cat={i.category}>
                {catLabel}
              </span>
            )}
            {hasEnglish && (
              <Link
                href={`/entretien/${i.slug}?lang=${lang === 'en' ? 'fr' : 'en'}`}
                className={styles.langLink}
              >
                {lang === 'en' ? 'Lire en français' : 'Read in English'}
              </Link>
            )}
          </div>

          <h1 className={styles.name}>{renderSubjectName(i)}</h1>

          {i.interviewRole && <div className={styles.role}>{i.interviewRole}</div>}

          {isComing && displayDeck && <p className={styles.deck}>{displayDeck}</p>}

          {isComing && i.interviewQuestions && i.interviewQuestions.length > 0 && (
            <div className={styles.questionsSection}>
              <div className={styles.questionsLabel}>Les questions qui seront posées</div>
              <div className={styles.questions}>
                {i.interviewQuestions.map((q, idx) => (
                  <div key={idx} className={styles.question}>
                    <span className={styles.questionNum}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.questionText}>«&nbsp;{q}&nbsp;»</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isComing && (
            <div className={styles.coming}>
              <div className={styles.comingLabel}>À paraître prochainement</div>
              <p className={styles.comingDesc}>Inscrivez-vous pour être notifié à la parution.</p>
              <div className={styles.comingActions}>
                <Link href="/abonnement" className={styles.comingBtn}>
                  S'abonner pour lire en avant-première
                </Link>
                <Link href="/connexion" className={styles.comingLink}>
                  Déjà abonné ? Se connecter →
                </Link>
              </div>
            </div>
          )}

          {!isComing && content && (
            <div className={styles.body} dangerouslySetInnerHTML={{ __html: content }} />
          )}

          {!isComing && !content && (
            <p className={styles.empty}>Contenu à venir.</p>
          )}

          {i.interviewQuote && !isComing && (
            <blockquote className={styles.pullQuote}>«&nbsp;{i.interviewQuote}&nbsp;»</blockquote>
          )}
        </div>
      </article>

      {(() => {
        const others = getAllInterviews().filter(o => o.slug !== i.slug).slice(0, 3)
        if (others.length === 0) return null
        return (
          <section className={styles.others}>
            <h2 className={styles.othersTitle}>Autres entretiens</h2>
            <div className={styles.othersGrid}>
              {others.map(o => {
                const oLabel = o.interviewType === 'grand' ? 'Grand Entretien' : 'Interview'
                return (
                  <Link
                    key={o.slug}
                    href={`/entretien/${o.slug}`}
                    className={styles.otherCard}
                    data-interview-type={o.interviewType}
                  >
                    <div className={styles.otherPortraitWrap}>
                      <img src={o.image} alt={o.interviewSubject} className={styles.otherPortrait} />
                    </div>
                    <div className={styles.otherEyebrow}>{oLabel}</div>
                    <div className={styles.otherName}>{o.interviewSubject}</div>
                    <div className={styles.otherDeck}>{o.interviewDeck}</div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })()}

      <footer className={styles.footer}>
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
