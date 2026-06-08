export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as AnnouncementStatus | null
  const department = searchParams.get('department') as Department | null
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))

  if (status && !Object.values(AnnouncementStatus).includes(status as AnnouncementStatus)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }
  if (department && !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }
  const offset = (page - 1) * limit

  const where = {
    ...(status ? { status } : {}),
    ...(department ? { department } : {}),
  }

  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
    prisma.announcement.count({ where }),
  ])

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

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

  // Required field validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  if (!department || !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }
  if (!authorName || typeof authorName !== 'string' || authorName.trim().length === 0) {
    return NextResponse.json({ error: 'authorName is required' }, { status: 400 })
  }
  if (status && !Object.values(AnnouncementStatus).includes(status as AnnouncementStatus)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  let parsedPublishedAt: Date | undefined
  let parsedExpiresAt: Date | null | undefined
  try {
    parsedPublishedAt = parseDate(publishedAt) ?? undefined
    parsedExpiresAt = parseDate(expiresAt)
  } catch {
    return NextResponse.json({ error: 'Invalid date format for publishedAt/expiresAt' }, { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: (title as string).trim(),
      content: (content as string).trim(),
      department: department as Department,
      authorName: (authorName as string).trim(),
      authorContact: typeof authorContact === 'string' ? authorContact.trim() || null : null,
      ...(parsedPublishedAt !== undefined ? { publishedAt: parsedPublishedAt } : {}),
      expiresAt: parsedExpiresAt ?? null,
      isPinned: typeof isPinned === 'boolean' ? isPinned : false,
      attachmentUrl: typeof attachmentUrl === 'string' ? attachmentUrl.trim() || null : null,
      status: (status as AnnouncementStatus) ?? AnnouncementStatus.DRAFT,
    },
  })

  return NextResponse.json({ data: announcement }, { status: 201 })
}
