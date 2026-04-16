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

  const switchTo = (target: 'fr' | 'en') => {
    const params = new URLSearchParams(searchParams.toString())
    if (target === 'en') {
      params.set('lang', 'en')
    } else {
      params.delete('lang')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const active = lang === 'en' ? 'en' : 'fr'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #D8D3C8',
        borderRadius: '2px',
        overflow: 'hidden',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      }}
    >
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          style={{
            padding: '5px 11px',
            border: 'none',
            cursor: active === l ? 'default' : 'pointer',
            background: active === l ? '#0E0E0E' : 'transparent',
            color: active === l ? '#fff' : '#999',
            transition: 'background .15s, color .15s',
            lineHeight: 1,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
