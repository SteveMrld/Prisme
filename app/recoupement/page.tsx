export const dynamic = 'force-dynamic'
import Header from '../../components/Header'
import RecoupementClient from './RecoupementClient'

export const metadata = {
  title: 'Recoupement — Confins',
  description: 'Outil de recoupement d\'information : croisez les sources sur un fait d\'actualité.',
}

export default function RecoupementPage() {
  return (
    <>
      <Header />
      <RecoupementClient />
    </>
  )
}
