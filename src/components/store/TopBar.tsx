"use client";

import banner from "@/data/banner.json";

export function TopBar() {
  const text = banner.topBar?.text;
  const highlight = banner.topBar?.highlight;

  if (!text && !highlight) return null;

  return (
    <div className="bg-piedra text-white text-center py-2 px-4 text-xs tracking-wider">
      {text && <span className="opacity-90">{text}</span>}
      {text && highlight && <span className="mx-3 opacity-30">|</span>}
      {highlight && <span className="text-dorado font-semibold">{highlight}</span>}
    </div>
  );
}
