import { NextRequest, NextResponse } from "next/server";
import {
  getAdminBanners,
  createBanner,
} from "@/lib/queries";

export async function GET() {
  try {
    const banners = await getAdminBanners();
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image_url, link, sort_order, active } = body;

    if (!title || !image_url) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (title, image_url)" },
        { status: 400 }
      );
    }

    const banner = await createBanner({
      title,
      subtitle: subtitle || "",
      image_url,
      link: link || "/",
      sort_order: sort_order || 0,
      active: active !== false,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear banner" },
      { status: 500 }
    );
  }
}
