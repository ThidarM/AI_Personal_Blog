---
marp: true
theme: default
paginate: true
size: 16:9
---

<!-- _paginate: false -->

# AI Personal Blog

**Modern AI-powered blogging platform**

A personal blog for writing, publishing, and managing posts, built with Next.js, React, TypeScript, Tailwind CSS, Supabase, Gemini AI, and Vercel.

---

# Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend / API:** Next.js API routes for posts and cover uploads
- **Database:** Supabase PostgreSQL with Row-Level Security
- **Authentication:** Supabase Auth (email/password)
- **AI:** Gemini AI for content generation and editing
- **Deployment:** Vercel
- **Testing:** Not yet configured

---

# Agents

**blog-assistant**

- **Purpose:** AI assistant for all blog content and editorial tasks
- **Responsibilities:** Generate articles, improve grammar, summarize, create tags
- **Example:** "Generate a blog article about AI writing tools."

---

# Skills

**blog-writing**

- **Purpose:** Standardized AI workflow for blog content
- **Generates:** Long-form articles, grammar-polished text, summaries, tag lists
- **Example:** "Write a post titled 'How AI Improves Personal Writing'."

---

# Methodology

- Plan the feature
- Implement incrementally
- Use AI for content generation and review
- Test locally
- Deploy to Vercel
- Update documentation

---

# Trigger + Commands

**blog-assistant:** @blog-assistant
**blog-writing:** /blog-writing

**Development**

- npm install
- npm run dev
- npm run build
- npm run lint
- git add .
- git commit
- git push
