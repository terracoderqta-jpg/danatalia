import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { image_url, alt_text, sort_order } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "image_url es obligatorio" },
        { status: 400 }
      );
    }

    const db = getSupabaseServer();
    const { data, error } = await db
      .from("product_images")
      .insert({
        product_id: id,
        image_url,
        alt_text: alt_text || "",
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear imagen" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "imageId es obligatorio" },
        { status: 400 }
      );
    }

    const db = getSupabaseServer();
    const { error } = await db
      .from("product_images")
      .delete()
      .eq("id", imageId)
      .eq("product_id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar imagen" },
      { status: 500 }
    );
  }
}
