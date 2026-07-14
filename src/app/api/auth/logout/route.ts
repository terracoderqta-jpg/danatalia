import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  // Sign out from Supabase
  await supabase.auth.signOut();

  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.delete("admin-session");

  return response;
}
