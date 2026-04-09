import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import './globals.css'
import './article-content.css'
import BottomNav from '../components/BottomNav'

const BASE_URL = 'https://soara.fr'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Soara — Voir autrement',
    template: '%s — Soara',
  },
  description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture. Des lectures de fond pour comprendre ce qui se passe vraiment.',
  keywords: ['géopolitique', 'économie', 'technologie', 'analyse', 'média indépendant'],
  authors: [{ name: 'Steve Moradel' }],
  creator: 'Soara',
  publisher: 'Soara',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Soara',
    title: 'Soara — Voir autrement',
    description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Soara — Voir autrement',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soara — Voir autrement',
    description: 'Média d\'analyse indépendant. Géopolitique, économie, technologie, société, culture.',
    images: ['/og-default.jpg'],
    creator: '@soaradotmedia',
  },
  icons: {
    icon: '/favicon.svg',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
