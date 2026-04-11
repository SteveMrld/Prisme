import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = 'SteveMrld/Prisme'
const BRANCH = 'main'

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
  const body: any = {
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
  const data = await res.json()
  const articles = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'))
  return NextResponse.json({ articles })
}

// POST — créer ou mettre à jour un article
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { article, content, isEdit } = await req.json()

  // 1. Mettre à jour articles.json
  const articlesRes = await fetch(`https://api.github.com/repos/${REPO}/contents/lib/articles.json`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  const articlesFile = await articlesRes.json()
  const articles = JSON.parse(Buffer.from(articlesFile.content, 'base64').toString('utf-8'))

  const idx = articles.findIndex((a: any) => a.slug === article.slug)
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

  const { slug } = await req.json()

  const articlesRes = await fetch(`https://api.github.com/repos/${REPO}/contents/lib/articles.json`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  })
  const articlesFile = await articlesRes.json()
  const articles = JSON.parse(Buffer.from(articlesFile.content, 'base64').toString('utf-8'))
  const filtered = articles.filter((a: any) => a.slug !== slug)

  await pushToGitHub(
    'lib/articles.json',
    JSON.stringify(filtered, null, 2),
    `delete: article "${slug}"`,
    articlesFile.sha
  )

  return NextResponse.json({ success: true })
}
