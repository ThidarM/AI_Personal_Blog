---
marp: true
theme: default
paginate: true
transition: fade
---

# Tech Stack

AI Personal Blog — a personal blogging platform for writing, publishing, and managing posts with AI-assisted content.

# Stack

Frontend — Next.js (App Router), React 19, TypeScript, Tailwind CSS
Backend — Next.js API routes for post listing and cover image upload
Authentication — Supabase Auth with email/password
Database — Supabase PostgreSQL with Row-Level Security
AI — Claude agent and skill for AI-assisted content generation
Styling — Tailwind CSS with the typography plugin
Deployment — Vercel
Language — TypeScript

# Agents

blog-assistant — Generates blog articles, improves grammar, summarizes content, and creates tags.

# Skills

blog-writing — Generates long-form blog articles following the project writing guidelines.

# Methodology

- Build features incrementally
- Test locally
- Commit meaningful changes
- Push to GitHub
- Deploy with Vercel
- Review using AI agents

# Trigger + Commands

blog-assistant:
Trigger: @blog-assistant

blog-writing:
Trigger: /blog-writing

Development:
npm install
npm run dev
npm run build

Deployment:
git add .
git commit
git push
Automatic deployment through Vercel after pushing to main.
