export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { AnnouncementStatus } from '@prisma/client'
import { sendApprovalRequestEmail } from '@/lib/notifications/email'

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

  if (announcement.status !== AnnouncementStatus.DRAFT) {
    return NextResponse.json(
      { error: 'Only DRAFT announcements can be submitted for approval' },
      { status: 422 }
    )
  }

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      status: AnnouncementStatus.PENDING_APPROVAL,
      submittedAt: new Date(),
      rejectionReason: null,
    },
  })

  // Notify approvers via email (fire-and-forget, don't block response)
  const config = await prisma.approvalConfig.findUnique({
    where: { department: announcement.department },
  })
  if (config && config.approverEmails.length > 0) {
    sendApprovalRequestEmail(updated, config.approverEmails).catch((err) =>
      console.error('[submit] approval email failed:', err)
    )
  }

  return NextResponse.json({ data: updated })
}
