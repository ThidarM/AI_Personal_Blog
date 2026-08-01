"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";

export default function useProtectedRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      const redirectTarget = currentPath && currentPath !== "/auth/login" ? `?redirect=${encodeURIComponent(currentPath)}` : "";
      router.replace(`/auth/login${redirectTarget}`);
    }
  }, [loading, user, router]);

  return { user, loading } as const;
}
