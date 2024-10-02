import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

let supabaseInstance: SupabaseClient | null = null;
let currentToken: string | null = null;

const supabaseClient = (supabaseAccessToken: string): SupabaseClient => {
  if (supabaseInstance && currentToken === supabaseAccessToken) {
    return supabaseInstance;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  });

  currentToken = supabaseAccessToken;
  return supabaseInstance;
};

export default supabaseClient;
