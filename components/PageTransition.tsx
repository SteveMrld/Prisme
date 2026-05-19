'use client'
import { usePathname } from 'next/navigation'

/* IMPORTANT, ne PAS supprimer les bypass ci-dessous sans comprendre.
   .page-transition utilise transform: translateY pour son anim pageEnter
   (cf. app/animations.css). Or, un ancestor en transform crée un nouveau
   containing block qui casse position: fixed ET position: sticky des
   descendants. Les pages listées ci-dessous reposent sur ce positionnement
   et doivent court-circuiter le wrapper. */
const BYPASS_PATHS = new Set<string>([
  '/signal-map',     // panel position: fixed
  '/articles/eau',   // carte position: sticky du scrollytelling
])

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname && BYPASS_PATHS.has(pathname)) return <>{children}</>
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
