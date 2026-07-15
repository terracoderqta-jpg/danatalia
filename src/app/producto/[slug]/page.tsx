import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getCategories } from "@/lib/queries";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import { ImageGallery } from "@/components/ImageGallery";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Producto no encontrado" };
    return {
      title: `${product.name} | Dana Talía`,
      description: product.description || undefined,
    };
  } catch {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    categories = await getCategories();
  } catch {
    // ignore
  }

  const category = categories.find((c) => c.id === product.category_id);
  const whatsappLink = getWhatsAppLink(product.name);

  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === "string"
    ? (() => { try { return JSON.parse(product.sizes); } catch { return []; } })()
    : [];

  const colors = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === "string"
    ? (() => { try { return JSON.parse(product.colors); } catch { return []; } })()
    : [];

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs tracking-wider text-foreground/40 mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/catalogo"
            className="hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link
                href={`/catalogo?cat=${category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <ImageGallery images={images} productName={product.name} />

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-2">
              {category?.name || "Lencería"}
            </p>

            <h1 className="heading-serif text-3xl md:text-4xl mb-4">
              {product.name}
            </h1>

            <p className="text-2xl text-foreground/80 mb-6">
              {product.price > 0 ? formatPrice(product.price) : "Consultar precio"}
            </p>

            {product.description && (
              <div className="border-t border-foreground/10 pt-6 mb-6">
                <p className="text-foreground/70 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/60 mb-3">
                  Talles Disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: string) => (
                    <span
                      key={size}
                      className="px-4 py-2 border border-foreground/20 text-sm hover:border-foreground transition-colors cursor-pointer"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/60 mb-3">
                  Colores
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color: string) => (
                    <span
                      key={color}
                      className="px-4 py-2 border border-foreground/20 text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 mt-auto">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full text-center"
              >
                Consultar por WhatsApp
              </a>
              <p className="text-center text-xs text-foreground/40">
                Te respondemos a la brevedad
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/catalogo" className="btn-outline">
            ← Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
