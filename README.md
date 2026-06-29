# Digital Workplace — Backend

Next.js 14 (App Router) backend for the internal Digital Workplace portal.

> 📄 **产品需求文档**：见 [`docs/PRD.md`](./docs/PRD.md)（v0.2，含按代码实现状态校准的功能对照与差距分析）。原始 v0.1 设计稿版存档于 [`docs/Digital_Workplace_PRD_v0.1.docx`](./docs/Digital_Workplace_PRD_v0.1.docx)。

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v4 + Google OAuth |
| UI | Tailwind CSS (skeleton only) |
| Deploy | Vercel |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Full URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret — generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Yes | From Google Cloud Console → OAuth credentials |
| `GOOGLE_CLIENT_SECRET` | Yes | From Google Cloud Console → OAuth credentials |
| `ADMIN_EMAILS` | One of these | Comma-separated list of allowed admin emails |
| `ADMIN_DOMAIN` | One of these | Allow all emails from this domain (e.g. `company.com`) |

---

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally or via Docker

### Quick Start with Docker

```bash
docker run -d \
  --name digital-workplace-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=digital_workplace \
  -p 5432:5432 \
  postgres:16
```

Then set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/digital_workplace` in `.env.local`.

### Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

App runs at `http://localhost:3000`.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

---

## API Reference

### Public Endpoints (no auth required)

#### `GET /api/announcements`

List published announcements.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `department` | string | Filter by department: `ALL`, `PEOPLE`, `FINANCE`, `GTM`, `ENGINEERING`, `IT` |
| `q` | string | Full-text search (title, content, author) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response:**

```json
{
  "data": [
    {
      "id": "clxxx",
      "title": "2025 Performance Review Guidelines",
      "department": "PEOPLE",
      "authorName": "HR Team",
      "authorContact": "@hr-team",
      "publishedAt": "2025-03-15T08:00:00Z",
      "expiresAt": "2025-04-15T00:00:00Z",
      "isPinned": false,
      "status": "PUBLISHED"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### `GET /api/announcements/[id]`

Get a single published announcement by ID (includes full `content` field).

#### `GET /api/tools`

List all tools.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Search by name, description, or owner |
| `department` | string | Filter by department |

---

### Admin Endpoints (Google OAuth required)

All admin routes return `401 Unauthorized` if the session is missing or the user is not in the admin allowlist.

#### `GET /api/admin/announcements`

List all announcements (all statuses). Supports `?status=DRAFT&department=PEOPLE&page=1&limit=20`.

#### `POST /api/admin/announcements`

Create an announcement.

```json
{
  "title": "string (required)",
  "content": "string (required, HTML or Markdown)",
  "department": "ALL | PEOPLE | FINANCE | GTM | ENGINEERING | IT (required)",
  "authorName": "string (required)",
  "authorContact": "string (optional, e.g. @slack-handle)",
  "publishedAt": "ISO8601 (optional, defaults to now)",
  "expiresAt": "ISO8601 (optional)",
  "isPinned": "boolean (optional, default false)",
  "attachmentUrl": "string (optional)",
  "status": "DRAFT | PUBLISHED | ARCHIVED (optional, default DRAFT)"
}
```

#### `GET /api/admin/announcements/[id]`

Get any announcement by ID regardless of status.

#### `PUT /api/admin/announcements/[id]`

Update announcement. All fields are optional (partial update).

#### `DELETE /api/admin/announcements/[id]`

Soft delete — sets status to `ARCHIVED`.

#### `POST /api/admin/tools`

Create a tool.

```json
{
  "name": "string (required)",
  "url": "string (optional)",
  "department": "ALL | PEOPLE | FINANCE | GTM | ENGINEERING | IT (required)",
  "description": "string (optional)",
  "ownerName": "string (required)",
  "ownerSlack": "string (optional)",
  "ownerEmail": "string (required, valid email)",
  "logoUrl": "string (optional)"
}
```

#### `PUT /api/admin/tools/[id]`

Update a tool. All fields are optional (partial update).

#### `DELETE /api/admin/tools/[id]`

Hard delete a tool.

#### `GET /POST /api/auth/[...nextauth]`

NextAuth.js managed routes — Google OAuth flow. Users not in the admin allowlist are redirected to `/auth/error?error=AccessDenied`.

---

## Database Schema

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the full schema.

Key models:
- `Announcement` — company announcements with department scoping
- `Tool` — tool directory with ownership metadata
- `User`, `Account`, `Session`, `VerificationToken` — NextAuth.js managed

### Migrations

```bash
# Create and apply a new migration
npm run db:migrate

# Push schema changes without creating a migration file (dev only)
npm run db:push

# Open Prisma Studio (DB GUI)
npm run db:studio
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── announcements/
│   │   │   ├── route.ts          # GET /api/announcements
│   │   │   └── [id]/route.ts     # GET /api/announcements/:id
│   │   ├── tools/
│   │   │   └── route.ts          # GET /api/tools
│   │   ├── admin/
│   │   │   ├── announcements/
│   │   │   │   ├── route.ts      # GET, POST /api/admin/announcements
│   │   │   │   └── [id]/route.ts # GET, PUT, DELETE /api/admin/announcements/:id
│   │   │   └── tools/
│   │   │       ├── route.ts      # POST /api/admin/tools
│   │   │       └── [id]/route.ts # PUT, DELETE /api/admin/tools/:id
│   │   └── auth/
│   │       └── [...nextauth]/route.ts  # NextAuth.js
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts         # NextAuth config + isAdmin helper
│   ├── admin-auth.ts   # requireAdmin() guard for route handlers
│   └── prisma.ts       # Prisma singleton
prisma/
├── schema.prisma
└── seed.ts
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set all environment variables in Vercel dashboard
4. Add Vercel production URL to Google OAuth's Authorized redirect URIs:
   `https://your-app.vercel.app/api/auth/callback/google`
5. Deploy
