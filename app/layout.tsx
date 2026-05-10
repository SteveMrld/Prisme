import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import './article-content.css'
import BottomNav from '../components/BottomNav'
import PWARegister from '../components/PWARegister'

const BASE_URL = 'https://soara.fr'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A1A1A',
}

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
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
        <PWARegister />
      </body>
    </html>
  )
}
