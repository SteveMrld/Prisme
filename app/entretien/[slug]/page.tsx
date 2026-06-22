import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'
import AudioPlayer from '../../../components/AudioPlayer'
import ShareButton from '../../../components/ShareButton'
import { getAllInterviews, getInterview } from '../../../lib/interviews'
import { categoryLabel } from '../../../lib/categories'
import { isFutureDay } from '../../../lib/dates'
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
  const interviewer = i.interviewer || 'Steve Moradel'
  // Gating piloté par la date : un statut « coming » ou une date dans
  // le futur affichent le teaser, sinon le contenu complet est libéré.
  const isComing = i.interviewStatus === 'coming' || isFutureDay(i.date)

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
        <div className={styles.portraitBlock} data-coming={isComing ? 'true' : undefined}>
          <picture>
            <img src={i.image} alt={i.interviewSubject} className={styles.portrait} />
          </picture>
        </div>

        <div className={styles.textCol}>
          <div className={styles.eyebrow}>
            <span className={styles.tag}>{label}</span>
            {i.interviewIssue !== undefined && (
              <span className={styles.num}>N°&nbsp;{i.interviewIssue}</span>
            )}
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

          <div className="no-print" style={{ margin: '16px 0 4px' }}>
            <ShareButton title={`${i.interviewSubject} · Soara`} />
          </div>

          {!isComing && (
            <div className={styles.byline}>Propos recueillis par {interviewer}</div>
          )}

          {!isComing && i.audioUrl && (
            <AudioPlayer
              src={i.audioUrl}
              minutes={i.readTime ? parseInt(i.readTime) : undefined}
              label="Écouter l'entretien"
            />
          )}

          {isComing && displayDeck && <p className={styles.deck}>{displayDeck}</p>}

          {/* En mode teaser, aucune question n'est exposée : on cache
              entièrement le bloc « LES QUESTIONS QUI SERONT POSÉES ». */}

          {isComing && (
            <div className={styles.coming}>
              <div className={styles.comingLabel}>
                À venir
              </div>
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

          {!isComing && content && (
            <p className={styles.editNote}>Cet entretien a été édité et condensé.</p>
          )}
        </div>
      </article>

      {(() => {
        // Tous les autres entretiens, y compris à venir (cartes teaser).
        // Ordre : publiés d'abord (date desc), puis grands entretiens à
        // paraître à date future (sooner first), puis ceux sans date
        // précise (placeholder).
        const otherComingPriority = (it: typeof i): number => {
          const future = isFutureDay(it.date)
          if (it.interviewStatus === 'published' && !future) return 0
          if (future) return 1
          return 2
        }
        const others = getAllInterviews()
          .filter(o => o.slug !== i.slug)
          .sort((a, b) => {
            const pa = otherComingPriority(a)
            const pb = otherComingPriority(b)
            if (pa !== pb) return pa - pb
            const da = new Date(a.date).getTime()
            const db = new Date(b.date).getTime()
            return pa === 1 ? da - db : db - da
          })
        if (others.length === 0) return null
        return (
          <section className={styles.others}>
            <h2 className={styles.othersTitle}>Autres entretiens</h2>
            <div className={styles.othersGrid}>
              {others.map(o => {
                const oLabel = o.interviewType === 'grand' ? 'Grand Entretien' : 'Interview'
                const oFuture = isFutureDay(o.date)
                const oComing = o.interviewStatus === 'coming' || oFuture
                const oComingLabel = oFuture ? `Disponible le ${formatFrDate(o.date)}` : 'À venir'
                return (
                  <Link
                    key={o.slug}
                    href={`/entretien/${o.slug}`}
                    className={styles.otherCard}
                    data-interview-type={o.interviewType}
                    data-coming={oComing ? 'true' : undefined}
                  >
                    <div className={styles.otherPortraitWrap}>
                      <img src={o.image} alt={o.interviewSubject} className={styles.otherPortrait} />
                      {oComing && (
                        <span className={styles.otherComing}>{oComingLabel}</span>
                      )}
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
