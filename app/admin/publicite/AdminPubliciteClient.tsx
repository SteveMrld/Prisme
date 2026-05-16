'use client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase'
import AdminNav from '../../../components/AdminNav'
import styles from './publicite.module.css'

const SLOTS = [
  { id: 'home',        label: 'Home · sous le hero',           hint: 'Bandeau paysage ~1200×250' },
  { id: 'article',     label: 'Article · milieu de lecture',   hint: 'Carré ou paysage' },
  { id: 'atlas',       label: 'Atlas · fin de page',            hint: 'Bandeau paysage' },
  { id: 'newsletter',  label: 'Newsletter (à venir)',           hint: 'Non encore inséré dans le site' },
  { id: 'compte',      label: 'Compte abonné · bloc partenaires', hint: 'Bloc partenaires bas de page' },
]

const EMPTY = {
  id: null,
  slot_id: 'home',
  image_url: '',
  title: '',
  body: '',
  target_url: '',
  advertiser: '',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  active: true,
}

export default function AdminPubliciteClient() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ads, setAds] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [ad, setAd] = useState<any>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === 'steve.moradel@gmail.com') {
        setAuthorized(true)
        loadAds()
      }
      setLoading(false)
    })
  }, [])

  async function loadAds() {
    const res = await fetch('/api/admin/ads')
    const data = await res.json()
    setAds(data.ads || [])
  }

  function newAd(slotId?: string) {
    setAd({ ...EMPTY, slot_id: slotId || 'home' })
    setView('edit')
    setMsg('')
  }

  function editAd(a: any) {
    setAd({
      id: a.id,
      slot_id: a.slot_id,
      image_url: a.image_url || '',
      title: a.title,
      body: a.body || '',
      target_url: a.target_url,
      advertiser: a.advertiser,
      start_date: a.start_date,
      end_date: a.end_date,
      active: a.active,
    })
    setView('edit')
    setMsg('')
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/ads/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.url) {
      setAd((prev: any) => ({ ...prev, image_url: data.url }))
    } else {
      setMsg(`Erreur upload : ${data.error || 'inconnue'}`)
    }
  }

  async function save() {
    if (!ad.title || !ad.target_url || !ad.advertiser) {
      setMsg('Titre, URL cible et annonceur sont obligatoires.')
      return
    }
    if (ad.title.length > 80) {
      setMsg('Titre trop long (max 80 caractères).')
      return
    }
    if (ad.body && ad.body.length > 200) {
      setMsg('Accroche trop longue (max 200 caractères).')
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ad),
    })
    const data = await res.json()
    setSaving(false)
    if (data.ad) {
      setMsg('Enregistré.')
      await loadAds()
      setView('list')
    } else {
      setMsg(`Erreur : ${data.error || 'inconnue'}`)
    }
  }

  async function toggleActive(a: any) {
    await fetch('/api/admin/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: a.id,
        slot_id: a.slot_id,
        image_url: a.image_url,
        title: a.title,
        body: a.body,
        target_url: a.target_url,
        advertiser: a.advertiser,
        start_date: a.start_date,
        end_date: a.end_date,
        active: !a.active,
      }),
    })
    await loadAds()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer définitivement cette annonce ?')) return
    await fetch('/api/admin/ads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await loadAds()
  }

  if (loading) return <div className={styles.wrapper}><div className={styles.center}>Chargement…</div></div>
  if (!authorized) return <div className={styles.wrapper}><div className={styles.center}>Accès refusé.</div></div>

  const adsBySlot: Record<string, any[]> = {}
  for (const s of SLOTS) adsBySlot[s.id] = []
  for (const a of ads) (adsBySlot[a.slot_id] = adsBySlot[a.slot_id] || []).push(a)

  return (
    <div className={styles.wrapper}>
      <AdminNav active="publicite" />
      <header className={styles.header}>
        <div className={styles.sectionTitle}>Publicité</div>
        {view === 'edit' && (
          <button className={styles.btnSecondary} onClick={() => setView('list')}>← retour</button>
        )}
      </header>

      {view === 'list' && (
        <>
          <div className={styles.intro}>
            Emplacements éditoriaux sponsorisés. Une seule annonce active à la fois par emplacement
            (la plus récemment créée prend le pas). Pas de pop-ups, pas de tracking utilisateur.
          </div>

          <div className={styles.slots}>
            {SLOTS.map(slot => {
              const items = adsBySlot[slot.id] || []
              const activeItem = items.find(i => i.active)
              return (
                <section key={slot.id} className={styles.slot}>
                  <header className={styles.slotHead}>
                    <div>
                      <div className={styles.slotTitle}>{slot.label}</div>
                      <div className={styles.slotHint}>{slot.hint} · <code>slotId="{slot.id}"</code></div>
                    </div>
                    <button className={styles.btnPrimary} onClick={() => newAd(slot.id)}>+ nouvelle annonce</button>
                  </header>

                  {items.length === 0 && (
                    <div className={styles.empty}>Aucune annonce pour cet emplacement.</div>
                  )}

                  {items.map(a => {
                    const ctr = a.impressions > 0 ? ((a.clicks / a.impressions) * 100).toFixed(2) : '0.00'
                    return (
                      <div key={a.id} className={styles.adCard}>
                        <div className={styles.adMain}>
                          <div className={styles.adStatus}>
                            <span className={a.active ? styles.dotActive : styles.dotIdle} />
                            {a.active ? 'ACTIVE' : 'inactive'}
                          </div>
                          <div className={styles.adAdv}>{a.advertiser}</div>
                          <div className={styles.adTitle}>{a.title}</div>
                          <div className={styles.adDates}>
                            {a.start_date} → {a.end_date}
                          </div>
                        </div>
                        <div className={styles.adStats}>
                          <div><b>{a.impressions}</b> impr.</div>
                          <div><b>{a.clicks}</b> clics</div>
                          <div className={styles.adCtr}>CTR {ctr}%</div>
                        </div>
                        <div className={styles.adActions}>
                          <button className={styles.btnSecondary} onClick={() => editAd(a)}>éditer</button>
                          <button className={styles.btnSecondary} onClick={() => toggleActive(a)}>
                            {a.active ? 'désactiver' : 'activer'}
                          </button>
                          <button className={styles.btnDanger} onClick={() => remove(a.id)}>supprimer</button>
                        </div>
                      </div>
                    )
                  })}
                </section>
              )
            })}
          </div>
        </>
      )}

      {view === 'edit' && (
        <div className={styles.form}>
          <h2 className={styles.formTitle}>{ad.id ? 'Éditer l\'annonce' : 'Nouvelle annonce'}</h2>

          <label className={styles.label}>Emplacement
            <select className={styles.input} value={ad.slot_id}
                    onChange={e => setAd({ ...ad, slot_id: e.target.value })}>
              {SLOTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>

          <label className={styles.label}>Annonceur
            <input className={styles.input} value={ad.advertiser}
                   onChange={e => setAd({ ...ad, advertiser: e.target.value })}
                   placeholder="Maison Hermès" />
          </label>

          <label className={styles.label}>
            Titre <span className={styles.count}>{ad.title.length}/80</span>
            <input className={styles.input} value={ad.title} maxLength={80}
                   onChange={e => setAd({ ...ad, title: e.target.value })}
                   placeholder="L'art du temps" />
          </label>

          <label className={styles.label}>
            Accroche <span className={styles.count}>{(ad.body || '').length}/200</span>
            <textarea className={styles.textarea} value={ad.body || ''} maxLength={200} rows={3}
                      onChange={e => setAd({ ...ad, body: e.target.value })}
                      placeholder="Une horlogerie qui pense le siècle." />
          </label>

          <label className={styles.label}>URL cible
            <input className={styles.input} value={ad.target_url}
                   onChange={e => setAd({ ...ad, target_url: e.target.value })}
                   placeholder="https://exemple.com/page" />
          </label>

          <label className={styles.label}>Image
            <input className={styles.input} type="file" accept="image/*"
                   onChange={e => {
                     const f = e.target.files?.[0]
                     if (f) uploadImage(f)
                   }} />
            {uploading && <span className={styles.uploading}>upload…</span>}
            {ad.image_url && (
              <div className={styles.preview}>
                <img src={ad.image_url} alt="preview" />
                <code>{ad.image_url}</code>
              </div>
            )}
          </label>

          <div className={styles.row}>
            <label className={styles.label}>Début
              <input className={styles.input} type="date" value={ad.start_date}
                     onChange={e => setAd({ ...ad, start_date: e.target.value })} />
            </label>
            <label className={styles.label}>Fin
              <input className={styles.input} type="date" value={ad.end_date}
                     onChange={e => setAd({ ...ad, end_date: e.target.value })} />
            </label>
          </div>

          <label className={styles.checkbox}>
            <input type="checkbox" checked={ad.active}
                   onChange={e => setAd({ ...ad, active: e.target.checked })} />
            Active
          </label>

          {msg && <div className={styles.msg}>{msg}</div>}

          <div className={styles.actions}>
            <button className={styles.btnSecondary} onClick={() => setView('list')}>annuler</button>
            <button className={styles.btnPrimary} onClick={save} disabled={saving}>
              {saving ? 'enregistrement…' : 'enregistrer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
