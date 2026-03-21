export const dynamic = 'force-dynamic'

import Header from '../../components/Header'
import PrismeTVPage from '../../components/PrismeTVPage'

export const metadata = {
  title: 'PRISME TV — Analyses en mouvement',
  description: 'Les grandes questions du monde en formats vidéo. Géopolitique, économie, société — vus autrement.',
}

export default function PrismeTV() {
  return (
    <>
      <Header />
      <PrismeTVPage />
    </>
  )
}
