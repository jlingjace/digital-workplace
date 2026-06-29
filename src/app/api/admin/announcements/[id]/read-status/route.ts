export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { AnnouncementStatus } from '@prisma/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: {
      readReceipts: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { readAt: 'desc' },
      },
    },
  })

  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  if (announcement.status !== AnnouncementStatus.PUBLISHED) {
    return NextResponse.json(
      { error: 'Read status is only available for PUBLISHED announcements' },
      { status: 422 }
    )
  }

  const readCount = announcement.readReceipts.length
  const readUsers = announcement.readReceipts.map((r) => ({
    ...r.user,
    readAt: r.readAt,
  }))

  return NextResponse.json({
    data: {
      announcementId: params.id,
      isMandatory: announcement.isMandatory,
      readCount,
      readUsers,
    },
  })
}
