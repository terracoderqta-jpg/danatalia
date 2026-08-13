"use client";

import { useStore } from "@/lib/store";
import Image from "next/image";

export function HeroBanner() {
  const { dispatch } = useStore();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-cream via-nude/30 to-blush/40">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-terracota/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-dorado/5 rounded-full blur-3xl" />

      <div className="container-site mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span className="badge-green">Cruelty Free</span>
              <span className="badge-outline">Despacho 24/48h</span>
            </div>

            <h1 className="heading-serif text-5xl md:text-6xl lg:text-7xl text-piedra mb-6 leading-tight">
              Belleza Natural,{" "}
              <span className="text-terracota">Fórmulas Botánicas</span>
            </h1>

            <p className="text-lg text-piedra/60 mb-8 max-w-lg leading-relaxed">
              Descubrí nuestra línea de cosméticos con ingredientes naturales.
              Skincare, maquillaje y fragancias diseñados para realzar tu belleza
              sin comprometer el planeta.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#cosmetica"
                className="btn-primary"
              >
                Explorar Cosméticos
              </a>
              <button
                onClick={() => {
                  dispatch({ type: "SET_MODE", payload: "mayorista" });
                  document.getElementById("mayorista")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-dorado"
              >
                Comprar al Por Mayor
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-piedra/10">
              <div className="text-center">
                <p className="heading-serif text-2xl text-terracota">+500</p>
                <p className="text-xs text-piedra/50 uppercase tracking-wider">Clientes</p>
              </div>
              <div className="w-px h-10 bg-piedra/10" />
              <div className="text-center">
                <p className="heading-serif text-2xl text-terracota">+50</p>
                <p className="text-xs text-piedra/50 uppercase tracking-wider">Revendedoras</p>
              </div>
              <div className="w-px h-10 bg-piedra/10" />
              <div className="text-center">
                <p className="heading-serif text-2xl text-terracota">100%</p>
                <p className="text-xs text-piedra/50 uppercase tracking-wider">Cruelty Free</p>
              </div>
            </div>
          </div>

          {/* Hero Image / Card */}
          <div className="relative animate-fade-in-delay">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-terracota/10">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=900&fit=crop"
                alt="Cosméticos Dana Talía"
                width={800}
                height={900}
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-piedra/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white/80 text-sm uppercase tracking-widest mb-2">Nueva Colección</p>
                <h3 className="heading-serif text-3xl text-white mb-3">Bruma Floral Dana</h3>
                <p className="text-white/70 text-sm">Fragancia exclusiva con notas de peonía y jazmín</p>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl z-20 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-terracota/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-piedra">Mayorista</p>
                  <p className="text-xs text-piedra/50">Hasta 42% OFF</p>
                </div>
              </div>
            </div>

            {/* Second floating badge */}
            <div className="absolute -top-4 -right-4 bg-dorado text-white rounded-2xl px-4 py-2 shadow-lg z-20">
              <p className="text-xs font-bold uppercase tracking-wider">Envío 24/48h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
