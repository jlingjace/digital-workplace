export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { Department } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await prisma.tool.findUnique({ where: { id: params.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, url, department, description, ownerName, ownerSlack, ownerEmail, logoUrl } =
    body as Record<string, unknown>

  if (department !== undefined && !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }
  if (ownerEmail !== undefined && (typeof ownerEmail !== 'string' || !ownerEmail.includes('@'))) {
    return NextResponse.json({ error: 'ownerEmail must be a valid email' }, { status: 400 })
  }

  const tool = await prisma.tool.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined ? { name: (name as string).trim() } : {}),
      ...(url !== undefined ? { url: url as string | null } : {}),
      ...(department !== undefined ? { department: department as Department } : {}),
      ...(description !== undefined ? { description: description as string | null } : {}),
      ...(ownerName !== undefined ? { ownerName: (ownerName as string).trim() } : {}),
      ...(ownerSlack !== undefined ? { ownerSlack: ownerSlack as string | null } : {}),
      ...(ownerEmail !== undefined ? { ownerEmail: (ownerEmail as string).trim().toLowerCase() } : {}),
      ...(logoUrl !== undefined ? { logoUrl: logoUrl as string | null } : {}),
    },
  })

  return NextResponse.json({ data: tool })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const existing = await prisma.tool.findUnique({ where: { id: params.id } })
  if (!existing) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  await prisma.tool.delete({ where: { id: params.id } })

  return NextResponse.json({ message: 'Tool deleted successfully' })
}
