export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { AnnouncementStatus } from '@prisma/client'

const ARCHIVABLE_STATUSES = new Set<AnnouncementStatus>([
  AnnouncementStatus.PUBLISHED,
  AnnouncementStatus.EXPIRED,
])

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  if (!ARCHIVABLE_STATUSES.has(announcement.status)) {
    return NextResponse.json(
      { error: 'Only PUBLISHED or EXPIRED announcements can be archived' },
      { status: 422 }
    )
  }

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: { status: AnnouncementStatus.ARCHIVED },
  })

  return NextResponse.json({ data: updated })
}
