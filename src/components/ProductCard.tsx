import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[0];

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-nude mb-4">
        {mainImage ? (
          <img
            src={mainImage.image_url}
            alt={mainImage.alt_text || product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-nude to-blush flex items-center justify-center">
            <span className="heading-serif text-6xl text-foreground/10">DT</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-rose/0 group-hover:bg-rose/5 transition-all duration-500" />

        {/* Quick view label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs tracking-[0.15em] uppercase">
            Ver Detalle
          </span>
        </div>

        {product.featured && (
          <div className="absolute top-3 left-3 bg-rose text-white px-3 py-1 text-[10px] tracking-[0.15em] uppercase">
            Destacado
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/50 mb-1">
          {product.category?.name || "Lencería"}
        </p>
        <h3 className="heading-serif text-lg mb-1 group-hover:text-rose transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-foreground/60">
          {product.price > 0 ? formatPrice(product.price) : "Consultar precio"}
        </p>
      </div>
    </Link>
  );
}
