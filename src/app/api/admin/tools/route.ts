import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { Department } from '@prisma/client'

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, url, department, description, ownerName, ownerSlack, ownerEmail, logoUrl } =
    body as Record<string, unknown>

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!department || !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }
  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim().length === 0) {
    return NextResponse.json({ error: 'ownerName is required' }, { status: 400 })
  }
  if (!ownerEmail || typeof ownerEmail !== 'string' || !ownerEmail.includes('@')) {
    return NextResponse.json({ error: 'ownerEmail must be a valid email' }, { status: 400 })
  }

  const tool = await prisma.tool.create({
    data: {
      name: (name as string).trim(),
      url: typeof url === 'string' ? url.trim() || null : null,
      department: department as Department,
      description: typeof description === 'string' ? description.trim() || null : null,
      ownerName: (ownerName as string).trim(),
      ownerSlack: typeof ownerSlack === 'string' ? ownerSlack.trim() || null : null,
      ownerEmail: (ownerEmail as string).trim().toLowerCase(),
      logoUrl: typeof logoUrl === 'string' ? logoUrl.trim() || null : null,
    },
  })

  return NextResponse.json({ data: tool }, { status: 201 })
}
