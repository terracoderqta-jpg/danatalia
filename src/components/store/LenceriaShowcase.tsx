"use client";

import { useStore } from "@/lib/store";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function LenceriaShowcase() {
  const { allProducts, state, dispatch, getPrice } = useStore();
  const lenceria = allProducts.filter((p) => p.source === "lenceria").slice(0, 4);

  if (lenceria.length === 0) return null;

  return (
    <section id="lenceria" className="section-padding bg-cream">
      <div className="container-site mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-terracota/60 mb-3 font-semibold">
            Lencería Boutique
          </p>
          <h2 className="heading-serif text-3xl md:text-5xl text-piedra mb-4">
            Ropa Interior & Lencería
          </h2>
          <p className="text-piedra/50 max-w-2xl mx-auto">
            Diseños exclusivos con el sello Dana Talía. Lencería fina y trajes de baño
            para cada momento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {lenceria.map((product) => (
            <div key={product.id} className="card-product">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="badge-dorado text-[10px]">{product.badge}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-terracota/60 mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-sm text-piedra mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="heading-serif text-lg text-terracota">
                    {getPrice(product)}
                  </p>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "ADD_TO_CART",
                        payload: {
                          id: product.id,
                          name: product.name,
                          price: state.mode === "mayorista" ? product.wholesalePrice : product.price,
                          quantity: 1,
                          image: product.image,
                        },
                      })
                    }
                    className="w-9 h-9 bg-terracota/10 rounded-xl flex items-center justify-center hover:bg-terracota hover:text-white transition-all duration-300"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/catalogo"
            className="btn-outline inline-flex items-center gap-2"
          >
            Ver Todo el Catálogo
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
