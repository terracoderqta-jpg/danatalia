import Link from "next/link";
import { Category } from "@/lib/types";

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
            Explorá
          </p>
          <h2 className="heading-serif text-3xl md:text-4xl">
            Nuestras Colecciones
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?cat=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-nude"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-nude via-blush to-rose/30 flex items-center justify-center">
                  <span className="heading-serif text-5xl md:text-6xl text-foreground/5">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/50 to-transparent">
                <h3 className="heading-serif text-lg md:text-xl text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/60 text-xs tracking-wider">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
