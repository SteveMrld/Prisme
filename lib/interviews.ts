import articlesData from './articles.json'
import { isFutureDay } from './dates'

export type InterviewType = 'grand' | 'classique'
export type InterviewStatus = 'coming' | 'published'

export type Interview = {
  slug: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  date: string
  readTime: string
  image: string
  imageCredit?: string
  category: string
  secondaryCategory?: string
  author: string
  authorRole?: string
  interviewType: InterviewType
  interviewStatus: InterviewStatus
  /* Numérotation réservée aux grands entretiens. Les interviews
     classiques n'ont pas de N°. */
  interviewIssue?: number
  interviewSubject: string
  interviewSubjectItalic?: string
  interviewRole?: string
  interviewDeck: string
  interviewQuote?: string
  interviewQuestions?: string[]
  featuredOnHome?: boolean
  // Point de cadrage object-position pour la carte du carousel home.
  // Défaut CSS : center 18%. À surcharger pour les portraits au ratio
  // atypique (ex. Diarra, source 1080x2372) qui se recadrent mal.
  cardFocus?: string
  // Intervieweur (« Propos recueillis par … »). Défaut : Steve Moradel.
  interviewer?: string
  // URL du fichier audio (« Écouter cet entretien »), si disponible.
  audioUrl?: string
}

const all: Interview[] = (articlesData as any[]).filter(
  (a) => a.interviewType === 'grand' || a.interviewType === 'classique'
) as Interview[]

export function getAllInterviews(): Interview[] {
  return all
}

export function getInterview(slug: string): Interview | undefined {
  return all.find((i) => i.slug === slug)
}

export function getNextInterviewForHome(): Interview | undefined {
  // Override éditorial : si un entretien porte featuredOnHome=true, il prime.
  const pinned = all.find((i) => i.featuredOnHome === true)
  if (pinned) return pinned

  const published = all
    .filter((i) => i.interviewStatus === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  if (published.length > 0) return published[0]

  const coming = all
    .filter((i) => i.interviewStatus === 'coming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return coming[0]
}

/* Partition home des entretiens. Source de vérité unique pour la zone
   vedette et la rangée du dessous, garantissant qu'aucun entretien ne
   double-apparaît. featured = grands entretiens publiés et dont la date
   est passée (plafond 2, plus récents en tête). others = tout le reste,
   trié par priorité de publication : publiés > coming-future > coming-
   sans-date-précise. */
export function getHomeInterviewsPartition(): { featured: Interview[]; others: Interview[] } {
  const isPublishedGrand = (i: Interview) =>
    i.interviewType === 'grand'
    && i.interviewStatus === 'published'
    && !isFutureDay(i.date)

  const featured = all
    .filter(isPublishedGrand)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  const featuredSlugs = new Set(featured.map((i) => i.slug))
  const comingPriority = (i: Interview): number => {
    const future = isFutureDay(i.date)
    if (i.interviewStatus === 'published' && !future) return 0
    if (future) return 1
    return 2
  }
  const others = all
    .filter((i) => !featuredSlugs.has(i.slug))
    .sort((a, b) => {
      const pa = comingPriority(a)
      const pb = comingPriority(b)
      if (pa !== pb) return pa - pb
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return pa === 1 ? da - db : db - da
    })
    .slice(0, 12)

  return { featured, others }
}
