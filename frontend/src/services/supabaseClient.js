import { createClient } from "@supabase/supabase-js";

let supabase = null;

export function getSupabaseClient() {
  console.log(" 1 Initializing Supabase client...");
  if (supabase) return supabase;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("Initializing Supabase client...");
  console.log("Supabase URL:", SUPABASE_URL ? "Present" : "Missing");
  console.log("Supabase ANON key:", SUPABASE_KEY ? "Present" : "Missing");
  // Log presence of env vars (mask sensitive values)
  const maskedKey = SUPABASE_KEY
    ? `${SUPABASE_KEY.slice(0, 4)}...${SUPABASE_KEY.slice(-4)}`
    : null;
  console.log(
    "Supabase env:",
    "URL present:",
    !!SUPABASE_URL,
    "ANON key present:",
    !!SUPABASE_KEY,
    "ANON masked:",
    maskedKey,
  );

  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabase;
}
