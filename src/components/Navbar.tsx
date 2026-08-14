"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const NAV_LINKS = [
  { href: "/#cosmetica", label: "Cosmética" },
  { href: "/#mayorista", label: "Mayorista" },
  { href: "/#contacto", label: "Contacto" },
];

function PriceToggleComponent() {
  const { state, dispatch } = useStore();
  return (
    <div className="price-toggle">
      <button
        onClick={() => dispatch({ type: "SET_MODE", payload: "minorista" })}
        className={state.mode === "minorista" ? "price-toggle-active" : "price-toggle-inactive"}
      >
        Minorista
      </button>
      <button
        onClick={() => dispatch({ type: "SET_MODE", payload: "mayorista" })}
        className={state.mode === "mayorista" ? "price-toggle-active" : "price-toggle-inactive"}
      >
        Mayorista
      </button>
    </div>
  );
}

export function Navbar() {
  const { dispatch, cartCount } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-30">
      <div className="container-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-terracota rounded-xl flex items-center justify-center">
              <span className="heading-serif text-white text-lg">DT</span>
            </div>
            <div className="hidden sm:block">
              <p className="heading-serif text-lg text-piedra leading-none">Dana Talía</p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-piedra/40">Cosmética Natural</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-piedra/60 hover:text-terracota transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <PriceToggleComponent />
            </div>
            <LogoutButton />
            <button
              onClick={() => dispatch({ type: "SET_SEARCH_OPEN", payload: true })}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream transition-colors"
            >
              <Search size={18} className="text-piedra/60" />
            </button>
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream transition-colors"
            >
              <ShoppingBag size={18} className="text-piedra/60" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terracota text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-nude/30 pt-4">
            <div className="md:hidden mb-4 flex justify-center">
              <PriceToggleComponent />
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-piedra/60 hover:bg-cream hover:text-terracota transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
