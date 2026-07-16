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
  /* Épingle un entretien dans la zone vedette de la home, y compris
     quand il est encore « à venir » (date future ou statut coming). Sert
     à teaser un grand entretien à paraître depuis la home. */
  featuredOnHome?: boolean
  // Dépublie l'entretien : conservé dans le repo mais retiré de tous les
  // affichages (vedette, rangée home, explorer, page détail). Réversible.
  hidden?: boolean
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
  (a) => (a.interviewType === 'grand' || a.interviewType === 'classique') && !a.hidden
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
   double-apparaît. featured = d'abord les grands entretiens marqués
   featuredOnHome (même à venir), puis complétés par les publiés les plus
   récents, plafond 2. others = tout le reste, trié par priorité :
   publiés > coming-future > coming-sans-date-précise. */
export function getHomeInterviewsPartition(): { featured: Interview[]; others: Interview[] } {
  const isGrand = (i: Interview) => i.interviewType === 'grand'
  const isPublishedGrand = (i: Interview) =>
    isGrand(i)
    && i.interviewStatus === 'published'
    && !isFutureDay(i.date)

  const pinned = all
    .filter((i) => i.featuredOnHome === true)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pinnedSlugs = new Set(pinned.map((i) => i.slug))
  const publishedFill = all
    .filter((i) => isPublishedGrand(i) && !pinnedSlugs.has(i.slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Si un entretien est épinglé, il occupe seul la vedette. Sinon, on
  // complète avec les grands entretiens publiés les plus récents (max 2).
  const featured = (pinned.length > 0 ? pinned : publishedFill).slice(0, 2)
  const featuredSlugs = new Set(featured.map((i) => i.slug))
  /* Rangée home : d'abord ce qui arrive (parution la plus proche en tête),
     ensuite les entretiens parus, du plus récent au plus ancien. La rangée
     annonce la suite avant de proposer les archives. */
  const isComingRow = (i: Interview): boolean =>
    i.interviewStatus === 'coming' || isFutureDay(i.date)

  const others = all
    .filter((i) => !featuredSlugs.has(i.slug))
    .sort((a, b) => {
      const ca = isComingRow(a)
      const cb = isComingRow(b)
      if (ca !== cb) return ca ? -1 : 1
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return ca ? da - db : db - da
    })
    .slice(0, 12)

  return { featured, others }
}
