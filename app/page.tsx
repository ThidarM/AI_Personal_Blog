import Link from "next/link";
import { ArrowRight, Blocks, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI Content Generation",
    description:
      "Draft, refine, and polish posts with AI-assisted writing built directly into the publishing flow.",
    icon: Sparkles,
  },
  {
    title: "Secure Authentication",
    description:
      "Passwordless sign-in backed by Supabase Auth, so only you can manage and publish your stories.",
    icon: ShieldCheck,
  },
  {
    title: "Modern Next.js Architecture",
    description:
      "Built with the App Router, React 19, and Tailwind CSS for a fast, maintainable, portfolio-ready codebase.",
    icon: Blocks,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-4 sm:gap-24 sm:py-8">
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 px-6 py-16 text-center shadow-lg sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            AI Personal Blog
          </p>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Write better stories with a blog that thinks ahead
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-8 text-indigo-100 sm:text-lg">
            Build your personal blog with AI-powered content creation, Supabase authentication, and modern Next.js
            infrastructure — all in one clean, fast workspace.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/blog"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-50 sm:w-auto"
            >
              Browse blog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              Sign in / Register
            </Link>
          </div>

          <p className="mt-8 text-sm text-indigo-200">
            Already a member?{" "}
            <Link
              href="/dashboard"
              className="font-medium text-white underline underline-offset-4 transition hover:text-indigo-100"
            >
              Go to your dashboard
            </Link>
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group card p-8 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <feature.icon className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-lg font-semibold tracking-tight text-slate-900">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
