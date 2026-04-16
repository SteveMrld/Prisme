'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface LangToggleProps {
  lang: string
  hasEnglish: boolean
  href: string  // URL explicite de l'article courant
}

export default function LangToggle({ lang, hasEnglish, href }: LangToggleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (!hasEnglish) return null

  const switchTo = (target: 'fr' | 'en') => {
    const params = new URLSearchParams(searchParams.toString())
    if (target === 'en') {
      params.set('lang', 'en')
    } else {
      params.delete('lang')
    }
    router.push(`${href}?${params.toString()}`)
  }

  const active = lang === 'en' ? 'en' : 'fr'

  if (active === 'fr') {
    return (
      <button
        onClick={() => switchTo('en')}
        style={{
          background: 'none', border: 'none', padding: 0,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px', fontWeight: 400,
          color: '#1a1a1a',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          lineHeight: 'inherit',
        }}
      >
        Read in English
      </button>
    )
  }

  return (
    <button
      onClick={() => switchTo('fr')}
      style={{
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px', fontWeight: 400,
        color: '#1a1a1a',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        lineHeight: 'inherit',
      }}
    >
      Lire en français
    </button>
  )
}
