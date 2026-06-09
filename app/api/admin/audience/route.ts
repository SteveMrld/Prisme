import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'

const ADMIN_EMAIL = 'steve.moradel@gmail.com'

const API_HOST = process.env.PLAUSIBLE_API_HOST || 'https://plausible.io'
const SITE_ID = process.env.PLAUSIBLE_SITE_ID || 'soara.fr'
const API_KEY = process.env.PLAUSIBLE_API_KEY

async function isAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === ADMIN_EMAIL
}

async function plausible(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ site_id: SITE_ID, ...params }).toString()
  const res = await fetch(`${API_HOST}/api/v1/stats/${path}?${qs}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Plausible ${path}: ${res.status}`)
  }
  return res.json()
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!API_KEY) {
    return NextResponse.json({ configured: false })
  }

  const period = request.nextUrl.searchParams.get('period') || '30d'

  try {
    const [aggregate, timeseries, pages, sources, devices, countries] = await Promise.all([
      plausible('aggregate', {
        period,
        metrics: 'visitors,pageviews,bounce_rate,visit_duration',
      }),
      plausible('timeseries', {
        period,
        metrics: 'visitors,pageviews',
      }),
      plausible('breakdown', {
        period,
        property: 'event:page',
        metrics: 'visitors,pageviews',
        limit: '8',
      }),
      plausible('breakdown', {
        period,
        property: 'visit:source',
        metrics: 'visitors',
        limit: '8',
      }),
      plausible('breakdown', {
        period,
        property: 'visit:device',
        metrics: 'visitors',
        limit: '5',
      }),
      plausible('breakdown', {
        period,
        property: 'visit:country',
        metrics: 'visitors',
        limit: '8',
      }),
    ])

    return NextResponse.json({
      configured: true,
      site: SITE_ID,
      period,
      aggregate: aggregate.results,
      timeseries: timeseries.results,
      pages: pages.results,
      sources: sources.results,
      devices: devices.results,
      countries: countries.results,
    })
  } catch (err: any) {
    return NextResponse.json(
      { configured: true, error: err?.message || 'Erreur Plausible' },
      { status: 502 }
    )
  }
}
