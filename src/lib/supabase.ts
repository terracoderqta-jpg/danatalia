import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create client if credentials are available
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client && supabaseUrl && supabaseAnonKey) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  if (!_client) {
    // Return a dummy client that won't crash during build
    _client = createClient("https://placeholder.supabase.co", "placeholder");
  }
  return _client;
}

// Alias for backward compatibility
export const supabase = getSupabaseClient();

// Server-side client (for server components / API routes)
let _serverClient: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (!_serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";
    _serverClient = createClient(url, key);
  }
  return _serverClient;
}
