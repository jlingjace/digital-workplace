export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { AnnouncementStatus } from '@prisma/client'
import { sendAnnouncementEmail } from '@/lib/notifications/email'
import { sendSlackDM } from '@/lib/notifications/slack'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  let body: unknown = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine
  }

  // Optional: caller can pass specific recipient emails; defaults to all users who haven't read
  const { recipients: recipientOverride, channel = 'email' } = body as {
    recipients?: string[]
    channel?: 'email' | 'slack' | 'both'
  }

  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: { readReceipts: { select: { userId: true } } },
  })

  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  if (announcement.status !== AnnouncementStatus.PUBLISHED) {
    return NextResponse.json(
      { error: 'Can only send reminders for PUBLISHED announcements' },
      { status: 422 }
    )
  }

  const readUserIds = new Set(announcement.readReceipts.map((r) => r.userId))

  let unreadEmails: string[]

  if (recipientOverride && recipientOverride.length > 0) {
    unreadEmails = recipientOverride
  } else {
    // Find all users who haven't read this announcement
    const unreadUsers = await prisma.user.findMany({
      where: {
        email: { not: null },
        id: { notIn: [...readUserIds] },
      },
      select: { email: true },
    })
    unreadEmails = unreadUsers.flatMap((u) => (u.email ? [u.email] : []))
  }

  if (unreadEmails.length === 0) {
    return NextResponse.json({ data: { sent: 0, message: 'All users have already read this announcement' } })
  }

  const errors: string[] = []

  if (channel === 'email' || channel === 'both') {
    try {
      await sendAnnouncementEmail(announcement, unreadEmails)
    } catch (err) {
      console.error('[remind] email send failed:', err)
      errors.push('email')
    }
  }

  if (channel === 'slack' || channel === 'both') {
    await Promise.all(
      unreadEmails.map((email) =>
        sendSlackDM(
          email,
          `Reminder: Please read the announcement "${announcement.title}" — ${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/announcements/${announcement.id}`
        ).catch((err) => {
          console.error(`[remind] Slack DM to ${email} failed:`, err)
          errors.push(`slack:${email}`)
        })
      )
    )
  }

  return NextResponse.json({
    data: {
      sent: unreadEmails.length,
      recipients: unreadEmails,
      errors: errors.length > 0 ? errors : undefined,
    },
  })
}
