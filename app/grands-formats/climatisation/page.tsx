import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La chaleur déplacée",
  description: "La climatisation ne fabrique pas de froid : elle déplace de la chaleur, d'une pièce vers la rue, en consommant de l'électricité pour le faire. Anodin dans un salon, ce geste devient un fait énergétique majeur quand des milliards d'appareils s'y mettent en même temps.",
  alternates: { canonical: 'https://soara.fr/grands-formats/climatisation' },
}

export default async function ClimatisationPage() {
  // Accès libre, intégral, sans paywall (sujet d'actualité)
  const supabase = createClient()
  await supabase.auth.getUser()

  return (
    <GrandFormatLayout
      slug="climatisation"
      showPaywall={false}
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article">

        <p>Les étés s'allongent, les nuits refroidissent de moins en moins, et partout le même geste gagne du terrain : appuyer sur une télécommande pour rafraîchir l'air. En une génération, la climatisation est passée du luxe à l'équipement courant. Derrière ce geste simple se joue une mécanique qu'on voit rarement : d'où vient ce frais, et où part la chaleur.</p>

        <h2>La machine</h2>

        <p>La climatisation ne fabrique pas de froid : elle déplace de la chaleur, d'une pièce vers la rue, en consommant de l'électricité pour le faire. Anodin dans un salon, ce geste devient un fait énergétique majeur quand des milliards d'appareils s'y mettent en même temps. Avant d'en mesurer le prix, voici comment la machine s'y prend.</p>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Animation canvas du cycle du climatiseur, à intégrer en Phase 3.]</p>

        <h2>Le paradoxe</h2>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Section fond sombre + animation bilan 100+30=130, Phase 3.]</p>

        <h2>Le monde qui climatise</h2>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Texte + animation de prolifération du parc mondial, Phase 2 et 3.]</p>

        <h2>La ville qui chauffe</h2>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Îlot de chaleur urbain + boucle de rétroaction, Phase 2 et 3.]</p>

        <h2>L'autre intelligence</h2>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Bâdgirs, Yazd, yakhchāl, Eastgate, Phase 2 et 3.]</p>

        <h2>Ce qu'il faut retenir</h2>

        <p style={{ fontStyle: 'italic', color: '#6A6A6A' }}>[Conclusion et sources, Phase 2.]</p>

      </div>
    </GrandFormatLayout>
  )
}
