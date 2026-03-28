# Project 774 — Naija Civic Connect

Nigeria's credibility database — nominating the best people from all 774 local governments.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables, triggers, RLS policies, and storage buckets (including `nominee-photos` and `avatars`).

## Admin Account Setup

Every account created through `/register` starts with `role = 'user'`. There is no automatic admin creation — you must promote the first admin manually via the Supabase SQL Editor.

**Step 1 — Find the user's UUID:**

```sql
select id, full_name, role from profiles where full_name = 'Your Name';
```

**Step 2 — Promote them:**

```sql
update profiles
set role = 'super_admin'  -- or 'admin' or 'moderator'
where id = '<uuid-from-above>';
```

**Step 3 — Further promotions via the app:**

Once you have one `super_admin`, they can promote other users through the Users tab at `/admin?tab=Users`.

### Role permissions

| Role | `/admin` access | Can promote users |
|---|---|---|
| `user` | ❌ redirected to dashboard | — |
| `moderator` | ✓ nominations, videos, flagged posts | ❌ |
| `admin` | ✓ + Users tab (read) | ❌ |
| `super_admin` | ✓ full access | ✓ |
