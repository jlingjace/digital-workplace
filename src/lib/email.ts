/**
 * Email notification stub. Replace with a real provider (SendGrid, SES, Nodemailer)
 * before production. In CI/dev the function just logs to console.
 */
export interface EmailPayload {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    // TODO: wire up real email provider
    throw new Error('Email provider not configured for production')
  }
  // Development / test: log only
  console.log('[email]', payload.to, '|', payload.subject)
  console.log(payload.text)
}

export function buildAccessRequestEmail(opts: {
  systemName: string
  requesterName: string
  requesterEmail: string
  note?: string | null
  reviewUrl: string
}): EmailPayload {
  const { systemName, requesterName, requesterEmail, note, reviewUrl } = opts
  const noteBlock = note ? `\nNote from requester: ${note}\n` : ''
  const text = `
${requesterName} (${requesterEmail}) has requested access to ${systemName}.
${noteBlock}
Review the request: ${reviewUrl}
`.trim()

  const html = `
<p><strong>${requesterName}</strong> (<a href="mailto:${requesterEmail}">${requesterEmail}</a>) has requested access to <strong>${systemName}</strong>.</p>
${note ? `<p><em>Note: ${note}</em></p>` : ''}
<p><a href="${reviewUrl}">Review the request →</a></p>
  `.trim()

  return {
    to: '',
    subject: `Access request for ${systemName}`,
    text,
    html,
  }
}
