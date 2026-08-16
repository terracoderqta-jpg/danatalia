import type { SeccBannerData } from "@/components/store/SectionBanner";

interface JsonContext {
  keys: () => string[];
  (id: string): unknown;
}

export type BannerPosition =
  | "inicio"
  | "despues-categorias"
  | "despues-productos"
  | "antes-contacto";

const POSITION_ORDER: Record<BannerPosition, number> = {
  inicio: 1,
  "despues-categorias": 2,
  "despues-productos": 3,
  "antes-contacto": 4,
};

// @ts-expect-error - require.context es una API de webpack disponible en el bundle de Next.js
const bannersContext: JsonContext = require.context(
  "../data/banners",
  false,
  /\.json$/
);

const ALL_BANNERS: SeccBannerData[] = (bannersContext.keys() as string[])
  .map((k) => bannersContext(k) as SeccBannerData)
  .filter((b) => b && b.active !== false)
  .sort((a, b) => {
    const pa = POSITION_ORDER[a.position as BannerPosition] ?? 99;
    const pb = POSITION_ORDER[b.position as BannerPosition] ?? 99;
    return pa - pb;
  });

export function getBannersForPosition(position: BannerPosition) {
  if (!ALL_BANNERS.length) return [];
  return ALL_BANNERS.filter((b) => b.position === position);
}

export function hasBanners(): boolean {
  return ALL_BANNERS.length > 0;
}