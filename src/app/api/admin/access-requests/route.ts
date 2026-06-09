export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { RequestStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status') as RequestStatus | null

  if (statusParam && !Object.values(RequestStatus).includes(statusParam)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  const requests = await prisma.accessRequest.findMany({
    where: statusParam ? { status: statusParam } : {},
    include: {
      system: { select: { id: true, name: true, category: true } },
      requester: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: requests })
}
