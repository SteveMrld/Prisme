import Header from '../../components/Header'
import SolutionsClient from './SolutionsClient'

export const metadata = {
  title: 'Changer le monde',
  description: '166 solutions concrètes pour la planète, cartographiées et indexées. Sélection ChangeNow 2026.',
  alternates: { canonical: 'https://soara.fr/solutions' },
}

export default function SolutionsPage() {
  return (
    <>
      <Header />
      <SolutionsClient />
    </>
  )
}
