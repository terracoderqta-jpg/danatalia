import { ProductGrid } from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo | Dana Talía Lencería & Bikinis",
  description:
    "Explorá nuestra colección de lencería fina, bikinis y enterizas de diseño propio.",
};

interface CatalogPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ active: true }),
  ]);

  const activeCategory = params.cat
    ? categories.find((c) => c.slug === params.cat)?.id || "all"
    : "all";

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
            Colección
          </p>
          <h1 className="heading-serif text-4xl md:text-5xl mb-4">Catálogo</h1>
          <p className="text-foreground/60 max-w-lg mx-auto">
            Descubrí cada pieza de nuestra colección. Diseños exclusivos pensados
            para realzar tu belleza.
          </p>
        </div>

        {/* Product Grid with filters */}
        <ProductGrid
          products={products}
          categories={categories}
          initialCategory={activeCategory}
        />
      </div>
    </div>
  );
}
