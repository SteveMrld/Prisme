import { createClient } from './supabase-server'

export type Ad = {
  id: string
  slot_id: string
  image_url: string | null
  title: string
  body: string | null
  target_url: string
  advertiser: string
  start_date: string
  end_date: string
  active: boolean
}

export async function getActiveAd(slotId: string): Promise<Ad | null> {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('advertisements')
    .select('id, slot_id, image_url, title, body, target_url, advertiser, start_date, end_date, active')
    .eq('slot_id', slotId)
    .eq('active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return data as Ad
}

export async function bumpImpression(adId: string): Promise<void> {
  const supabase = createClient()
  await supabase.rpc('bump_ad_impression', { ad_id: adId })
}
