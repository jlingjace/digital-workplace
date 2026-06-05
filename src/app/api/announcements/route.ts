import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Department, AnnouncementStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const department = searchParams.get('department') as Department | null
  const q = searchParams.get('q') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const offset = (page - 1) * limit

  // Validate department enum if provided
  if (department && !Object.values(Department).includes(department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }

  const where = {
    status: AnnouncementStatus.PUBLISHED,
    ...(department ? { department } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { content: { contains: q, mode: 'insensitive' as const } },
            { authorName: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      select: {
        id: true,
        title: true,
        department: true,
        authorName: true,
        authorContact: true,
        publishedAt: true,
        expiresAt: true,
        isPinned: true,
        status: true,
      },
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
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
