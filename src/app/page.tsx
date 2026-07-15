import { HeroSlider } from "@/components/HeroSlider";
import { CategorySection } from "@/components/CategorySection";
import { BrandSection } from "@/components/BrandSection";
import { ProductCard } from "@/components/ProductCard";
import { getBanners, getCategories, getProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [banners, categories, featuredProducts] = await Promise.all([
    getBanners(),
    getCategories(),
    getProducts({ featured: true }),
  ]);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider banners={banners} />

      {/* Categories */}
      <CategorySection categories={categories} />

      {/* Featured Products */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
              Lo Más Nuevo
            </p>
            <h2 className="heading-serif text-3xl md:text-4xl">
              Destacados de la Temporada
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <a href="/catalogo" className="btn-outline">
                Ver Todo el Catálogo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <BrandSection />

      {/* CTA Section */}
      <section className="section-padding bg-[#faf6f6] border-y border-rose/15 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-3">
            Atención Personalizada
          </p>
          <h2 className="heading-serif text-3xl md:text-4xl mb-6 text-foreground">
            ¿Tenés alguna consulta?
          </h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            Escribinos por WhatsApp y te asesoramos sobre talles, disponibilidad
            y envíos a todo el país.
          </p>
          <a
            href="https://wa.me/5493482555555?text=Hola!%20Me%20gustaría%20hacer%20una%20consulta"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Chateá con Nosotros
          </a>
        </div>
      </section>
    </>
  );
}
