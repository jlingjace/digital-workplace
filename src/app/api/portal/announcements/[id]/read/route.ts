export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { AnnouncementStatus } from '@prisma/client'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!announcement || announcement.status !== AnnouncementStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Upsert: if already read, return existing record without error
  const readReceipt = await prisma.announcementRead.upsert({
    where: { announcementId_userId: { announcementId: params.id, userId: user.id } },
    update: {},
    create: { announcementId: params.id, userId: user.id },
  })

  return NextResponse.json({ data: readReceipt })
}
