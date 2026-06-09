export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AnnouncementStatus } from '@prisma/client'

// Called by Vercel Cron or an external scheduler.
// Secure with CRON_SECRET to prevent unauthorized triggers.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const result = await prisma.announcement.updateMany({
    where: {
      status: AnnouncementStatus.PUBLISHED,
      expiresAt: { lte: now },
    },
    data: { status: AnnouncementStatus.EXPIRED },
  })

  console.log(`[cron:expire-announcements] Expired ${result.count} announcement(s) at ${now.toISOString()}`)

  return NextResponse.json({
    data: { expiredCount: result.count, processedAt: now.toISOString() },
  })
}
