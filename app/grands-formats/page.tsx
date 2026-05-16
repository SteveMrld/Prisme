import type { Metadata } from 'next'
import GrandsFormatsIndex from '../../components/GrandsFormatsIndex'

const URL = 'https://soara.fr/grands-formats'

export const metadata: Metadata = {
  title: 'Grands formats',
  description: "Analyses de fond, dossiers documentaires, enquêtes au long cours. Géopolitique, économie, technologie, environnement. Les récits qui prennent le temps de comprendre.",
  alternates: { canonical: URL },
  openGraph: {
    type: 'website',
    url: URL,
    title: 'Grands formats, Soara',
    description: "Analyses de fond, dossiers documentaires, enquêtes au long cours.",
    siteName: 'Soara',
    locale: 'fr_FR',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Grands formats Soara' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grands formats, Soara',
    description: "Analyses de fond, dossiers documentaires, enquêtes au long cours.",
    images: ['/og-default.jpg'],
  },
}

export default function GrandsFormatsPage() {
  return <GrandsFormatsIndex />
}
