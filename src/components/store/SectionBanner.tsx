"use client";

import Image from "next/image";

export interface SeccBannerData {
  name?: string;
  slug: string;
  position: string;
  active?: boolean;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  video?: string;
}

export function SectionBanner({ banner }: { banner: SeccBannerData }) {
  if (!banner?.active && banner.active !== undefined && banner.active !== true) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          {banner.video ? (
            <video
              src={banner.video}
              poster={banner.image || undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-[260px] md:h-[320px] object-cover"
            />
          ) : banner.image ? (
            <Image
              src={banner.image}
              alt={banner.title || banner.name || "Banner"}
              width={1600}
              height={600}
              className="w-full h-[260px] md:h-[320px] object-cover"
            />
          ) : (
            <div className="w-full h-[260px] md:h-[320px] bg-gradient-to-br from-terracota to-dorado" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-piedra/70 via-piedra/30 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-14 max-w-xl">
              {banner.title && (
                <h2 className="heading-serif text-2xl md:text-4xl text-white mb-3">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="text-white/80 text-sm md:text-base mb-6">
                  {banner.subtitle}
                </p>
              )}
              {banner.ctaText && (
                <a
                  href={banner.ctaLink || "#"}
                  className="btn-primary"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}