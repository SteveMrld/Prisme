import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bientôt',
  description: 'Soara, média d\'analyse indépendant. Lancement le 1er juin 2026.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
