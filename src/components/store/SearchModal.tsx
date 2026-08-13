"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import Image from "next/image";
import { Search, X } from "lucide-react";

export function SearchModal() {
  const { state, dispatch, allProducts, getPrice } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !state.cartOpen && !state.quickViewProduct) {
        e.preventDefault();
        dispatch({ type: "SET_SEARCH_OPEN", payload: true });
      }
      if (e.key === "Escape") {
        dispatch({ type: "SET_SEARCH_OPEN", payload: false });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.cartOpen, state.quickViewProduct, dispatch]);

  if (!state.searchOpen) return null;

  const results =
    query.length > 1
      ? allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24 px-4"
      onClick={() => dispatch({ type: "SET_SEARCH_OPEN", payload: false })}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-nude/30">
          <Search size={18} className="text-piedra/30" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="flex-1 text-sm text-piedra bg-transparent focus:outline-none placeholder:text-piedra/30"
          />
          <button
            onClick={() => dispatch({ type: "SET_SEARCH_OPEN", payload: false })}
            className="text-piedra/30 hover:text-piedra"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length > 1 && results.length === 0 && (
            <div className="py-12 text-center text-piedra/40 text-sm">
              No se encontraron productos
            </div>
          )}
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                dispatch({ type: "SET_SEARCH_OPEN", payload: false });
                dispatch({ type: "SET_QUICK_VIEW", payload: product });
              }}
              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-cream transition-colors text-left"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-piedra truncate">
                  {product.name}
                </p>
                <p className="text-xs text-piedra/40">{product.category}</p>
              </div>
              <p className="text-sm font-semibold text-terracota">
                {getPrice(product)}
              </p>
            </button>
          ))}
        </div>

        {query.length <= 1 && (
          <div className="py-8 text-center text-piedra/30 text-xs">
            Escribí al menos 2 caracteres para buscar
          </div>
        )}
      </div>
    </div>
  );
}
