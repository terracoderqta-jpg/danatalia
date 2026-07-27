"use client";

import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "María González",
    type: "Cliente Minorista",
    text: "Los cosméticos de Dana Talía son increíbles. El sérum de vitamina C me cambió la piel. El despacho súper rápido.",
    rating: 5,
    avatar: "MG",
  },
  {
    name: "Luciana Fernández",
    type: "Revendedora Mayorista",
    text: "Empecé con una inversión de $80.000 y en el primer mes ya había triplicado mi ganancia. La capacitación es excellentísima.",
    rating: 5,
    avatar: "LF",
  },
  {
    name: "Carolina Ruiz",
    type: "Cliente Minorista",
    text: "La bruma floral es mi favorita. Todos me preguntan a qué huelo. Los productos son de primera calidad.",
    rating: 5,
    avatar: "CR",
  },
  {
    name: "Valentina López",
    type: "Revendedora Mayorista",
    text: "Las clientas me piden más productos cada semana. Dana Talía me dio la oportunidad de emprender desde mi casa.",
    rating: 5,
    avatar: "VL",
  },
  {
    name: "Camila Herrera",
    type: "Cliente Minorista",
    text: "Compré el kit skincare y mi piel quedó increíble. El precio es muy bueno para la calidad que tiene.",
    rating: 4,
    avatar: "CH",
  },
  {
    name: "Daniela Romero",
    type: "Revendedora Mayorista",
    text: "En 3 meses armé mi clientela estable. Los productos se venden solos y el margen de ganancia es muy bueno.",
    rating: 5,
    avatar: "DR",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-terracota/60 mb-3 font-semibold">
            Opiniones Verificadas
          </p>
          <h2 className="heading-serif text-3xl md:text-5xl text-piedra mb-4">
            Lo Que Dicen Nuestras Clientas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-cream rounded-3xl p-6 border border-nude/50 relative"
            >
              <Quote
                size={32}
                className="text-terracota/10 absolute top-4 right-4"
              />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-terracota/10 rounded-full flex items-center justify-center text-terracota text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-piedra">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-terracota/60">
                    {t.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i <= t.rating ? "fill-dorado text-dorado" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-piedra/60 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
