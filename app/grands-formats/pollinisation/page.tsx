import fs from 'fs'
import path from 'path'
import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"
import PollinisationViz from '../../visuels/pollinisation/PollinisationViz'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La ruche vide · Soara",
  description: "L'abeille existe depuis 100 millions d'années. Elle est en train de céder face à cinquante ans d'agriculture industrielle. Derrière sa disparition : des brevets, des drones, et une nouvelle fracture mondiale.",
}

export default async function PollinisationGrandFormat({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const filename = lang === 'en' ? 'pollinisation-en.html' : 'pollinisation.html'
  const contentPath = path.join(process.cwd(), 'lib', 'content', filename)
  let raw = ''
  try { raw = fs.readFileSync(contentPath, 'utf-8') } catch {}

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === 'steve.moradel@gmail.com'
  let isSubscribed = false
  if (user && !isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
    isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  }
  const showPaywall = !isAdmin && !isSubscribed

  const [part1, part2] = raw.split('<!--VIZ-POLLINISATION-->')

  return (
    <GrandFormatLayout
      slug="pollinisation"
      showPaywall={showPaywall}
      lang={lang}
      hasEnglish={true}
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article" dangerouslySetInnerHTML={{ __html: part1 || raw }} />
      {part2 && (
        <>
          <PollinisationViz />
          <div className="soara-article" dangerouslySetInnerHTML={{ __html: part2 }} />
        </>
      )}
    </GrandFormatLayout>
  )
}
