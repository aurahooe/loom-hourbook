# Loom

A small hourbook. Every hour a dispatch lands on the wall. People sign in with a magic link, write slips, and choose whether those slips stay private or hang in public.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set Supabase Auth redirect to `/auth/callback`.
Deploy on Vercel with the two NEXT_PUBLIC_SUPABASE_* env vars.
