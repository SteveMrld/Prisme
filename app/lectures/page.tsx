import Header from '../../components/Header'
import LecturesClient from './LecturesClient'

export const metadata = {
  title: 'Mes lectures — Confins',
  description: 'Vos articles sauvegardés sur Confins.',
}

export default function LecturesPage() {
  return (
    <>
      <Header />
      <LecturesClient />
    </>
  )
}
