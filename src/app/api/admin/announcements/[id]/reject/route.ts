export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { AnnouncementStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { reason } = body as Record<string, unknown>

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  if (announcement.status !== AnnouncementStatus.PENDING_APPROVAL) {
    return NextResponse.json(
      { error: 'Only PENDING_APPROVAL announcements can be rejected' },
      { status: 422 }
    )
  }

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      status: AnnouncementStatus.DRAFT,
      rejectionReason: typeof reason === 'string' ? reason.trim() || null : null,
      approvedByEmail: null,
      approvedAt: null,
    },
  })

  return NextResponse.json({ data: updated })
}
