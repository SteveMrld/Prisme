import { notFound } from 'next/navigation'
import ArticleLayout from '../../../components/ArticleLayout'
import articlesData from '../../../lib/articles.json'
import fs from 'fs'
import path from 'path'

const categoryLabels: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait', concept: 'Concept'
}

export async function generateStaticParams() {
  return articlesData.map((article: any) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) return {}
  return {
    title: `${article.title} — Prisme`,
    description: article.description,
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesData.find((a: any) => a.slug === params.slug)
  if (!article) notFound()

  // Lire le contenu HTML
  const contentPath = path.join(process.cwd(), 'lib', 'content', `${params.slug}.html`)
  let content = ''
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }

  return (
    <ArticleLayout
      title={article.title}
      description={article.description}
      image={article.image}
      category={article.category}
      categoryLabel={categoryLabels[article.category] || 'Article'}
      readTime={article.readTime}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ArticleLayout>
  )
}
