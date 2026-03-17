import type { Metadata } from 'next'
import './globals.css'
import './article-content.css'

export const metadata: Metadata = {
  title: 'Prisme — Voir autrement',
  description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
