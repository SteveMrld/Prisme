import type { Metadata } from 'next'

const URL = 'https://soara.fr/signal-map'

export const metadata: Metadata = {
  title: 'Signal Map',
  description: "Carte interactive des tensions géopolitiques en temps réel. Conflits, alliances, pressions, signaux faibles. Lecture cartographique de l'actualité.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Signal Map, Soara',
    description: 'Carte interactive des tensions géopolitiques en temps réel.',
    siteName: 'Soara',
    locale: 'fr_FR',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Signal Map Soara' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signal Map, Soara',
    description: 'Carte interactive des tensions géopolitiques en temps réel.',
    images: ['/og-default.jpg'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
