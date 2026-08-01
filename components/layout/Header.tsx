"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import { signOut } from "../../lib/supabase/auth";

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const profileName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Member";
  const profileEmail = user?.email ?? "Unknown email";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          AI Personal Blog
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
          <Link href="/blog" className="transition hover:text-slate-900">
            Blog
          </Link>
          <Link href="/dashboard" className="transition hover:text-slate-900">
            Dashboard
          </Link>

          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                  {profileName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-900">{profileName}</span>
                  <span className="text-xs text-slate-500 truncate max-w-[10rem]">{profileEmail}</span>
                </span>
              </button>

              {dropdownOpen ? (
                <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:w-72">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 truncate">{profileEmail}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-600">
                      <p>{profileName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
