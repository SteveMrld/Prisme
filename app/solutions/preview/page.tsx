import Header from '../../../components/Header'
import SolutionsPreviewClient from './SolutionsPreviewClient'

export const metadata = {
  title: 'Le monde qui avance, refonte preview · Soara',
  description: 'Prototype de refonte de la section Solutions. Carte interactive, sélection éditoriale, annuaire.',
  robots: { index: false, follow: false },
}

export default function SolutionsPreviewPage() {
  return (
    <>
      <Header />
      <SolutionsPreviewClient />
    </>
  )
}
