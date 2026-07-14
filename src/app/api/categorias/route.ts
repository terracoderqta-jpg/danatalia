import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCategories,
  createCategory,
} from "@/lib/queries";

export async function GET() {
  try {
    const categories = await getAdminCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, sort_order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (name, slug)" },
        { status: 400 }
      );
    }

    const category = await createCategory({
      name,
      slug,
      description: description || "",
      image: image || "",
      sort_order: sort_order || 0,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    );
  }
}
