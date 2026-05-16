'use client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import AdminNav from '../../../components/AdminNav'
import styles from './articles.module.css'

const CATEGORIES = [
  { value: 'geo', label: 'Géopolitique' },
  { value: 'eco', label: 'Économie' },
  { value: 'tech', label: 'Technologie' },
  { value: 'env', label: 'Environnement' },
  { value: 'soc', label: 'Société' },
  { value: 'culture', label: 'Culture' },
  { value: 'portrait', label: 'Portrait' },
]

const EMPTY_ARTICLE = {
  slug: '',
  title: '',
  description: '',
  category: 'geo',
  categoryLabel: 'Géopolitique',
  date: new Date().toISOString().split('T')[0],
  readTime: '8',
  image: '',
  author: 'Steve Moradel',
  authorRole: '',
  featured: false,
  premium: false,
  grandFormat: false,
  grandFormatUrl: '',
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [article, setArticle] = useState<any>(EMPTY_ARTICLE)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === 'steve.moradel@gmail.com') {
        setAuthorized(true)
        loadArticles()
      }
      setLoading(false)
    })
  }, [])

  async function loadArticles() {
    const res = await fetch('/api/admin/article')
    const data = await res.json()
    setArticles(data.articles || [])
  }

  function newArticle() {
    setArticle(EMPTY_ARTICLE)
    setContent('')
    setIsEdit(false)
    setView('edit')
    setMsg('')
  }

  function editArticle(a: any) {
    setArticle(a)
    setContent('')
    setIsEdit(true)
    setView('edit')
    setMsg('')
    // Load existing content
    fetch(`/api/admin/article?slug=${a.slug}&content=1`)
      .then(r => r.json())
      .then(d => d.content && setContent(d.content))
  }

  async function save() {
    if (!article.slug || !article.title) {
      setMsg('Slug et titre obligatoires.')
      return
    }
    setSaving(true)
    setMsg('')
    const cat = CATEGORIES.find(c => c.value === article.category)
    const payload = {
      article: { ...article, categoryLabel: cat?.label || article.categoryLabel },
      content,
      isEdit,
    }
    const res = await fetch('/api/admin/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('✅ Publié — Vercel redéploie dans ~1 min.')
      loadArticles()
    } else {
      setMsg('❌ Erreur lors de la publication.')
    }
  }

  async function deleteArticle(slug: string) {
    if (!confirm(`Supprimer "${slug}" ?`)) return
    await fetch('/api/admin/article', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    loadArticles()
  }

  if (loading) return <div className={styles.loading}>Chargement…</div>
  if (!authorized) return <div className={styles.denied}>Accès refusé.</div>

  return (
    <div className={styles.wrapper}>
      <AdminNav active="articles" />
      <div className={styles.subHeader}>
        <div className={styles.sectionTitle}>Articles</div>
        {view === 'list' ? (
          <button className={styles.btnPrimary} onClick={newArticle}>+ Nouvel article</button>
        ) : (
          <button className={styles.btnSecondary} onClick={() => setView('list')}>← Retour</button>
        )}
      </div>

      {view === 'list' && (
        <div className={styles.list}>
          <div className={styles.count}>{articles.length} articles</div>
          {articles.map((a: any) => (
            <div key={a.slug} className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowCat}>{a.categoryLabel}</span>
                <span className={styles.rowTitle}>{a.title}</span>
                <span className={styles.rowDate}>{a.date}</span>
              </div>
              <div className={styles.rowActions}>
                <button onClick={() => editArticle(a)}>Éditer</button>
                <button className={styles.del} onClick={() => deleteArticle(a.slug)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'edit' && (
        <div className={styles.form}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Slug *</label>
              <input value={article.slug} onChange={e => setArticle({ ...article, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="mon-article" disabled={isEdit} />
            </div>
            <div className={styles.field}>
              <label>Catégorie</label>
              <select value={article.category} onChange={e => setArticle({ ...article, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Titre *</label>
            <input value={article.title} onChange={e => setArticle({ ...article, title: e.target.value })} placeholder="Titre de l'article" />
          </div>

          <div className={styles.field}>
            <label>Chapeau</label>
            <textarea rows={2} value={article.description} onChange={e => setArticle({ ...article, description: e.target.value })} placeholder="Description courte…" />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Date</label>
              <input type="date" value={article.date} onChange={e => setArticle({ ...article, date: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Temps de lecture (min)</label>
              <input value={article.readTime} onChange={e => setArticle({ ...article, readTime: e.target.value })} placeholder="8" />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Image (URL ou /path)</label>
              <input value={article.image} onChange={e => setArticle({ ...article, image: e.target.value })} placeholder="/images/mon-image.jpg" />
            </div>
            <div className={styles.field}>
              <label>Auteur</label>
              <input value={article.author} onChange={e => setArticle({ ...article, author: e.target.value })} />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label><input type="checkbox" checked={article.featured} onChange={e => setArticle({ ...article, featured: e.target.checked })} /> À la une</label>
            <label><input type="checkbox" checked={article.premium} onChange={e => setArticle({ ...article, premium: e.target.checked })} /> Premium</label>
            <label><input type="checkbox" checked={article.grandFormat} onChange={e => setArticle({ ...article, grandFormat: e.target.checked })} /> Grand format</label>
          </div>

          <div className={styles.field}>
            <label>Contenu HTML</label>
            <textarea className={styles.htmlEditor} rows={20} value={content} onChange={e => setContent(e.target.value)} placeholder="<p>Contenu de l'article en HTML…</p>" />
          </div>

          {msg && <div className={styles.msg}>{msg}</div>}

          <button className={styles.btnPrimary} onClick={save} disabled={saving}>
            {saving ? 'Publication…' : '🚀 Publier'}
          </button>
        </div>
      )}
    </div>
  )
}
