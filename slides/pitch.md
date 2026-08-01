---
marp: true
paginate: true
transition: fade
auto-advance: 20
---

# AI Personal Blog

A modern personal blog built with Next.js and Supabase for writing, publishing, and managing articles.

**Your Name**

---

# Target Users & Problems

- **Users:** personal writers, developers, and creators who publish online
- **Problems they face:**
  - No simple way to write and publish in one place
  - Drafts and published posts are often mixed together
  - Cover images and author attribution require extra tooling

---

# Features Implemented

- Email/password sign-up and sign-in with Supabase Auth
- Full blog workflow: create drafts, edit, publish, delete
- Public blog listing and a personal "My Blogs" dashboard
- Cover images with automatic placeholders when none set
- Author names resolved from the `profiles` table
- Responsive, Medium-style article reading experience

*[Insert screenshots: dashboard, editor, blog detail]*

---

# Architecture & Tech Stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- **Tailwind CSS** with the typography plugin
- **Supabase:** Auth, PostgreSQL, Storage, Row-Level Security
- Server API routes for post listing and cover image upload
- **Development tooling:**
  - **MCP** manifest (`.mcp.json`) wires the project to AI tooling
  - **Claude Agent** (`blog-assistant`) defines content workflows
  - **Claude Skill** (`blog-writing`) standardizes writing tasks

---

# Challenges & Future Work

- **Challenges solved:**
  - 500 on post listing: joined `profiles.username` after a missing column
  - Cover images: added via migration and `next/image` remote patterns
  - AI provider migrated from OpenAI to Gemini, then scoped out of v1

- **Future improvements:**
  - Reintroduce AI-assisted article generation (topic to title and draft)
  - Richer author profiles and post metadata

---

# Summary

- A complete, deployable personal blog: auth, publishing, cover images, and a polished reading experience

- **Key achievements:**
  - Auth-protected dashboard and publishing workflow
  - Database-backed posts with cover images and author attribution
  - Clean, responsive UI built entirely on real data

**Thank you!**
