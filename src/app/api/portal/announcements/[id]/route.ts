export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AnnouncementStatus } from '@prisma/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { readReceipts: true } },
    },
  })

  if (!announcement || announcement.status !== AnnouncementStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  return NextResponse.json({ data: announcement })
}
