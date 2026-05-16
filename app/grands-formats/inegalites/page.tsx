import InegalitesClient from "./InegalitesClient"
import BookmarkButton from "../../../components/BookmarkButton"
export const metadata = {
  title: "Le grand partage · Soara",
  description: "En 1980, USA, France, Inde et Chine avaient les mêmes inégalités. Depuis, leurs trajectoires ont divergé. 4 pays, 40 ans de données WID.",
}
export default function InegalitesPage() {
  return (
    <div>
      <InegalitesClient />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px', background: '#04060d' }}>
        <BookmarkButton slug="inegalites" title="En 1980, ils étaient tous pareils" />
      </div>
    </div>
  )
}
