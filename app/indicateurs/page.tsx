export const dynamic = 'force-dynamic'
import Header from '../../components/Header'
import IndicateursClient from './IndicateursClient'

export const metadata = {
  title: 'Indicateurs · Soara',
  description: 'Les indicateurs économiques et géopolitiques clés : énergie, devises, matières premières, tensions mondiales.',
}

export default function IndicateursPage() {
  return (
    <>
      <Header />
      <IndicateursClient />
    </>
  )
}
