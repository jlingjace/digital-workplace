import type { Announcement } from '@prisma/client'

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN

interface SlackTextObject {
  type: string
  text: string
}

interface SlackBlock {
  type: string
  text?: SlackTextObject
  elements?: Array<{ type: string; text: SlackTextObject; url?: string }>
}

function buildAnnouncementBlocks(
  announcement: Pick<Announcement, 'id' | 'title' | 'content'>,
  portalBaseUrl: string
): SlackBlock[] {
  const url = `${portalBaseUrl}/announcements/${announcement.id}`
  // First 200 chars of stripped content as summary
  const summary = announcement.content.replace(/<[^>]+>/g, '').slice(0, 200)

  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: '📢 New Announcement' },
    },
    {
      type: 'section',
      text: { type: 'mrkdwn', text: `*${announcement.title}*\n${summary}${summary.length === 200 ? '…' : ''}` },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Read Full Announcement' },
          url,
        },
      ],
    },
  ]
}

export async function postAnnouncementNotification(
  announcement: Pick<Announcement, 'id' | 'title' | 'content'>,
  channelId: string
): Promise<void> {
  if (!SLACK_BOT_TOKEN) {
    console.warn('[slack] SLACK_BOT_TOKEN not configured, skipping notification')
    return
  }

  const portalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const blocks = buildAnnouncementBlocks(announcement, portalBaseUrl)

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: channelId,
      text: `New Announcement: ${announcement.title}`,
      blocks,
    }),
  })

  const data = await res.json() as { ok: boolean; error?: string }
  if (!data.ok) {
    console.error('[slack] chat.postMessage failed:', data.error)
    throw new Error(`Slack API error: ${data.error}`)
  }
}

export async function sendSlackDM(
  userEmail: string,
  message: string
): Promise<void> {
  if (!SLACK_BOT_TOKEN) {
    console.warn('[slack] SLACK_BOT_TOKEN not configured, skipping DM')
    return
  }

  // Look up user by email
  const lookupRes = await fetch(
    `https://slack.com/api/users.lookupByEmail?email=${encodeURIComponent(userEmail)}`,
    { headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  )
  const lookupData = await lookupRes.json() as { ok: boolean; user?: { id: string }; error?: string }

  if (!lookupData.ok || !lookupData.user) {
    console.warn(`[slack] Could not find Slack user for email ${userEmail}: ${lookupData.error}`)
    return
  }

  const dmRes = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: lookupData.user.id,
      text: message,
    }),
  })

  const dmData = await dmRes.json() as { ok: boolean; error?: string }
  if (!dmData.ok) {
    console.error('[slack] DM failed:', dmData.error)
  }
}
