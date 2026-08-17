"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Star, MessageCircle } from "lucide-react";
import { useStore, type CosmeticProduct } from "@/lib/store";

export function ProductDetail({ product }: { product: CosmeticProduct }) {
  const { state, dispatch, getPrice } = useStore();
  const gallery = [
    product.image,
    ...(product.images || []).map((i) => (typeof i === "string" ? i : i.image)),
  ].filter(Boolean);
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)] || product.image;

  const handleAdd = () => {
    const price = state.mode === "mayorista" ? product.wholesalePrice : product.price;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id || product.slug,
        name: product.name,
        price,
        quantity: 1,
        image: product.image,
      },
    });
    dispatch({ type: "SET_CART_OPEN", payload: true });
  };

  return (
    <section className="section-padding">
      <div className="container-site mx-auto">
        <Link
          href="/#cosmetica"
          className="inline-flex items-center gap-2 text-piedra/60 hover:text-terracota transition-colors text-sm mb-8"
        >
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Galería */}
          <div>
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-cream-dark">
              {current ? (
                <Image
                  src={current}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-nude to-blush" />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                      i === active
                        ? "border-terracota ring-2 ring-terracota/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-terracota mb-2 font-semibold">
              {product.cosmeticCategory}
            </p>
            <h1 className="heading-serif text-3xl md:text-4xl text-piedra mb-4">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i <= Math.round(product.rating!)
                        ? "fill-dorado text-dorado"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-piedra/40 ml-1">{product.rating}</span>
              </div>
            )}

            <div className="mb-6">
              <p className="heading-serif text-3xl text-terracota">{getPrice(product)}</p>
              {state.mode === "mayorista" && product.wholesalePrice && (
                <p className="text-sm text-piedra/40 line-through mt-1">
                  Minorista: {getPrice({ price: product.price })}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.badge && <span className="badge-terracota">{product.badge}</span>}
              {product.crueltyFree && <span className="badge-green">Cruelty Free</span>}
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-piedra/50 font-semibold mb-2">
                  Descripción
                </h3>
                <p className="text-piedra/70 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAdd} className="btn-primary w-full sm:w-auto flex-1">
                <ShoppingCart size={16} className="mr-2" /> Agregar al Carrito
              </button>
              <a
                href={`https://wa.me/5493482312433?text=${encodeURIComponent(
                  `Hola! Me interesa el producto "${product.name}". ¿Podrían darme más información?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto flex-1"
              >
                <MessageCircle size={16} className="mr-2" /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}