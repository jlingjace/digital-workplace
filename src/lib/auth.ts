import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const adminEmails = getAdminEmails()
  // Allow any @company.com email if ADMIN_EMAILS not configured, or check explicit list
  if (adminEmails.length === 0) {
    const adminDomain = process.env.ADMIN_DOMAIN ?? ''
    return adminDomain ? email.endsWith(`@${adminDomain}`) : false
  }
  return adminEmails.includes(email.toLowerCase())
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow admin emails to sign in to admin panel
      // Public users don't need to sign in at all
      const email = user.email ?? ''
      if (!isAdmin(email)) {
        return '/auth/error?error=AccessDenied'
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = isAdmin(user.email)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { isAdmin?: boolean }).isAdmin = token.isAdmin as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/auth/error',
  },
}
