export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { authOptions } from '@/lib/auth'
import { AnnouncementStatus } from '@prisma/client'
import { postAnnouncementNotification } from '@/lib/notifications/slack'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const session = await getServerSession(authOptions)
  const approverEmail = session?.user?.email ?? 'unknown'

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  if (announcement.status !== AnnouncementStatus.PENDING_APPROVAL) {
    return NextResponse.json(
      { error: 'Only PENDING_APPROVAL announcements can be approved' },
      { status: 422 }
    )
  }

  const now = new Date()
  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      status: AnnouncementStatus.PUBLISHED,
      publishedAt: now,
      approvedByEmail: approverEmail,
      approvedAt: now,
    },
  })

  // Push Slack notification if channel is configured
  if (updated.slackChannelId) {
    postAnnouncementNotification(updated, updated.slackChannelId).catch((err) =>
      console.error('[approve] Slack notification failed:', err)
    )
  }

  return NextResponse.json({ data: updated })
}
