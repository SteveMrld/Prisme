'use client'
import { useState } from 'react'
import styles from './bientot.module.css'

const CODE = 'SOARA2026'

export default function BientotPage() {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (input.trim().toUpperCase() === CODE) {
      document.cookie = 'soara_preview=true; path=/; max-age=31536000'
      window.location.href = '/'
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.logo}>SOARA</div>
        <p className={styles.tagline}>Média d&apos;analyse indépendant</p>
        <div className={styles.divider} />
        <p className={styles.date}>Lancement — 1<sup>er</sup> juin 2026</p>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              background: 'transparent',
              border: `1px solid ${error ? '#c85840' : 'rgba(255,255,255,0.15)'}`,
              color: '#cdd0d8',
              padding: '12px 20px',
              fontSize: 14,
              fontFamily: 'monospace',
              letterSpacing: 2,
              width: 240,
              outline: 'none',
              textAlign: 'center',
              marginBottom: 14,
              transition: 'border-color var(--dur-fast) var(--ease-out)',
              borderRadius: 2,
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#c9a84c',
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              padding: '10px 28px',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            Accéder
          </button>
          {error && (
            <div style={{ marginTop: 14, fontFamily: 'monospace', fontSize: 10, color: '#c85840', letterSpacing: 2 }}>
              Mot de passe incorrect
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
