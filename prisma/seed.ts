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

  // Seed system catalog entries (20 tools)
  const systemEntries = [
    {
      name: 'Slack',
      url: 'https://slack.com',
      description: 'Company-wide messaging and collaboration platform for all teams',
      category: 'Communication',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: true,
    },
    {
      name: 'Google Workspace',
      url: 'https://workspace.google.com',
      description: 'Gmail, Google Drive, Docs, Sheets, Meet and Calendar for the entire company',
      category: 'Productivity',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: true,
    },
    {
      name: 'Notion',
      url: 'https://notion.so',
      description: 'Knowledge base, internal wikis and official information publishing',
      category: 'Productivity',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: true,
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      description: 'Company engineering code repositories and CI/CD pipelines',
      category: 'Engineering',
      ownerName: 'Engineering Platform',
      ownerEmail: 'eng-platform@company.com',
      ownerSlack: '@eng-platform',
      isQuickAccess: true,
    },
    {
      name: 'Jira',
      url: 'https://jira.atlassian.com',
      description: 'Engineering project tracking, sprint planning and IT ticketing',
      category: 'Engineering',
      ownerName: 'Engineering Platform',
      ownerEmail: 'eng-platform@company.com',
      ownerSlack: '@eng-platform',
      isQuickAccess: false,
    },
    {
      name: 'HubSpot',
      url: 'https://hubspot.com',
      description: 'CRM platform for GTM team — contacts, deals and marketing automation',
      category: 'Sales & Marketing',
      ownerName: 'GTM Operations',
      ownerEmail: 'gtm-ops@company.com',
      ownerSlack: '@gtm-ops',
      isQuickAccess: false,
    },
    {
      name: '1Password',
      url: 'https://1password.com',
      description: 'Company-wide password manager and secrets vault',
      category: 'Security',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: false,
    },
    {
      name: 'Gong',
      url: 'https://gong.io',
      description: 'Revenue intelligence — records and analyses sales calls and demos',
      category: 'Sales & Marketing',
      ownerName: 'GTM Operations',
      ownerEmail: 'gtm-ops@company.com',
      ownerSlack: '@gtm-ops',
      isQuickAccess: false,
    },
    {
      name: 'Greenhouse',
      url: 'https://greenhouse.io',
      description: 'Applicant tracking system for recruiting and onboarding',
      category: 'HR & Benefits',
      ownerName: 'People Ops',
      ownerEmail: 'people@company.com',
      ownerSlack: '@people-ops',
      isQuickAccess: false,
    },
    {
      name: 'Rippling',
      url: 'https://rippling.com',
      description: 'HR system for payroll, benefits, time off and employee management',
      category: 'HR & Benefits',
      ownerName: 'People Ops',
      ownerEmail: 'people@company.com',
      ownerSlack: '@people-ops',
      isQuickAccess: true,
    },
    {
      name: 'Figma',
      url: 'https://figma.com',
      description: 'Collaborative design tool for product and marketing teams',
      category: 'Design',
      ownerName: 'Design Team',
      ownerEmail: 'design@company.com',
      ownerSlack: '@design',
      isQuickAccess: false,
    },
    {
      name: 'Linear',
      url: 'https://linear.app',
      description: 'Issue tracker and roadmap tool for product and engineering',
      category: 'Engineering',
      ownerName: 'Engineering Platform',
      ownerEmail: 'eng-platform@company.com',
      ownerSlack: '@eng-platform',
      isQuickAccess: false,
    },
    {
      name: 'Confluence',
      url: 'https://confluence.atlassian.com',
      description: 'Technical documentation wiki for engineering and IT teams',
      category: 'Engineering',
      ownerName: 'Engineering Platform',
      ownerEmail: 'eng-platform@company.com',
      ownerSlack: '@eng-platform',
      isQuickAccess: false,
    },
    {
      name: 'Zoom',
      url: 'https://zoom.us',
      description: 'Video conferencing for external meetings and all-hands events',
      category: 'Communication',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: false,
    },
    {
      name: 'AWS Console',
      url: 'https://console.aws.amazon.com',
      description: 'Amazon Web Services management console for cloud infrastructure',
      category: 'Engineering',
      ownerName: 'DevOps Team',
      ownerEmail: 'devops@company.com',
      ownerSlack: '@devops',
      isQuickAccess: false,
    },
    {
      name: 'Datadog',
      url: 'https://datadoghq.com',
      description: 'Application performance monitoring, logging and alerting',
      category: 'Engineering',
      ownerName: 'DevOps Team',
      ownerEmail: 'devops@company.com',
      ownerSlack: '@devops',
      isQuickAccess: false,
    },
    {
      name: 'Okta',
      url: 'https://okta.com',
      description: 'Identity and access management — SSO and MFA for all company apps',
      category: 'Security',
      ownerName: 'IT Team',
      ownerEmail: 'it@company.com',
      ownerSlack: '@it-support',
      isQuickAccess: false,
    },
    {
      name: 'Looker',
      url: 'https://looker.com',
      description: 'Business intelligence and data analytics dashboards',
      category: 'Analytics',
      ownerName: 'Data Team',
      ownerEmail: 'data@company.com',
      ownerSlack: '@data-team',
      isQuickAccess: false,
    },
    {
      name: 'Zendesk',
      url: 'https://zendesk.com',
      description: 'Customer support ticketing system for the customer success team',
      category: 'Customer Success',
      ownerName: 'Customer Success',
      ownerEmail: 'cs@company.com',
      ownerSlack: '@customer-success',
      isQuickAccess: false,
    },
    {
      name: 'Internal HR Portal',
      url: 'https://hr.internal.company.com',
      description: 'Internal self-service HR portal for leave requests, payslips and benefits',
      category: 'HR & Benefits',
      ownerName: 'People Ops',
      ownerEmail: 'people@company.com',
      ownerSlack: '@people-ops',
      isQuickAccess: true,
    },
  ]

  for (const entry of systemEntries) {
    const existing = await prisma.systemEntry.findFirst({
      where: { name: entry.name, deletedAt: null },
    })
    if (existing) {
      await prisma.systemEntry.update({ where: { id: existing.id }, data: entry })
    } else {
      await prisma.systemEntry.create({ data: entry })
    }
  }

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
