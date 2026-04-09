import Header from '../../components/Header'
import LecturesClient from './LecturesClient'

export const metadata = {
  title: 'Mes lectures — Soara',
  description: 'Vos articles sauvegardés sur Soara.',
}

export default function LecturesPage() {
  return (
    <>
      <Header />
      <LecturesClient />
    </>
  )
}
