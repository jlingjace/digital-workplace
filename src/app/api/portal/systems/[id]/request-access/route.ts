export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { sendEmail, buildAccessRequestEmail } from '@/lib/email'
import { RequestStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const system = await prisma.systemEntry.findFirst({
    where: { id: params.id, status: 'active', deletedAt: null },
  })
  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  // Upsert requester user record
  const requester = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
  })

  // Prevent duplicate pending requests
  const existingPending = await prisma.accessRequest.findFirst({
    where: {
      systemId: params.id,
      requesterId: requester.id,
      status: RequestStatus.PENDING,
    },
  })
  if (existingPending) {
    return NextResponse.json(
      { error: 'You already have a pending access request for this system' },
      { status: 409 }
    )
  }

  let note: string | null = null
  try {
    const body = await request.json()
    if (typeof body?.note === 'string') note = body.note.trim() || null
  } catch {
    // note is optional; ignore parse errors
  }

  const accessRequest = await prisma.accessRequest.create({
    data: {
      systemId: params.id,
      requesterId: requester.id,
      note,
    },
    include: {
      system: { select: { id: true, name: true } },
    },
  })

  // Send notification email to System Owner
  if (system.ownerEmail) {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const reviewUrl = `${baseUrl}/admin/access-requests/${accessRequest.id}`
    const emailPayload = buildAccessRequestEmail({
      systemName: system.name,
      requesterName: session.user.name ?? session.user.email,
      requesterEmail: session.user.email,
      note,
      reviewUrl,
    })
    emailPayload.to = system.ownerEmail
    await sendEmail(emailPayload).catch((err) => {
      // Non-blocking: log error but don't fail the request
      console.error('[email] Failed to send access request notification:', err)
    })
  }

  return NextResponse.json({ data: accessRequest }, { status: 201 })
}
