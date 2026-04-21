import { NextResponse } from 'next/server'
import { requireActiveSubscriber, readQuota } from '../../../../lib/recoupement-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireActiveSubscriber()
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const quota = await readQuota(auth.userId, auth.isAdmin)
  if (!quota.ok) {
    return NextResponse.json({ error: quota.error }, { status: quota.status })
  }

  return NextResponse.json({
    used: quota.used,
    remaining: quota.remaining,
    limit: quota.limit,
    isAdmin: auth.isAdmin,
    extraCredits: (quota as any).extraCredits ?? 0,
  })
}
