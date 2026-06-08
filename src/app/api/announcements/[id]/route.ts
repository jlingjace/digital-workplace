export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AnnouncementStatus } from '@prisma/client'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const announcement = await prisma.announcement.findFirst({
    where: {
      id: params.id,
      status: AnnouncementStatus.PUBLISHED,
    },
  })

  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  return NextResponse.json({ data: announcement })
}
