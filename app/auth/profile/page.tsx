"use client";

import { useEffect, useState } from "react";
import { ensureSupabaseConfig } from "../../../lib/supabase/client";
import { getUser, signOut } from "../../../lib/supabase/auth";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await getUser();
      setLoading(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      setEmail(data.user?.email ?? null);
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/auth/login";
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your session and sign out of the blog.</p>

      <section className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading session…</p>
        ) : email ? (
          <>
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-1 text-lg font-medium text-slate-900">{email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-500">No active session found. Please sign in first.</p>
        )}

        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </section>
    </main>
  );
}
