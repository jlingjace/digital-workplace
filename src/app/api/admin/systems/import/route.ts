export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

interface CsvRow {
  name: string
  url: string
  description?: string
  category: string
  ownerName: string
  ownerEmail?: string
  ownerSlack?: string
  isQuickAccess?: string
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false
  return value.trim().toLowerCase() === 'true' || value.trim() === '1'
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parse (handles quoted fields with commas)
    const values: string[] = []
    let current = ''
    let inQuotes = false
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? ''
    })
    rows.push(row as unknown as CsvRow)
  }

  return rows
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  let csvText: string
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded. Use field name "file".' }, { status: 400 })
    }
    csvText = await (file as File).text()
  } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
    csvText = await request.text()
  } else {
    return NextResponse.json(
      { error: 'Content-Type must be multipart/form-data or text/csv' },
      { status: 415 }
    )
  }

  const rows = parseCsv(csvText)
  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV is empty or missing header row' }, { status: 400 })
  }

  let created = 0
  let updated = 0
  const failed: Array<{ row: number; reason: string }> = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // 1-indexed + header offset

    if (!row.name?.trim()) {
      failed.push({ row: rowNum, reason: 'name is required' })
      continue
    }
    if (!row.url?.trim()) {
      failed.push({ row: rowNum, reason: 'url is required' })
      continue
    }
    if (!row.category?.trim()) {
      failed.push({ row: rowNum, reason: 'category is required' })
      continue
    }
    if (!row.ownerName?.trim()) {
      failed.push({ row: rowNum, reason: 'ownerName is required' })
      continue
    }
    if (row.ownerEmail && !row.ownerEmail.includes('@')) {
      failed.push({ row: rowNum, reason: 'ownerEmail must be a valid email' })
      continue
    }

    const data = {
      url: row.url.trim(),
      description: row.description?.trim() || null,
      category: row.category.trim(),
      ownerName: row.ownerName.trim(),
      ownerEmail: row.ownerEmail?.trim().toLowerCase() || null,
      ownerSlack: row.ownerSlack?.trim() || null,
      isQuickAccess: parseBoolean(row.isQuickAccess),
    }

    try {
      const existing = await prisma.systemEntry.findFirst({
        where: { name: row.name.trim(), deletedAt: null },
      })

      if (existing) {
        await prisma.systemEntry.update({ where: { id: existing.id }, data })
        updated++
      } else {
        await prisma.systemEntry.create({
          data: { name: row.name.trim(), ...data },
        })
        created++
      }
    } catch (err) {
      failed.push({ row: rowNum, reason: String(err) })
    }
  }

  return NextResponse.json({ created, updated, failed, errors: failed })
}
