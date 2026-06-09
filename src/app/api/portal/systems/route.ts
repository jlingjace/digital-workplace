export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q') ?? ''
  const quickAccessOnly = searchParams.get('quickAccess') === 'true'

  const systems = await prisma.systemEntry.findMany({
    where: {
      status: 'active',
      deletedAt: null,
      ...(category ? { category } : {}),
      ...(quickAccessOnly ? { isQuickAccess: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { ownerName: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      iconUrl: true,
      category: true,
      ownerName: true,
      isQuickAccess: true,
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ data: systems })
}
