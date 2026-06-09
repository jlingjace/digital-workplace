export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { Department } from '@prisma/client'

export async function GET(_request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const configs = await prisma.approvalConfig.findMany({
    orderBy: { department: 'asc' },
  })

  return NextResponse.json({ data: configs })
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { department, approverEmails } = body as Record<string, unknown>

  if (!department || !Object.values(Department).includes(department as Department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }

  if (!Array.isArray(approverEmails) || approverEmails.some((e) => typeof e !== 'string')) {
    return NextResponse.json({ error: 'approverEmails must be an array of strings' }, { status: 400 })
  }

  const emails = (approverEmails as string[]).map((e) => e.trim().toLowerCase()).filter(Boolean)

  const config = await prisma.approvalConfig.upsert({
    where: { department: department as Department },
    update: { approverEmails: emails },
    create: { department: department as Department, approverEmails: emails },
  })

  return NextResponse.json({ data: config })
}
