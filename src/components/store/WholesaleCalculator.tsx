"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, DollarSign, ShoppingBag, Calculator } from "lucide-react";

const CATEGORIES = [
  { label: "Skincare", margin: 2.8 },
  { label: "Maquillaje", margin: 2.5 },
  { label: "Perfumes", margin: 2.2 },
  { label: "Lencería", margin: 2.4 },
  { label: "Mix Mayorista", margin: 2.5 },
];

export function WholesaleCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const category = CATEGORIES[categoryIdx];

  const estimatedSale = Math.round(investment * category.margin);
  const netProfit = estimatedSale - investment;
  const profitPct = Math.round((netProfit / investment) * 100);

  return (
    <section id="mayorista" className="section-padding bg-gradient-to-br from-piedra via-charcoal to-piedra text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-dorado/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-terracota/5 rounded-full blur-3xl" />

      <div className="container-site mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-dorado mb-3 font-semibold">
            Portal Mayorista
          </p>
          <h2 className="heading-serif text-3xl md:text-5xl text-white mb-4">
            Simulá Tu Ganancia
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Calculá cuánto podés ganar revendiendo productos Dana Talía.
            Seleccioná tu inversión y categoría.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Calculator */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-dorado/20 rounded-xl flex items-center justify-center">
                <Calculator size={20} className="text-dorado" />
              </div>
              <h3 className="heading-serif text-xl">Simulador de Inversión</h3>
            </div>

            {/* Investment slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-white/60">Inversión Inicial</label>
                <span className="heading-serif text-2xl text-dorado">
                  {formatPrice(investment)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-dorado"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>$50.000</span>
                <span>$500.000</span>
              </div>
            </div>

            {/* Category selector */}
            <div className="mb-8">
              <label className="text-sm text-white/60 mb-3 block">Categoría</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.label}
                    onClick={() => setCategoryIdx(i)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                      i === categoryIdx
                        ? "bg-dorado text-white shadow-lg"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <ShoppingBag size={20} className="mx-auto text-white/30 mb-2" />
                <p className="text-xs text-white/40 mb-1">Inversión</p>
                <p className="heading-serif text-lg text-white">{formatPrice(investment)}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <DollarSign size={20} className="mx-auto text-white/30 mb-2" />
                <p className="text-xs text-white/40 mb-1">Venta Estimada</p>
                <p className="heading-serif text-lg text-white">{formatPrice(estimatedSale)}</p>
              </div>
              <div className="bg-dorado/20 rounded-2xl p-4 text-center border border-dorado/30">
                <TrendingUp size={20} className="mx-auto text-dorado mb-2" />
                <p className="text-xs text-dorado/70 mb-1">Ganancia Neta</p>
                <p className="heading-serif text-lg text-dorado">{formatPrice(netProfit)}</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/40">
                Retorno estimado:{" "}
                <span className="text-dorado font-semibold">+{profitPct}%</span>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="heading-serif text-2xl md:text-3xl">
              ¿Por qué revender con Dana Talía?
            </h3>

            {[
              {
                icon: "🌿",
                title: "Productos Cruelty Free",
                desc: "Fórmulas botánicas que tus clientas van a amar. Calidad que se vende sola.",
              },
              {
                icon: "💰",
                title: "Margen hasta 42%",
                desc: "Descuentos mayoristas de hasta 42%. Tu ganancia es nuestra prioridad.",
              },
              {
                icon: "📚",
                title: "Capacitación Inclida",
                desc: "Te enseñamos a vender, crear contenido y crecer tu negocio desde cero.",
              },
              {
                icon: "🚚",
                title: "Envío Directo",
                desc: "Despachamos a tus clientas directamente. Vos solo cobrás y vendés.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-sm text-white/50">{benefit.desc}</p>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/5493482312433?text=Hola!%20Me%20interesa%20ser%20revendedora%20mayorista"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dorado mt-4"
            >
              Quiero Ser Revendedora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
