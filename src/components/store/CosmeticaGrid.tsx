"use client";

import { useState } from "react";
import { useStore, COSMETIC_PRODUCTS, type CosmeticCategory } from "@/lib/store";
import Image from "next/image";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { EditLink } from "@/components/EditLink";

interface Categoria {
  key: CosmeticCategory;
  label: string;
  image: string;
}

// Cada categoría es un archivo en src/data/categorias/*.json

interface JsonContext {
  keys: () => string[];
  (id: string): unknown;
}

// @ts-expect-error - require.context es una API de webpack disponible en el bundle de Next.js
const categoriasContext: JsonContext = require.context(
  "../../data/categorias",
  false,
  /\.json$/
);
const CATEGORY_ORDER: Record<string, number> = {
  cremas: 1,
  perfumes: 2,
  "ropa-interior": 3,
};
const categorias: Categoria[] = (categoriasContext.keys() as string[])
  .map((k) => categoriasContext(k) as Categoria)
  .sort((a, b) => (CATEGORY_ORDER[a.key] ?? 99) - (CATEGORY_ORDER[b.key] ?? 99));

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(rating) ? "fill-dorado text-dorado" : "text-gray-300"}
        />
      ))}
      <span className="text-xs text-piedra/40 ml-1">{rating}</span>
    </div>
  );
}

export function CosmeticaGrid() {
  const [activeTab, setActiveTab] = useState<CosmeticCategory>("todos");
  const { state, dispatch, getPrice } = useStore();

  const filtered =
    activeTab === "todos"
      ? COSMETIC_PRODUCTS
      : COSMETIC_PRODUCTS.filter((p) => p.cosmeticCategory === activeTab);

  const handleAdd = (product: typeof COSMETIC_PRODUCTS[0]) => {
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
  };

  const openQuickView = (product: typeof COSMETIC_PRODUCTS[0]) => {
    dispatch({
      type: "SET_QUICK_VIEW",
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        wholesalePrice: product.wholesalePrice,
        image: product.image,
        category: product.cosmeticCategory,
        badge: product.badge,
        rating: product.rating,
        source: "cosmetica",
      },
    });
  };

  return (
    <section id="cosmetica" className="section-padding bg-white">
      <div className="container-site mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-terracota mb-3 font-semibold">
            Nuestra Estrella
          </p>
          <h2 className="heading-serif text-3xl md:text-5xl text-piedra mb-4">
            Cosmética Dana Talía
          </h2>
          <p className="text-piedra/50 max-w-2xl mx-auto">
            Fórmulas botánicas con ingredientes naturales. Cruelty free, eficaces y diseñados
            para realzar tu belleza natural.
          </p>
        </div>

        {/* Categorías con imagen */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {categorias.map((cat) => {
            const active = activeTab === cat.key;
            return (
              <div key={cat.key} className="relative w-[calc(50%-8px)] md:w-[calc(25%-18px)]">
                <button
                  onClick={() => setActiveTab(active ? "todos" : cat.key)}
                  className={`group relative aspect-square rounded-3xl overflow-hidden w-full transition-all duration-300 ${
                    active
                      ? "ring-4 ring-terracota shadow-xl shadow-terracota/20"
                      : "hover:shadow-lg"
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-piedra/80 via-piedra/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <p className="heading-serif text-lg md:text-xl text-white">{cat.label}</p>
                  </div>
                </button>
                <EditLink
                  href={`/admin/#/collections/categorias/entries/${cat.key}`}
                  className="absolute top-3 right-3"
                />
              </div>
            );
          })}
        </div>

        {/* Filtro activo */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab("todos")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "todos"
                ? "bg-terracota text-white shadow-lg shadow-terracota/20"
                : "bg-cream-dark text-piedra/60 hover:bg-nude hover:text-piedra"
            }`}
          >
            Ver todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === cat.key
                  ? "bg-terracota text-white shadow-lg shadow-terracota/20"
                  : "bg-cream-dark text-piedra/60 hover:bg-nude hover:text-piedra"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="card-product">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.badge && (
                    <span className="badge-terracota text-[10px]">{product.badge}</span>
                  )}
                  {product.crueltyFree && (
                    <span className="badge-green text-[10px]">Cruelty Free</span>
                  )}
                </div>
                {/* Quick view */}
                <button
                  onClick={() => openQuickView(product)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-terracota hover:text-white"
                >
                  <Eye size={16} />
                </button>
                <EditLink
                  href={`/admin/#/collections/productos/entries/${product.slug}`}
                  className="absolute bottom-3 right-3"
                />
              </div>

              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-terracota/60 mb-1">
                  {product.cosmeticCategory}
                </p>
                <h3 className="font-semibold text-sm text-piedra mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <StarRating rating={product.rating} />
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="heading-serif text-lg text-terracota">
                      {getPrice(product)}
                    </p>
                    {state.mode === "mayorista" && (
                      <p className="text-[10px] text-piedra/40 line-through">
                        {getPrice({ price: product.price })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center hover:bg-terracota hover:text-white transition-all duration-300"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}