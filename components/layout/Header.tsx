"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";
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
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-900">
          <Image src="/feather.svg" alt="AI Personal Blog" width={32} height={32} priority className="h-8 w-8" />
          AI Personal Blog
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium text-slate-600 sm:gap-2">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <BookOpen className="h-4 w-4" />
            Blog
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {!loading && user ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                  {profileName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-900">{profileName}</span>
                  <span className="max-w-[10rem] truncate text-xs text-slate-500">{profileEmail}</span>
                </span>
              </button>

              {dropdownOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:w-72">
                  <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">{profileEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary ml-1">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
