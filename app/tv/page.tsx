export const dynamic = 'force-dynamic'

import Header from '../../components/Header'
import SoaraTVPage from '../../components/SoaraTVPage'

export const metadata = {
  title: 'SOARA TV',
  description: 'Les grandes questions du monde en formats vidéo. Géopolitique, économie, société, vus autrement.',
  alternates: { canonical: 'https://soara.fr/tv' },
}

export default function SoaraTV() {
  return (
    <>
      <Header />
      <SoaraTVPage />
    </>
  )
}
