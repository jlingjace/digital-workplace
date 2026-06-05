import { PrismaClient, Department, AnnouncementStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: '2025 Annual Performance Review Guidelines',
        content: '<p>The performance review cycle for 2025 will begin on March 15. All employees should complete their self-assessments by March 30.</p>',
        department: Department.PEOPLE,
        authorName: 'HR Team',
        authorContact: '@hr-team',
        publishedAt: new Date('2025-03-01'),
        expiresAt: new Date('2025-04-15'),
        isPinned: true,
        status: AnnouncementStatus.PUBLISHED,
      },
      {
        title: 'Q1 Engineering All-Hands',
        content: '<p>Join us for the Q1 Engineering All-Hands meeting on Friday. Link will be shared via calendar invite.</p>',
        department: Department.ENGINEERING,
        authorName: 'Engineering Leadership',
        authorContact: '@eng-leadership',
        publishedAt: new Date('2025-02-20'),
        status: AnnouncementStatus.PUBLISHED,
      },
      {
        title: 'New Expense Reimbursement Policy',
        content: '<p>Effective April 1, the expense reimbursement process has been updated. Please review the new policy in Notion.</p>',
        department: Department.FINANCE,
        authorName: 'Finance Team',
        authorContact: '@finance',
        publishedAt: new Date('2025-03-20'),
        status: AnnouncementStatus.PUBLISHED,
      },
    ],
    skipDuplicates: true,
  })

  // Seed tools
  await prisma.tool.createMany({
    data: [
      {
        name: 'Slack',
        url: 'https://slack.com',
        department: Department.ALL,
        description: 'Internal and external IM tool for all teams',
        ownerName: 'IT Team',
        ownerSlack: '@it-support',
        ownerEmail: 'it@company.com',
      },
      {
        name: 'Notion',
        url: 'https://notion.so',
        department: Department.ALL,
        description: 'Knowledge base management and official information publishing',
        ownerName: 'IT Team',
        ownerSlack: '@it-support',
        ownerEmail: 'it@company.com',
      },
      {
        name: 'HubSpot',
        url: 'https://hubspot.com',
        department: Department.GTM,
        description: 'CRM tool for GTM team members',
        ownerName: 'GTM Operations',
        ownerSlack: '@gtm-ops',
        ownerEmail: 'gtm-ops@company.com',
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        department: Department.ENGINEERING,
        description: 'Company engineering code repository',
        ownerName: 'Engineering Platform',
        ownerSlack: '@eng-platform',
        ownerEmail: 'eng-platform@company.com',
      },
      {
        name: 'Jira',
        url: 'https://jira.atlassian.com',
        department: Department.ENGINEERING,
        description: 'Engineering project development, project management, and IT ticket system',
        ownerName: 'Engineering Platform',
        ownerSlack: '@eng-platform',
        ownerEmail: 'eng-platform@company.com',
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
