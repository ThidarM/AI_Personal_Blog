# AI Personal Blog

This project is a Next.js (App Router) personal blog scaffold with Supabase authentication, Tailwind CSS, and TypeScript.

Getting started

1. Copy environment variables:

```bash
cp .env.example .env
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

2. Install dependencies and run locally:

```bash
npm install
npm run dev
```

Available scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server (after build)

Notes

- The Supabase client uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public keys) — ensure your Supabase project's policies secure private data.
