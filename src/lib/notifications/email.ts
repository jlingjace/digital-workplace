import type { Announcement } from '@prisma/client'

// Uses Resend (preferred) or falls back to a generic SMTP via fetch
// Set RESEND_API_KEY for Resend, or SMTP_* vars for generic SMTP

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'noreply@company.com'

interface EmailPayload {
  to: string[]
  subject: string
  html: string
}

async function sendViaResend(payload: EmailPayload): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend API error: ${err}`)
  }
}

function buildApprovalRequestHtml(
  announcement: Pick<Announcement, 'id' | 'title' | 'content'>,
  portalBaseUrl: string
): string {
  const adminUrl = `${portalBaseUrl}/admin/announcements/${announcement.id}`
  const summary = announcement.content.replace(/<[^>]+>/g, '').slice(0, 300)
  return `
    <h2>Announcement Approval Request</h2>
    <p><strong>Title:</strong> ${escapeHtml(announcement.title)}</p>
    <p><strong>Preview:</strong> ${summary}${summary.length === 300 ? '…' : ''}</p>
    <p>
      <a href="${adminUrl}" style="background:#2563eb;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none;">
        Review &amp; Approve
      </a>
    </p>
  `
}

function buildReminderHtml(
  announcement: Pick<Announcement, 'id' | 'title'>,
  portalBaseUrl: string
): string {
  const url = `${portalBaseUrl}/announcements/${announcement.id}`
  return `
    <h2>Action Required: Read Announcement</h2>
    <p>You have not yet read the following mandatory announcement:</p>
    <p><strong>${escapeHtml(announcement.title)}</strong></p>
    <p>
      <a href="${url}" style="background:#2563eb;color:#fff;padding:8px 16px;border-radius:4px;text-decoration:none;">
        Read Now
      </a>
    </p>
  `
}

export async function sendApprovalRequestEmail(
  announcement: Pick<Announcement, 'id' | 'title' | 'content'>,
  approverEmails: string[]
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not configured, skipping approval email')
    return
  }
  if (approverEmails.length === 0) return

  const portalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  await sendViaResend({
    to: approverEmails,
    subject: `[Review Required] ${announcement.title}`,
    html: buildApprovalRequestHtml(announcement, portalBaseUrl),
  })
}

export async function sendAnnouncementEmail(
  announcement: Pick<Announcement, 'id' | 'title'>,
  recipients: string[]
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not configured, skipping announcement email')
    return
  }
  if (recipients.length === 0) return

  const portalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  await sendViaResend({
    to: recipients,
    subject: `[Reminder] Please read: ${announcement.title}`,
    html: buildReminderHtml(announcement, portalBaseUrl),
  })
}
