"use client";

import banner from "@/data/banner.json";

export function TopBar() {
  return (
    <div className="bg-piedra text-white text-center py-2 px-4 text-xs tracking-wider">
      <span className="opacity-90">{banner.topBar.text}</span>
      <span className="mx-3 opacity-30">|</span>
      <span className="text-dorado font-semibold">{banner.topBar.highlight}</span>
    </div>
  );
}
