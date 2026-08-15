"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import Image from "next/image";
import { X, ShoppingCart, Star } from "lucide-react";

export function QuickViewModal() {
  const { state, dispatch, getPrice } = useStore();
  const product = state.quickViewProduct;
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const gallery = (product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]).filter(Boolean);
  const currentImage = gallery[Math.min(activeImage, gallery.length - 1)] ?? product.image;

  const handleAdd = () => {
    const price = state.mode === "mayorista" ? product.wholesalePrice : product.price;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price,
        quantity: 1,
        image: product.image,
      },
    });
    dispatch({ type: "SET_QUICK_VIEW", payload: null });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={() => dispatch({ type: "SET_QUICK_VIEW", payload: null })}
      >
        <div
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <Image
                src={currentImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-64 md:h-[380px] object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
              />
              <button
                onClick={() => dispatch({ type: "SET_QUICK_VIEW", payload: null })}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
              >
                <X size={16} />
              </button>
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                        i === activeImage
                          ? "ring-2 ring-terracota"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-widest text-terracota/60 mb-2">
                {product.source === "cosmetica" ? "Cosmética" : product.category}
              </p>
              <h3 className="heading-serif text-2xl text-piedra mb-3">
                {product.name}
              </h3>

              {product.rating && (
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i <= Math.round(product.rating!)
                          ? "fill-dorado text-dorado"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="text-xs text-piedra/40 ml-1">{product.rating}</span>
                </div>
              )}

              <div className="mb-4">
                <p className="heading-serif text-3xl text-terracota">
                  {getPrice(product)}
                </p>
                {state.mode === "mayorista" && (
                  <p className="text-xs text-piedra/40 line-through">
                    Minorista: {getPrice({ price: product.price })}
                  </p>
                )}
              </div>

              {product.source === "cosmetica" && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.badge && (
                    <span className="badge-terracota text-[10px]">{product.badge}</span>
                  )}
                  <span className="badge-green text-[10px]">Cruelty Free</span>
                </div>
              )}

              <button onClick={handleAdd} className="btn-primary w-full">
                <ShoppingCart size={16} className="mr-2" />
                Agregar al Carrito
              </button>

              <a
                href={`https://wa.me/5493482312433?text=${encodeURIComponent(
                  `Hola! Me interesa el producto "${product.name}". ¿Podrían darme más información?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full mt-3"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
