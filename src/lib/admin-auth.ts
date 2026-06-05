import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions, isAdmin } from './auth'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
