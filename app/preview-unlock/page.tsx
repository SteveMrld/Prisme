'use client'
import { useState } from 'react'

const CODE = 'SOARA2026'

export default function PreviewUnlock() {
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
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'#07080b', fontFamily:'serif' }}>
      <div style={{ fontFamily:'Playfair Display, serif', fontSize:28, color:'#cdd0d8', marginBottom:8, letterSpacing:2 }}>SOARA</div>
      <div style={{ fontSize:10, letterSpacing:4, color:'#4a5268', textTransform:'uppercase', marginBottom:40 }}>Accès preview</div>
      <input
        type="password"
        placeholder="Code d'accès"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        style={{
          background:'#0d0f14', border:`1px solid ${error ? '#c85840' : '#1c2030'}`,
          color:'#cdd0d8', padding:'12px 20px', fontSize:14,
          fontFamily:'monospace', letterSpacing:2, width:240,
          outline:'none', textAlign:'center', marginBottom:12,
          transition:'border-color 0.2s',
        }}
      />
      <button onClick={handleSubmit} style={{
        background:'none', border:'1px solid #1c2030', color:'#c9a84c',
        fontFamily:'monospace', fontSize:10, letterSpacing:3,
        textTransform:'uppercase', padding:'10px 28px', cursor:'pointer',
      }}>
        Accéder
      </button>
      {error && <div style={{ marginTop:16, fontFamily:'monospace', fontSize:10, color:'#c85840', letterSpacing:2 }}>Code incorrect</div>}
    </div>
  )
}
