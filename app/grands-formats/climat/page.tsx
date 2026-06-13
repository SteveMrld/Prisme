import ClimateClient from "./ClimateClient"
import BookmarkButton from "../../../components/BookmarkButton"

export const metadata = {
  title: "Cinq siècles de fièvre",
  description: "La Terre a toujours changé de température. Ce qui est sans précédent, c'est la vitesse. 500 millions d'années de données paléoclimatiques.",
  alternates: { canonical: 'https://soara.fr/grands-formats/climat' },
}

export default function ClimatPage() {
  return (
    <div>
      <ClimateClient />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', background: '#04060d' }}>
        <BookmarkButton slug="climat" title="La Terre a toujours changé de température" />
      </div>
    </div>
  )
}
