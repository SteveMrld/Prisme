import ExplorerClient from './ExplorerClient'
import articlesData from '../../lib/articles.json'

export const metadata = {
  title: 'Explorer',
  description: 'Parcourez les analyses, portraits et grands formats de Soara.',
  alternates: { canonical: 'https://soara.fr/explorer' },
}

export default function ExplorerPage() {
  return <ExplorerClient articles={articlesData as any[]} />
}
