import { NextRequest, NextResponse } from "next/server";
import { updateBanner, deleteBanner } from "@/lib/queries";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const banner = await updateBanner(id, body);
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar banner" },
      { status: 500 }
    );
  }
}
