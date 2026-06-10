export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { AnnouncementStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

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
