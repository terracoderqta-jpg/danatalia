import { NextRequest, NextResponse } from "next/server";
import { createProductImage, deleteProductImage } from "@/lib/queries";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const image = await createProductImage({
      product_id: id,
      image_url: body.image_url,
      alt_text: body.alt_text || "",
      sort_order: body.sort_order || 0,
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al agregar imagen" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Falta imageId" },
        { status: 400 }
      );
    }

    await deleteProductImage(imageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar imagen" },
      { status: 500 }
    );
  }
}
