export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { authOptions } from '@/lib/auth'
import { RequestStatus } from '@prisma/client'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const session = await getServerSession(authOptions)

  const existing = await prisma.accessRequest.findUnique({
    where: { id: params.id },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Access request not found' }, { status: 404 })
  }
  if (existing.status !== RequestStatus.PENDING) {
    return NextResponse.json(
      { error: `Request is already ${existing.status.toLowerCase()}` },
      { status: 409 }
    )
  }

  const updated = await prisma.accessRequest.update({
    where: { id: params.id },
    data: {
      status: RequestStatus.APPROVED,
      reviewedBy: session?.user?.email ?? null,
      reviewedAt: new Date(),
    },
    include: {
      system: { select: { id: true, name: true } },
      requester: { select: { id: true, name: true, email: true } },
    },
  })

  return NextResponse.json({ data: updated })
}
