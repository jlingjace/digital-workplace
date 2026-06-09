export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const systems = await prisma.systemEntry.findMany({
    where: {
      deletedAt: null,
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ data: systems })
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
    name, description, url, iconUrl, category, status,
    ownerName, ownerEmail, ownerSlack, isQuickAccess,
  } = body as Record<string, unknown>

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    return NextResponse.json({ error: 'category is required' }, { status: 400 })
  }
  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim().length === 0) {
    return NextResponse.json({ error: 'ownerName is required' }, { status: 400 })
  }
  if (ownerEmail !== undefined && ownerEmail !== null && (typeof ownerEmail !== 'string' || !ownerEmail.includes('@'))) {
    return NextResponse.json({ error: 'ownerEmail must be a valid email' }, { status: 400 })
  }
  if (status !== undefined && status !== 'active' && status !== 'inactive') {
    return NextResponse.json({ error: 'status must be active or inactive' }, { status: 400 })
  }

  const system = await prisma.systemEntry.create({
    data: {
      name: (name as string).trim(),
      description: typeof description === 'string' ? description.trim() || null : null,
      url: (url as string).trim(),
      iconUrl: typeof iconUrl === 'string' ? iconUrl.trim() || null : null,
      category: (category as string).trim(),
      status: typeof status === 'string' ? status : 'active',
      ownerName: (ownerName as string).trim(),
      ownerEmail: typeof ownerEmail === 'string' ? ownerEmail.trim().toLowerCase() || null : null,
      ownerSlack: typeof ownerSlack === 'string' ? ownerSlack.trim() || null : null,
      isQuickAccess: typeof isQuickAccess === 'boolean' ? isQuickAccess : false,
    },
  })

  return NextResponse.json({ data: system }, { status: 201 })
}
