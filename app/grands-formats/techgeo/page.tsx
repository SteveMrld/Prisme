import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"

export const metadata = {
  title: "La bataille pour le sous-sol du monde numérique — Soara",
  description: "Des mines de terres rares de Mongolie intérieure aux fabs de Taïwan, une guerre souterraine pour les matériaux du monde à venir.",
}

export default async function TechgeoPage() {
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
      slug="techgeo"
      showPaywall={showPaywall}
      author="Steve Moradel"
      authorRole=""
    >
      <div style={{ margin: '0 -40px' }}>
        <iframe
          src="/visuels/techgeo.html"
          style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
          title="La bataille pour le sous-sol du monde numérique"
        />
      </div>
    </GrandFormatLayout>
  )
}
