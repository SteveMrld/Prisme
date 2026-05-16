import fs from 'fs'
import path from 'path'
import { createClient } from "../../../lib/supabase-server"
import GrandFormatLayout from "../../../components/GrandFormatLayout"
import { CrisisViz, OwnershipMap } from '../../visuels/medias-pouvoir/MediasPouvoirClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "La désaffection · Soara",
  description: "Confiance en chute libre, évitement croissant, pouvoir médiatique concentré entre quelques mains. Le divorce entre le public occidental et ses médias est structurel. Anatomie d'une rupture.",
}

export default async function MediasGrandFormat({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr'
  const filename = lang === 'en' ? 'medias-en.html' : 'medias.html'
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

  // Split content at viz markers
  const [part1, afterCrisis] = raw.split('<!--VIZ-CRISIS-->')
  const [part2, part3] = (afterCrisis || '').split('<!--VIZ-OWNERSHIP-->')

  const divider = <div style={{ borderTop: '2px solid #1a1d25', margin: '48px 0' }} />

  return (
    <GrandFormatLayout
      slug="medias"
      showPaywall={showPaywall}
      lang={lang}
      hasEnglish={true}
      author="Steve Moradel"
      authorRole=""
    >
      <div className="soara-article" dangerouslySetInnerHTML={{ __html: part1 }} />
      {divider}
      <CrisisViz />
      {divider}
      <div className="soara-article" dangerouslySetInnerHTML={{ __html: part2 }} />
      {divider}
      <OwnershipMap />
      {divider}
      <div className="soara-article" dangerouslySetInnerHTML={{ __html: part3 }} />
    </GrandFormatLayout>
  )
}
