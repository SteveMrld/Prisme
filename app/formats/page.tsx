import type { Metadata } from 'next'
import GrandsFormatsIndex from '../../components/GrandsFormatsIndex'

export const metadata: Metadata = {
  title: 'Grands formats',
  description: "Analyses de fond, dossiers documentaires, enquêtes au long cours.",
  alternates: { canonical: 'https://soara.fr/grands-formats' },
  robots: { index: false, follow: true },
}

export default function FormatsPage() {
  return <GrandsFormatsIndex />
}
