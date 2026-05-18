'use client'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // /signal-map : tous les enfants sont position:fixed. Un wrapper avec transform
  // (anim pageEnter) crée un containing block qui casse leur positionnement viewport.
  if (pathname === '/signal-map') return <>{children}</>
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  )
}
