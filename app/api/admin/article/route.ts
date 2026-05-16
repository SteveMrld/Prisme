import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = 'SteveMrld/Prisme'
const BRANCH = 'main'
const SLUG_PATTERN = /^[a-z0-9-]+$/

type Article = {
  slug: string
  title: string
  description?: string
  category?: string
  categoryLabel?: string
  date?: string
  readTime?: string
  image?: string
  featured?: boolean
  premium?: boolean
  author?: string
  [key: string]: unknown
}

type ArticleBody = {
  article: Article
  content: string
  isEdit?: boolean
}

type GithubFile = {
  content: string
  sha: string
}

async function getFileSHA(path: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.sha || null
}

async function pushToGitHub(path: string, content: string, message: string, sha?: string | null) {
  const body: {
    message: string
    content: string
    branch: string
    sha?: string
  } = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return res.ok
}

async function isAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === 'steve.moradel@gmail.com'
}

// GET — liste tous les articles
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/lib/articles.json`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  const data = (await res.json()) as GithubFile
  const articles = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8')) as Article[]
  return NextResponse.json({ articles })
}

// POST — créer ou mettre à jour un article
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { article, content, isEdit } = (await req.json()) as ArticleBody

  if (!article?.slug || !SLUG_PATTERN.test(article.slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
  }

  // 1. Mettre à jour articles.json
  const articlesRes = await fetch(`https://api.github.com/repos/${REPO}/contents/lib/articles.json`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  const articlesFile = (await articlesRes.json()) as GithubFile
  const articles = JSON.parse(Buffer.from(articlesFile.content, 'base64').toString('utf-8')) as Article[]

  const idx = articles.findIndex((a) => a.slug === article.slug)
  if (idx >= 0) {
    articles[idx] = article
  } else {
    articles.unshift(article)
  }

  const articlesPushed = await pushToGitHub(
    'lib/articles.json',
    JSON.stringify(articles, null, 2),
    `${isEdit ? 'edit' : 'add'}: article "${article.slug}"`,
    articlesFile.sha
  )

  // 2. Mettre à jour le contenu HTML
  const contentPath = `lib/content/${article.slug}.html`
  const contentSHA = await getFileSHA(contentPath)
  const contentPushed = await pushToGitHub(
    contentPath,
    content,
    `${isEdit ? 'edit' : 'add'}: content "${article.slug}"`,
    contentSHA
  )

  if (!articlesPushed || !contentPushed) {
    return NextResponse.json({ error: 'GitHub push failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE — supprimer un article
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = (await req.json()) as { slug?: string }

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
  }

  const articlesRes = await fetch(`https://api.github.com/repos/${REPO}/contents/lib/articles.json`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  const articlesFile = (await articlesRes.json()) as GithubFile
  const articles = JSON.parse(Buffer.from(articlesFile.content, 'base64').toString('utf-8')) as Article[]
  const filtered = articles.filter((a) => a.slug !== slug)

  await pushToGitHub(
    'lib/articles.json',
    JSON.stringify(filtered, null, 2),
    `delete: article "${slug}"`,
    articlesFile.sha
  )

  return NextResponse.json({ success: true })
}
