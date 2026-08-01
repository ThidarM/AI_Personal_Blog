"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();
    let mounted = true;

    // initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      // cleanup subscription
      try {
        // supabase v2 provides subscription object
        (listener as any)?.subscription?.unsubscribe?.();
      } catch (_) {
        // ignore
      }
    };
  }, []);

  return { user, loading } as const;
}
