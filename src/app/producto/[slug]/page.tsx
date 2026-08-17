import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { ProductDetail } from "@/components/store/ProductDetail";

interface ProductJson {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  wholesalePrice: number;
  image: string;
  images?: (string | { image: string })[];
  cosmeticCategory: string;
  badge?: string;
  rating: number;
  crueltyFree: boolean;
}

function productosDir() {
  return path.join(process.cwd(), "src/data/productos");
}

function readProduct(slug: string): ProductJson | null {
  const dir = productosDir();
  const file = path.join(dir, slug + ".json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ProductJson;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  const dir = productosDir();
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  const slugs = files.map((f) => path.basename(f, ".json"));
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "placeholder" }];
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const p = readProduct(slug);
    if (!p) return {};
    return {
      title: `${p.name} | Dana Talía`,
      description: p.description,
      openGraph: {
        title: `${p.name} | Dana Talía`,
        description: p.description,
        type: "website",
        locale: "es_AR",
        images: p.image ? [{ url: p.image }] : [],
      },
    };
  });
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = readProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}