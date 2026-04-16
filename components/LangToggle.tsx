'use client'
import React from 'react'

interface LangToggleProps {
  lang: string
  hasEnglish: boolean
  href: string
}

export default function LangToggle({ lang, hasEnglish, href }: LangToggleProps) {
  if (!hasEnglish) return null

  const pill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    border: '1px solid #1a1a1a',
    borderRadius: '2px',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: '#1a1a1a',
    textDecoration: 'none',
    lineHeight: 1,
    cursor: 'pointer',
    minHeight: '28px',
    verticalAlign: 'middle',
  }

  if (lang === 'en') {
    return (
      <a href={href} style={pill}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        FR
      </a>
    )
  }

  return (
    <a href={`${href}?lang=en`} style={pill}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      EN
    </a>
  )
}
