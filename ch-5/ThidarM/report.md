# ch-5 Personal Project — Report

## Project

- **GitHub username:** @ThidarM
- **Repo URL:** https://github.com/ThidarM/AI_Personal_Blog
- **Live / download URL:** Not available — no production Vercel URL is recorded in the repository.

## AI Tools Used

- OpenCode (DeepSeek V4 Flash) — project development and code generation.
- Claude Code — repository structure, with the `blog-writing` skill and `blog-assistant` agent under `.claude/`.
- Gemini AI — AI-assisted blog content generation (documented in `slides/intro.md`).

## Skill (required)

- **Path:** `.claude/skills/blog-writing/SKILL.md`
- **What:** Standardizes how the assistant generates, polishes, or summarizes blog content. Used whenever the assistant must produce long-form articles (title, headings, structure, voice), improve grammar and readability while preserving meaning, summarize content into concise takeaways, or generate relevant tags — following the project writing guidelines.

## Subagent (required)

- **Path:** `.claude/agents/blog-assistant.md`
- **What:** The single AI persona (`BlogAssistant`) for all content and editorial tasks. It supports four workflows — `generateArticle()` for complete blog posts from a title and direction, `improveGrammar()` for clarity and tone, `summarize()` for concise summaries, and `generateTags()` for relevant tags.

## Trigger / Command

- "Write a blog article titled 'How AI Improves Personal Writing'." → blog-writing skill
- "Generate a blog article about AI writing tools." → blog-assistant agent

## Tech-Stack Slides

- **Slides path:** `slides/tech-stack.md`

## User Feedback

- **Feedback file:** `feedback/feedback.md`
- **Interview notes:** `feedback/interview.md`

## Issues to Fix in Ch-6

- Add blog search and category filtering.
- Improve the homepage hero section to highlight AI-powered features more clearly.
- Improve mobile responsiveness and spacing.
- Improve authentication success and error messages.
