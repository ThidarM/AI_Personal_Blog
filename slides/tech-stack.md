---
marp: true
theme: default
paginate: true
transition: fade
---

# Tech Stack

A modern AI-powered personal blogging platform.

**Project Name:** AI Personal Blog

**Description:** A modern AI-powered personal blogging platform built with Next.js, TypeScript, Tailwind CSS, Supabase, and Gemini AI.

---

# Stack

The actual technologies used across the project.

- **Next.js (App Router)** — `next` 16.2.12 powers pages, layouts, and API routes (`app/`).
- **React** — 19.0.0 drives interactive client components and hooks.
- **TypeScript** — strict typing across pages, components, hooks, and the Supabase library layer.
- **Tailwind CSS** — utility-first styling with the typography plugin for the reading experience.
- **Supabase Authentication** — email/password sign-in and session management (`lib/supabase/auth.ts`).
- **Supabase Database** — PostgreSQL `posts` table with RLS and a `profiles` join for author names.
- **Gemini AI** — assists with article generation, grammar, summaries, and tags via the project's AI tooling.
- **Vercel Deployment** — production hosting for the blog (deployed from the `main` branch).
- **Git & GitHub** — versioned and published at github.com/ThidarM/AI_Personal_Blog.

---

# Agents

Defined in `.claude/agents/`.

**blog-assistant**
Purpose: Generates blog articles, improves grammar, summarizes content, and creates tags for posts.
Trigger: @blog-assistant

---

# Skills

Defined in `.claude/skills/`.

**blog-writing**
Purpose: Generates long-form technical blog articles and polishes content following the project writing guidelines.
Trigger: /blog-writing

---

# Methodology

The development workflow used in this project.

- **Build features incrementally** — add one capability at a time (auth, posts, covers, AI tooling).
- **Test locally** — run `npm run dev` and verify pages before shipping.
- **Commit meaningful changes** — history shows focused commits (schema, screenshots, slides, branding).
- **Push to GitHub** — keep the `main` branch in sync with the remote.
- **Deploy with Vercel** — every push to `main` triggers a production build.
- **Review using AI Agent** — the `blog-assistant` agent supports editorial and UX reviews.
- **Improve documentation continuously** — README, slides, and agent/skill docs grow with the codebase.

---

# Trigger + Commands

**Skill**
Trigger: /blog-writing
Prompt: Use the blog-writing skill to generate a technical article about React Server Components.

**Agent**
Trigger: @blog-assistant
Prompt: Use the blog-assistant agent to review my homepage UI and suggest improvements.

**Development**
npm install
npm run dev
npm run build
git add .
git commit
git push

**Deployment**
Automatic deployment through Vercel after pushing to the main branch.
