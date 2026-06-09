-- Migration: announcement workflow + mandatory read tracking
-- SNOW-189: 公告系统后端 — 发布工作流 + 必读追踪 + Slack/邮件通知

-- Add new status values to AnnouncementStatus enum
ALTER TYPE "AnnouncementStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';
ALTER TYPE "AnnouncementStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

-- Add workflow fields to Announcement table
ALTER TABLE "Announcement"
  ADD COLUMN IF NOT EXISTS "isMandatory"     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "slackChannelId"  TEXT,
  ADD COLUMN IF NOT EXISTS "submittedAt"     TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "approvedByEmail" TEXT,
  ADD COLUMN IF NOT EXISTS "approvedAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

-- Add expiresAt index for cron job efficiency
CREATE INDEX IF NOT EXISTS "Announcement_expiresAt_idx" ON "Announcement"("expiresAt");

-- Add relation for User -> AnnouncementRead
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "announcementReads" TEXT; -- placeholder, actual relation below

-- AnnouncementRead table for mandatory read tracking
CREATE TABLE IF NOT EXISTS "AnnouncementRead" (
  "id"             TEXT NOT NULL,
  "announcementId" TEXT NOT NULL,
  "userId"         TEXT NOT NULL,
  "readAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnnouncementRead_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AnnouncementRead_announcementId_userId_key" UNIQUE ("announcementId", "userId"),
  CONSTRAINT "AnnouncementRead_announcementId_fkey"
    FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE,
  CONSTRAINT "AnnouncementRead_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "AnnouncementRead_announcementId_idx" ON "AnnouncementRead"("announcementId");
CREATE INDEX IF NOT EXISTS "AnnouncementRead_userId_idx"         ON "AnnouncementRead"("userId");

-- Clean up placeholder column
ALTER TABLE "User" DROP COLUMN IF EXISTS "announcementReads";

-- ApprovalConfig table: department -> approver email list
CREATE TABLE IF NOT EXISTS "ApprovalConfig" (
  "id"             TEXT NOT NULL,
  "department"     "Department" NOT NULL,
  "approverEmails" TEXT[] NOT NULL DEFAULT '{}',
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ApprovalConfig_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ApprovalConfig_department_key" UNIQUE ("department")
);
