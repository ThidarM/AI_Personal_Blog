# Interview Notes — AI Personal Blog Product Feedback

Interviewer: Thidar Moe
Date: August 3, 2026
Product: AI Personal Blog
Website: https://<my-vercel-url>

---

## Interview 1: Casual Blog User

**Q: Does this app appeal to you?**

A: Yeah, it does. It feels clean and modern, and the page loaded really fast on my phone. I mostly just read tech blogs, so a simple site like this is exactly the kind of thing I'd use. Nothing overwhelming, which I like.

**Q: What specifically appealed to you?**

A: The homepage looks nice — the big heading and the buttons are easy to spot. I liked that I could browse the posts right away without signing up first. The blog cards were neat and easy to scan, so I could quickly tell if an article was worth reading.

**Q: Anything that put you off?**

A: Finding older posts was a pain. There's no search bar and no categories, so I had to keep scrolling to find anything. Also, the homepage says "AI-powered" but doesn't really explain what that means for me as a reader, so I wasn't sure what made it different from a normal blog.

**Q: Was the writing experience simple enough?**

A: Pretty simple once I signed in. Creating a post was straightforward — title, content, publish. But the editor is quite basic; I couldn't format things like headings or bold text easily, and adding an image took a bit of figuring out.

**Q: Did AI-assisted writing help?**

A: It helped me get started, honestly. I typed a rough topic and it gave me a draft with headings, which saved me staring at a blank page. I did have to edit it quite a bit to sound like me, but as a starting point it was useful.

**Q: What would you improve?**

A: A search bar and categories would be the biggest thing for me. Better spacing on mobile too — a few sections felt a bit cramped. And a confirmation message after publishing would be nice, because I wasn't sure if my post actually went live.

---

## Interview 2: Junior Web Developer

**Q: Does this app appeal to you?**

A: Yes, especially as a side project. It's a solid, modern stack and everything works end to end, which is impressive for a personal blog. I'd use it as a reference for how to structure a Next.js app.

**Q: What impressed you technically?**

A: The Next.js App Router setup with TypeScript and Tailwind is clean. Supabase auth with row-level security is wired up properly, and the whole thing runs fast after deploying to Vercel. The AI integration with Gemini for drafting posts is a nice touch too.

**Q: Any UI or UX issues?**

A: A couple. The main call-to-action on the homepage could be more prominent — I'd make the "Sign in / Register" button stand out more. On mobile, the spacing between the hero and the feature cards felt a bit tight, and cards can be uneven when titles are long.

**Q: How is the authentication experience?**

A: Smooth overall. Signing up and logging in worked without issues, and the protected routes behave correctly. My only note is that success and error messages could be clearer — a couple of times I wasn't sure if an action had actually completed.

**Q: What features are missing?**

A: Search and category filters are the obvious ones. The dashboard also lacks analytics — I'd like to see views or post counts. A rich text editor instead of a plain textarea would make writing a lot better, and comments would be a natural next step for engagement.

**Q: What would you improve?**

A: Search and category filtering first, then dashboard analytics. I'd also polish the mobile layout, add a clear confirmation after publishing a post, and maybe add loading states so it's obvious when things are saving.

---

# Summary of Findings

| Question | Verdict |
|----------|---------|
| Overall usability | Clean, fast, and approachable, but limited content discovery |
| Navigation | Simple and intuitive, but no search or category filters |
| AI writing | Helpful for drafting and structure, needs minor editing |
| Dashboard | Functional for managing posts; analytics missing |
| Mobile responsiveness | Works well overall; spacing needs polish |

# Common Improvements

1. Improve homepage CTA visibility.
2. Add search and category filters.
3. Improve dashboard analytics.
4. Better mobile spacing.
5. Add confirmation after publishing.
