import Header from '../../components/Header'
import SolutionsClient from './SolutionsClient'

export const metadata = {
  title: 'Changer le monde · Soara',
  description: '166 solutions concrètes pour la planète, cartographiées et indexées. Sélection ChangeNow 2026.',
}

export default function SolutionsPage() {
  return (
    <>
      <Header />
      <SolutionsClient />
    </>
  )
}
