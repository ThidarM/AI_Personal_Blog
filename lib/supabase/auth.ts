import { createSupabaseClient, ensureSupabaseConfig } from "./client";

function getSupabase() {
  ensureSupabaseConfig();
  return createSupabaseClient();
}

export async function signInWithEmail(email: string, password: string) {
  return getSupabase().auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return getSupabase().auth.signUp({ email, password });
}

export async function signOut() {
  return getSupabase().auth.signOut();
}

export async function getUser() {
  return getSupabase().auth.getUser();
}
