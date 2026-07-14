import { NextRequest, NextResponse } from "next/server";
import {
  getAdminProducts,
  createProduct,
} from "@/lib/queries";

export async function GET() {
  try {
    const products = await getAdminProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, category_id, price, sizes, colors, active, featured } = body;

    if (!name || !category_id || !price) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name,
      slug: slug || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: description || "",
      category_id,
      price: Number(price),
      sizes: sizes || ["S", "M", "L", "XL"],
      colors: colors || [],
      active: active !== false,
      featured: featured || false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
