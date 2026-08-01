import Link from "next/link";

export default function HomePage() {
  return (
    <main className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">AI Personal Blog</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Build your personal blog with AI-powered content creation, Supabase authentication, and modern Next.js infrastructure.
      </p>

      <div className="mt-10 space-y-4 text-sm text-slate-700 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
        <Link href="/blog" className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-5 py-3 font-medium transition hover:bg-slate-100">
          Browse blog
        </Link>
        <Link href="/auth/login" className="inline-flex rounded-full bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800">
          Sign in / Register
        </Link>
        <Link href="/dashboard" className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 font-medium transition hover:bg-slate-100">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
