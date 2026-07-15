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

    if (!name || !category_id || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const baseSlug = slug || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const uniqueSlug = `${baseSlug}-${Math.floor(Date.now() / 1000)}`;
    
    const product = await createProduct({
      name,
      slug: uniqueSlug,
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
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Error al crear producto", details: error },
      { status: 500 }
    );
  }
}
