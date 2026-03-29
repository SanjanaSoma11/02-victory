# Victory — Nonprofit client case management

## Quick links

- [Source repository](https://github.com/2026-ASU-WiCS-Opportunity-Hack/02-victory)
- [Live app](https://02-victory.vercel.app)
- [Team Slack](https://opportunity-hack.slack.com/app_redirect?channel=team-02-victory)

## Team

- Tanmai Potla
- Suma Mallu
- Mrudula Eluri
- Sanjana Soma

## Overview

**Victory** is a web app for nonprofits: client profiles, searchable directory, voice capture with structured visit notes, funder-style reports, dashboards, calendar, CSV import/export, configurable fields, and an admin audit trail. Stack: Next.js, Supabase, Groq (optional for live transcription and drafting), Vercel.

## Problem

Teams delivering human services need to **register clients**, **log visits**, **schedule follow-ups**, and **report outcomes** to funders—without enterprise pricing. Victory keeps structured data, role-based access, migration paths, and reporting in one place.

## What you can try

| Area | In this repo |
|------|----------------|
| Auth & roles | Email signup, Google OAuth, middleware-protected routes; `profiles.role` (staff / admin) |
| Clients | Intake with demographics and custom fields; search by name, phone, email, ID |
| Services | Manual entry plus voice capture → structured summary, mood/risk, action items; history on profile |
| Operations | Dashboard KPIs (print-friendly), appointments calendar, reminders |
| Data | CSV import/export (admin); dev seed for local Supabase (`POST /api/dev/seed` in development only) |
| Governance | Custom field definitions, audit log; apply SQL migrations in Supabase (including RLS in `supabase/migrations/`) |

Routes under `/api/ai/` handle transcription, note structuring, funder narratives, and client handoff summaries when `GROQ_API_KEY` is set; otherwise the app uses demo data and mock responses.

## Local demo seed

With `.env.local` configured and migrations applied:

```bash
curl -X POST http://localhost:3000/api/dev/seed
```

Returns counts and test credentials (`test@victory.app` / `Test1234!`). Disabled outside `NODE_ENV=development`.

**Google sign-in:** In Supabase → Authentication → Providers → Google, enable and add OAuth client ID/secret; redirect URLs: `https://<your-domain>/auth/callback` and `http://localhost:3000/auth/callback`.

## Tech stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Next.js Route Handlers (`/api/*` including transcription, reports, export)
- **Database / auth:** Supabase (PostgreSQL + Auth + RLS)
- **Transcription & drafting:** Groq (Whisper-class STT + Llama 3.3); optional Gemini fallback (see planning notes in repo)

## Run locally

Prerequisites: [Node.js](https://nodejs.org/) 20+

```bash
git clone https://github.com/2026-ASU-WiCS-Opportunity-Hack/02-victory.git
cd 02-victory
npm install
cp .env.local.example .env.local
# Add GROQ_API_KEY and Supabase keys as needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without API keys, the app uses demo data and mock responses.

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

- `GROQ_API_KEY` — optional; enables live transcription and drafting
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase client
- `SUPABASE_SERVICE_ROLE_KEY` — server-only (seed, admin operations)
- `NEXT_PUBLIC_APP_URL` — e.g. `http://localhost:3000` or your deploy URL

## License

MIT — see [LICENSE](./LICENSE).
