import ExplorerClient from './ExplorerClient'
import articlesData from '../../lib/articles.json'

export const metadata = {
  title: 'Explorer · Soara',
  description: 'Parcourez les analyses, portraits et grands formats de Soara.',
}

export default function ExplorerPage() {
  return <ExplorerClient articles={articlesData as any[]} />
}
