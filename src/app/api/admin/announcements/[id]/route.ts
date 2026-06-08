export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { Department, AnnouncementStatus } from '@prisma/client'

function parseDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null) return null
  const d = new Date(value as string)
  if (isNaN(d.getTime())) throw new Error('Invalid date')
  return d
}

async function findAnnouncement(id: string) {
  return prisma.announcement.findUnique({ where: { id } })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const announcement = await findAnnouncement(params.id)
  if (!announcement) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  return NextResponse.json({ data: announcement })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await findAnnouncement(params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    title,
    content,
    department,
    authorName,
    authorContact,
    publishedAt,
    expiresAt,
    isPinned,
    attachmentUrl,
    status,
  } = body as Record<string, unknown>

  // Validate enum fields if provided
  if (department !== undefined && !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }
  if (status !== undefined && !Object.values(AnnouncementStatus).includes(status as AnnouncementStatus)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  let parsedPublishedAt: Date | undefined
  let parsedExpiresAt: Date | null | undefined
  try {
    parsedPublishedAt = publishedAt !== undefined ? (parseDate(publishedAt) ?? undefined) : undefined
    parsedExpiresAt = expiresAt !== undefined ? parseDate(expiresAt) : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid date format for publishedAt/expiresAt' }, { status: 400 })
  }

  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title: (title as string).trim() } : {}),
      ...(content !== undefined ? { content: (content as string).trim() } : {}),
      ...(department !== undefined ? { department: department as Department } : {}),
      ...(authorName !== undefined ? { authorName: (authorName as string).trim() } : {}),
      ...(authorContact !== undefined ? { authorContact: (authorContact as string | null) } : {}),
      ...(parsedPublishedAt !== undefined ? { publishedAt: parsedPublishedAt } : {}),
      ...(parsedExpiresAt !== undefined ? { expiresAt: parsedExpiresAt } : {}),
      ...(isPinned !== undefined ? { isPinned: isPinned as boolean } : {}),
      ...(attachmentUrl !== undefined ? { attachmentUrl: attachmentUrl as string | null } : {}),
      ...(status !== undefined ? { status: status as AnnouncementStatus } : {}),
    },
  })

  return NextResponse.json({ data: announcement })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await findAnnouncement(params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
  }

  // Soft delete: set status to ARCHIVED
  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: { status: AnnouncementStatus.ARCHIVED },
  })

  return NextResponse.json({ data: announcement })
}
