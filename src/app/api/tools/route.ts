import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Department } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const department = searchParams.get('department') as Department | null

  if (department && !Object.values(Department).includes(department)) {
    return NextResponse.json({ error: 'Invalid department value' }, { status: 400 })
  }

  const where = {
    ...(department ? { department } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
            { ownerName: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const data = await prisma.tool.findMany({
    where,
    orderBy: [{ department: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ data })
}
