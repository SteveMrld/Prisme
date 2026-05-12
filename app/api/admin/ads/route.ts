// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'steve.moradel@gmail.com'

async function isAdmin(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === ADMIN_EMAIL
}

function supabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = supabaseAdmin()
  const { data, error } = await admin
    .from('advertisements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ads: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const admin = supabaseAdmin()

  const payload = {
    slot_id: body.slot_id,
    image_url: body.image_url ?? null,
    title: body.title,
    body: body.body ?? null,
    target_url: body.target_url,
    advertiser: body.advertiser,
    start_date: body.start_date,
    end_date: body.end_date,
    active: body.active ?? true,
    updated_at: new Date().toISOString(),
  }

  if (body.id) {
    const { data, error } = await admin
      .from('advertisements')
      .update(payload)
      .eq('id', body.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ad: data })
  }

  const { data, error } = await admin
    .from('advertisements')
    .insert(payload)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ad: data })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  const admin = supabaseAdmin()
  const { error } = await admin.from('advertisements').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
