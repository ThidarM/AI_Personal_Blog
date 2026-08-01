"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "../../../lib/supabase/client";
import { signInWithEmail, signUpWithEmail } from "../../../lib/supabase/auth";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage(null);

    const action = isRegister ? signUpWithEmail : signInWithEmail;
    const { error } = await action(email, password);

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const supabase = createSupabaseClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    setLoading(false);

    if (sessionError) {
      setMessage(sessionError.message);
      return;
    }

    const redirectTarget = searchParams.get("redirect") ?? "/dashboard";
    setMessage("Success! Redirecting...");
    router.push(redirectTarget);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">{isRegister ? "Create an account" : "Sign in"}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use your email and password to access the blog dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        {message ? <p className="text-sm text-red-600">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Working..." : isRegister ? "Create account" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegister((current) => !current);
            setMessage(null);
          }}
          className="text-sm text-slate-600 underline-offset-2 transition hover:text-slate-900"
        >
          {isRegister ? "Already have an account? Sign in" : "Create a new account"}
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-12 text-sm text-slate-600">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
