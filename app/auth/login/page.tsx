"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, LogIn, Mail, UserPlus } from "lucide-react";
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
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isRegister ? "Create an account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">Use your email and password to access the blog dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-8">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="input pl-10"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative mt-2">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="input pl-10"
            />
          </div>
        </label>

        {message ? <p className="text-sm text-red-600">{message}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            "Working..."
          ) : isRegister ? (
            <>
              <UserPlus className="h-4 w-4" />
              Create account
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegister((current) => !current);
            setMessage(null);
          }}
          className="block w-full text-sm text-slate-600 underline-offset-2 transition hover:text-slate-900"
        >
          {isRegister ? "Already have an account? Sign in" : "Create a new account"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12 text-sm text-slate-600">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
