import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Use Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Create a session token (in production, use JWT properly)
    const token = Buffer.from(
      JSON.stringify({
        sub: data.user.id,
        email: data.user.email,
        role: "admin",
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
    ).toString("base64");

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
