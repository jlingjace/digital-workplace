export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const system = await prisma.systemEntry.findFirst({
    where: { id: params.id, status: 'active', deletedAt: null },
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
  })

  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  return NextResponse.json({ data: system })
}
