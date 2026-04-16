'use client'

interface LangToggleProps {
  lang: string
  hasEnglish: boolean
  href: string
}

export default function LangToggle({ lang, hasEnglish, href }: LangToggleProps) {
  if (!hasEnglish) return null

  const style = {
    background: 'none', border: 'none', padding: 0,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px', fontWeight: 400,
    color: '#1a1a1a',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
    lineHeight: 'inherit',
  } as React.CSSProperties

  if (lang === 'en') {
    return (
      <a href={href} style={style}>
        Lire en français
      </a>
    )
  }

  return (
    <a href={`${href}?lang=en`} style={style}>
      Read in English
    </a>
  )
}
