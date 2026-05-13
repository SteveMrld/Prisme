import Header from '../../components/Header'
import LecturesClient from './LecturesClient'

export const metadata = {
  title: 'Mes lectures',
  description: 'Les articles que vous avez mis de côté sur Soara.',
  robots: { index: false, follow: false },
}

export default function LecturesPage() {
  return (
    <>
      <Header />
      <LecturesClient />
    </>
  )
}
