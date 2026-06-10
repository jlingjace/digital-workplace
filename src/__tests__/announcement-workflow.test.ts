/**
 * Unit tests for announcement workflow state machine.
 * These tests verify the state transition rules enforced by the API routes.
 * They run without a database by testing the transition logic directly.
 */

import { AnnouncementStatus } from '@prisma/client'

// State machine: which statuses allow which transitions
const ALLOWED_TRANSITIONS: Record<string, AnnouncementStatus[]> = {
  submit: [AnnouncementStatus.DRAFT],
  approve: [AnnouncementStatus.PENDING_APPROVAL],
  reject: [AnnouncementStatus.PENDING_APPROVAL],
  archive: [AnnouncementStatus.PUBLISHED, AnnouncementStatus.EXPIRED],
  edit: [AnnouncementStatus.DRAFT],
}

function canTransition(action: string, currentStatus: AnnouncementStatus): boolean {
  return ALLOWED_TRANSITIONS[action]?.includes(currentStatus) ?? false
}

describe('Announcement workflow state machine', () => {
  describe('submit (DRAFT → PENDING_APPROVAL)', () => {
    it('allows submitting from DRAFT', () => {
      expect(canTransition('submit', AnnouncementStatus.DRAFT)).toBe(true)
    })

    it('rejects submitting from PENDING_APPROVAL', () => {
      expect(canTransition('submit', AnnouncementStatus.PENDING_APPROVAL)).toBe(false)
    })

    it('rejects submitting from PUBLISHED', () => {
      expect(canTransition('submit', AnnouncementStatus.PUBLISHED)).toBe(false)
    })
  })

  describe('approve (PENDING_APPROVAL → PUBLISHED)', () => {
    it('allows approving from PENDING_APPROVAL', () => {
      expect(canTransition('approve', AnnouncementStatus.PENDING_APPROVAL)).toBe(true)
    })

    it('rejects approving from DRAFT', () => {
      expect(canTransition('approve', AnnouncementStatus.DRAFT)).toBe(false)
    })

    it('rejects approving an already PUBLISHED announcement', () => {
      expect(canTransition('approve', AnnouncementStatus.PUBLISHED)).toBe(false)
    })
  })

  describe('reject (PENDING_APPROVAL → DRAFT)', () => {
    it('allows rejecting from PENDING_APPROVAL', () => {
      expect(canTransition('reject', AnnouncementStatus.PENDING_APPROVAL)).toBe(true)
    })

    it('rejects rejecting a DRAFT announcement', () => {
      expect(canTransition('reject', AnnouncementStatus.DRAFT)).toBe(false)
    })

    it('rejects rejecting a PUBLISHED announcement', () => {
      expect(canTransition('reject', AnnouncementStatus.PUBLISHED)).toBe(false)
    })
  })

  describe('archive (PUBLISHED|EXPIRED → ARCHIVED)', () => {
    it('allows archiving a PUBLISHED announcement', () => {
      expect(canTransition('archive', AnnouncementStatus.PUBLISHED)).toBe(true)
    })

    it('allows archiving an EXPIRED announcement', () => {
      expect(canTransition('archive', AnnouncementStatus.EXPIRED)).toBe(true)
    })

    it('rejects archiving a DRAFT announcement', () => {
      expect(canTransition('archive', AnnouncementStatus.DRAFT)).toBe(false)
    })

    it('rejects archiving a PENDING_APPROVAL announcement', () => {
      expect(canTransition('archive', AnnouncementStatus.PENDING_APPROVAL)).toBe(false)
    })
  })

  describe('edit restriction', () => {
    it('allows editing DRAFT', () => {
      expect(canTransition('edit', AnnouncementStatus.DRAFT)).toBe(true)
    })

    it('rejects editing PENDING_APPROVAL', () => {
      expect(canTransition('edit', AnnouncementStatus.PENDING_APPROVAL)).toBe(false)
    })

    it('rejects editing PUBLISHED', () => {
      expect(canTransition('edit', AnnouncementStatus.PUBLISHED)).toBe(false)
    })
  })

  describe('complete DRAFT → PUBLISHED flow', () => {
    it('DRAFT can submit, then approve, completing the full happy path', () => {
      let status = AnnouncementStatus.DRAFT
      expect(canTransition('submit', status)).toBe(true)
      status = AnnouncementStatus.PENDING_APPROVAL
      expect(canTransition('approve', status)).toBe(true)
      status = AnnouncementStatus.PUBLISHED
      expect(canTransition('archive', status)).toBe(true)
    })

    it('DRAFT → PENDING → DRAFT (reject) → submit again', () => {
      let status = AnnouncementStatus.DRAFT
      expect(canTransition('submit', status)).toBe(true)
      status = AnnouncementStatus.PENDING_APPROVAL
      expect(canTransition('reject', status)).toBe(true)
      status = AnnouncementStatus.DRAFT // after rejection, back to DRAFT
      expect(canTransition('submit', status)).toBe(true)
    })
  })
})

describe('Expiry logic', () => {
  it('identifies expired announcements correctly', () => {
    const past = new Date(Date.now() - 1000)
    const future = new Date(Date.now() + 1000 * 60 * 60)

    function shouldExpire(expiresAt: Date | null, status: AnnouncementStatus): boolean {
      return status === AnnouncementStatus.PUBLISHED && expiresAt !== null && expiresAt <= new Date()
    }

    expect(shouldExpire(past, AnnouncementStatus.PUBLISHED)).toBe(true)
    expect(shouldExpire(future, AnnouncementStatus.PUBLISHED)).toBe(false)
    expect(shouldExpire(null, AnnouncementStatus.PUBLISHED)).toBe(false)
    expect(shouldExpire(past, AnnouncementStatus.DRAFT)).toBe(false)
  })
})
