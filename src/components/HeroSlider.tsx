"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const activeBanners = banners.filter((b) => b.active);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prev = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
    );
  }, [activeBanners.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (activeBanners.length === 0) return null;

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-foreground">
      {/* Slides */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Banner Image */}
          <img
            src={banner.image_url}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-3xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/60 animate-fade-in">
                Dana Talía Lencería & Bikinis
              </p>
              <h1 className="heading-serif text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-up">
                {banner.title}
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-10 animate-fade-in-delay">
                {banner.subtitle}
              </p>
              <Link
                href={banner.link}
                className="btn-primary bg-white text-foreground hover:bg-white/90 animate-fade-in-delay"
              >
                Explorar Colección
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
        aria-label="Anterior"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
        aria-label="Siguiente"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {activeBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Gradient overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
