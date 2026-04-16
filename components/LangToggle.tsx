'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface LangToggleProps {
  lang: string
  hasEnglish: boolean
}

export default function LangToggle({ lang, hasEnglish }: LangToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (!hasEnglish) return null

  const toggle = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (lang === 'fr') {
      params.set('lang', 'en')
    } else {
      params.delete('lang')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        fontFamily: '"DM Mono", monospace',
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: lang === 'en' ? '#1a1a1a' : '#999',
        background: 'none',
        border: '1px solid',
        borderColor: lang === 'en' ? '#1a1a1a' : '#ddd',
        padding: '5px 10px',
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      {lang === 'en' ? 'Lire en français' : 'Read in English'}
    </button>
  )
}
