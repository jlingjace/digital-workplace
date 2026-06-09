export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const system = await prisma.systemEntry.findFirst({
    where: { id: params.id, deletedAt: null },
  })
  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  return NextResponse.json({ data: system })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await prisma.systemEntry.findFirst({
    where: { id: params.id, deletedAt: null },
  })
  if (!existing) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    name, description, url, iconUrl, category, status,
    ownerName, ownerEmail, ownerSlack, isQuickAccess,
  } = body as Record<string, unknown>

  if (ownerEmail !== undefined && ownerEmail !== null && (typeof ownerEmail !== 'string' || !ownerEmail.includes('@'))) {
    return NextResponse.json({ error: 'ownerEmail must be a valid email' }, { status: 400 })
  }
  if (status !== undefined && status !== 'active' && status !== 'inactive') {
    return NextResponse.json({ error: 'status must be active or inactive' }, { status: 400 })
  }

  const system = await prisma.systemEntry.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined ? { name: (name as string).trim() } : {}),
      ...(description !== undefined ? { description: description as string | null } : {}),
      ...(url !== undefined ? { url: (url as string).trim() } : {}),
      ...(iconUrl !== undefined ? { iconUrl: iconUrl as string | null } : {}),
      ...(category !== undefined ? { category: (category as string).trim() } : {}),
      ...(status !== undefined ? { status: status as string } : {}),
      ...(ownerName !== undefined ? { ownerName: (ownerName as string).trim() } : {}),
      ...(ownerEmail !== undefined ? { ownerEmail: ownerEmail ? (ownerEmail as string).trim().toLowerCase() : null } : {}),
      ...(ownerSlack !== undefined ? { ownerSlack: ownerSlack as string | null } : {}),
      ...(isQuickAccess !== undefined ? { isQuickAccess: isQuickAccess as boolean } : {}),
    },
  })

  return NextResponse.json({ data: system })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await prisma.systemEntry.findFirst({
    where: { id: params.id, deletedAt: null },
  })
  if (!existing) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  // Soft delete
  await prisma.systemEntry.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  })

  return NextResponse.json({ message: 'System delisted successfully' })
}
