import Header from '../../components/Header'
import BibliothequeClient from './BibliothequeClient'
import livres from '../../lib/bibliotheque.json'

export const metadata = {
  title: 'Bibliothèque',
  description:
    "Une page de Jade Desroses. Une lecture, un parti pris, la raison pour laquelle un livre compte. Les coups de cœur de la rédaction de Soara.",
  alternates: { canonical: 'https://soara.fr/bibliotheque' },
  openGraph: {
    title: 'Bibliothèque · Soara',
    description:
      "Une lecture, un parti pris, la raison pour laquelle un livre compte. Les coups de cœur de Soara.",
  },
}

export default function BibliothequePage() {
  return (
    <>
      <Header />
      <BibliothequeClient livres={livres as any[]} />
    </>
  )
}
