// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data: ad } = await supabase
    .from('advertisements')
    .select('id, target_url, active, start_date, end_date')
    .eq('id', id)
    .maybeSingle()

  if (!ad || !ad.active || ad.start_date > today || ad.end_date < today) {
    return NextResponse.redirect(new URL('/', req.url), 302)
  }

  await supabase.rpc('bump_ad_click', { ad_id: id })

  return NextResponse.redirect(ad.target_url, 302)
}
