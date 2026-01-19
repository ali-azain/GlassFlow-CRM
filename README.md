## GlassFlow CRM (Vite + React) — Supabase-enabled

This project is a minimalist, glassy CRM with:
- **Supabase Auth** (email/password)
- **Postgres** storage for leads
- **Row Level Security (RLS)** so each user can only access their own data

### Run locally

**Prerequisites**: Node.js

1. Install dependencies:

```bash
npm install
```

2. Create your Supabase schema:
- Open Supabase → **SQL Editor**
- Run `supabase/schema.sql`

3. Enable auth:
- Supabase → **Authentication** → **Providers**
- Enable **Email** provider (email/password)

4. Create `.env.local` (do not commit) in the project root:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Tip: `env.example` is included as a template.

5. Start the dev server:

```bash
npm run dev
```

### Notes
- **Privacy**: The `leads` table has RLS policies so only `auth.uid()` can read/write their own rows.
- If you see “Supabase is not configured”, verify your `.env.local` values and restart the dev server.
