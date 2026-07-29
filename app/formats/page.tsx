import type { Metadata } from 'next'
import GrandsFormatsIndex from '../../components/GrandsFormatsIndex'

export const metadata: Metadata = {
  title: 'Grands formats',
  description: "Analyses de fond, dossiers documentaires, enquêtes au long cours.",
  alternates: { canonical: 'https://www.soara.fr/grands-formats' },
  robots: { index: false, follow: true },
}

export default function FormatsPage() {
  return <GrandsFormatsIndex />
}
