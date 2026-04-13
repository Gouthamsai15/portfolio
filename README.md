# GSR ERP - AI Resume Portfolio Generator

A full-stack Next.js SaaS application that turns uploaded resume PDFs into live portfolio sites on `/username` routes.

## Stack

- Next.js App Router
- Tailwind CSS + Framer Motion
- Supabase PostgreSQL + Storage
- Gemini API via `@google/generative-ai`
- `pdf-parse` for resume extraction

## Features

- Public resume-to-portfolio flow with no user login
- PDF upload to Supabase Storage
- Resume text extraction with `pdf-parse`
- Gemini-powered JSON normalization
- Instant portfolio generation on dynamic `/[username]` routes
- Five premium templates with global primary/accent color variables
- Copy-link and resume download actions on generated sites
- Superadmin dashboard with search, stats, HTML template upload, view, and delete
- Dynamic SEO metadata per portfolio route

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` optional, accepts any valid Gemini model string
- `ADMIN_EMAILS`
- `ADMIN_PASSWORD`

4. Run the SQL in [supabase/schema.sql](/Users/apple/Desktop/portafolio/supabase/schema.sql) inside the Supabase SQL editor.

5. Start the app:

```bash
npm run dev
```

## Main Routes

- `/` - landing page + portfolio generator
- `/[username]` - live generated portfolio
- `/admin/login` - admin login
- `/admin` - admin dashboard
- `POST /api/portfolios` - resume upload + AI generation + DB insert
- `DELETE /api/admin/portfolios/[id]` - admin portfolio deletion
- `POST /api/admin/templates` - upload a custom HTML template

## Notes

- The generator expects a readable PDF under 8 MB.
- If `GEMINI_MODEL` is blank, the app automatically falls back to official Gemini Flash models.
- Storage uses a public `resumes` bucket because portfolio pages expose a resume download button.
- The admin dashboard uses `ADMIN_EMAILS` plus `ADMIN_PASSWORD`.
