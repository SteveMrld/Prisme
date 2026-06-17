import articlesData from './articles.json'

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
  interviewIssue: number
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
