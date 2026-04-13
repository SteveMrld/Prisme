'use client'
import { useState } from 'react'

export default function SignalMapPage() {
  const [filter, setFilterState] = useState('geo')
  const [month, setMonthState] = useState(3)

  const callIframe = (fn: string, arg: string | number) => {
    const iframe = document.getElementById('signal-iframe') as HTMLIFrameElement
    if (iframe?.contentWindow) {
      (iframe.contentWindow as any)[fn]?.(arg)
    }
  }

  const handleFilter = (f: string) => {
    setFilterState(f)
    callIframe('setFilter', f)
  }

  const handleMonth = (m: number) => {
    setMonthState(m)
    callIframe('setMonth', m)
  }

  const months = ['Jan', 'Fév', 'Mar', 'Avr ●']
  const filters = [
    { key: 'geo',     label: '🌍 Géopolitique' },
    { key: 'climate', label: '🌿 Climat' },
    { key: 'france',  label: '🇫🇷 France' },
  ]

  return (
    <>
      <iframe
        id="signal-iframe"
        src="/signal-globe.html"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          border: 'none', zIndex: 0,
        }}
        title="Soara Signal"
        allowFullScreen
      />

      {/* Barre de contrôles — en dehors de l'iframe */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(64px + env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(7,9,15,0.92)',
        border: '1px solid rgba(200,169,110,0.25)',
        padding: '8px 14px',
        backdropFilter: 'blur(8px)',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontFamily: "'DM Mono', monospace",
      }}>
        {/* Titre filtres */}
        <div style={{ width: '100%', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '6px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(200,169,110,0.4)', marginBottom: '2px' }}>
          Choisir une vue
        </div>
        {/* Filtres */}
        <div style={{ display: 'flex', gap: '3px', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '10px', marginRight: '2px' }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => handleFilter(f.key)} style={{
              background: filter === f.key ? 'rgba(255,255,255,0.08)' : 'none',
              border: `1px solid ${filter === f.key ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.35)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '7px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '4px 8px', cursor: 'pointer', borderRadius: '1px',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <span style={{ fontSize: '6px', letterSpacing: '2px', color: 'rgba(200,169,110,0.4)', textTransform: 'uppercase' }}>2026</span>
          {months.map((m, i) => (
            <button key={i} onClick={() => handleMonth(i)} style={{
              background: month === i ? (i === 3 ? 'rgba(255,255,255,0.06)' : 'rgba(200,169,110,0.08)') : 'none',
              border: `1px solid ${month === i ? (i === 3 ? 'rgba(255,255,255,0.4)' : 'rgba(200,169,110,0.5)') : 'rgba(200,169,110,0.15)'}`,
              color: month === i ? (i === 3 ? '#fff' : '#C8A96E') : 'rgba(255,255,255,0.35)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '4px 8px', cursor: 'pointer', borderRadius: '1px',
            }}>{m}</button>
          ))}
        </div>
      </div>
    </>
  )
}
