export const dynamic = 'force-dynamic'

import Header from '../../components/Header'
import SoaraTVPage from '../../components/SoaraTVPage'

export const metadata = {
  title: 'SOARA TV — Analyses en mouvement',
  description: 'Les grandes questions du monde en formats vidéo. Géopolitique, économie, société — vus autrement.',
}

export default function SoaraTV() {
  return (
    <>
      <Header />
      <SoaraTVPage />
    </>
  )
}
