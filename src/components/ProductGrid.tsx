"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product, Category } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export function ProductGrid({
  products,
  categories,
  initialCategory,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || "all"
  );

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 border ${
            activeCategory === "all"
              ? "bg-foreground text-white border-foreground"
              : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40"
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 border ${
              activeCategory === cat.id
                ? "bg-foreground text-white border-foreground"
                : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="heading-serif text-2xl text-foreground/30">
            No hay productos en esta categoría
          </p>
        </div>
      )}
    </div>
  );
}
