"use client";

import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
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
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <User className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your session and sign out of the blog.</p>
      </div>

      <section className="card mt-8 space-y-4 p-8">
        {loading ? (
          <p className="text-sm text-slate-500">Loading session…</p>
        ) : email ? (
          <>
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="mt-1 text-lg font-medium text-slate-900">{email}</p>
            </div>
            <button type="button" onClick={handleSignOut} className="btn-secondary w-full">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-500">No active session found. Please sign in first.</p>
        )}

        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </section>
    </div>
  );
}
