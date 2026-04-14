import fs from 'fs'
import path from 'path'
import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"
import MediasVizClient from "./MediasVizClient"

export const metadata = {
  title: "La désaffection — Soara",
  description: "Confiance en chute libre, évitement croissant, pouvoir médiatique concentré entre quelques mains. Le divorce entre le public occidental et ses médias est structurel. Anatomie d'une rupture.",
}

export default async function MediasGrandFormat() {
  const contentPath = path.join(process.cwd(), 'lib', 'content', 'medias.html')
  let content = ''
  try {
    content = fs.readFileSync(contentPath, 'utf-8')
  } catch {
    content = '<p>Contenu à venir.</p>'
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'steve.moradel@gmail.com'
  let isSubscribed = false
  if (user && !isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
    isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  }
  const showPaywall = !isAdmin && !isSubscribed

  return (
    <GrandFormatLayout
      slug="medias"
      showPaywall={showPaywall}
      author="Steve Moradel"
      authorRole=""
    >
      {/* Visualisations interactives */}
      <div style={{ margin: "0 -40px 48px", borderTop: "1.5px solid #DDD9D2", borderBottom: "1.5px solid #DDD9D2" }}>
        <MediasVizClient />
      </div>

      {/* Texte de l'article */}
      <div className="soara-article" dangerouslySetInnerHTML={{ __html: content }} />
    </GrandFormatLayout>
  )
}
