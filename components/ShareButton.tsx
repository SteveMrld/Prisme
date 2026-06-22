'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'

type Props = {
  /** Titre partagé (sinon document.title). */
  title?: string
  /** Bouton icône seule (pour les barres d'action), sinon bouton avec libellé. */
  iconOnly?: boolean
  /** Classe du déclencheur, pour épouser le style de l'hôte (ex. styles.actionBtn). */
  className?: string
  label?: string
}

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

export default function ShareButton({ title = '', iconOnly = false, className, label = 'Partager' }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')
  const getTitle = () => title || (typeof document !== 'undefined' ? document.title : '')

  const onTrigger = async () => {
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null
    if (nav && typeof nav.share === 'function') {
      try { await nav.share({ title: getTitle(), url: getUrl() }) } catch { /* annulé */ }
      return
    }
    setOpen((o) => !o)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* ignore */ }
  }

  const enc = encodeURIComponent
  const u = enc(getUrl())
  const t = enc(getTitle())
  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
    { name: 'X', href: `https://x.com/intent/tweet?text=${t}&url=${u}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ]

  const defaultTrigger: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-ui, sans-serif)',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    color: 'var(--encre, #0A0A0A)',
    background: 'none',
    border: '1px solid var(--bord, #e2dcd1)',
    borderRadius: 999,
    padding: iconOnly ? 8 : '9px 16px',
    cursor: 'pointer',
    lineHeight: 1,
  }

  const item: CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    fontFamily: 'var(--font-ui, sans-serif)',
    fontSize: 13,
    color: '#0A0A0A',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    boxSizing: 'border-box',
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }} className="no-print">
      <button
        type="button"
        className={className}
        style={className ? undefined : defaultTrigger}
        onClick={onTrigger}
        title="Partager"
        aria-label="Partager"
      >
        <ShareIcon />
        {!iconOnly && <span>{label}</span>}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 60,
            background: '#fff',
            border: '1px solid #e2dcd1',
            borderRadius: 10,
            padding: 5,
            boxShadow: '0 10px 34px rgba(10,10,10,0.16)',
            minWidth: 184,
          }}
        >
          {links.map((l) => (
            <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" style={item} onClick={() => setOpen(false)}>
              {l.name}
            </a>
          ))}
          <button type="button" onClick={copy} style={{ ...item, borderTop: '1px solid #eee', borderRadius: 0, marginTop: 2 }}>
            {copied ? 'Lien copié ✓' : 'Copier le lien'}
          </button>
        </div>
      )}
    </div>
  )
}
