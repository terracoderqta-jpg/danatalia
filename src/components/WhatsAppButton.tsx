"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname === "/login";

  if (isAdminRoute) return null;

  return (
    <a
      href="https://wa.me/5493482555555?text=Hola!%20Me%20interesa%20una%20consulta%20sobre%20sus%20productos"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 hover:scale-110 transition-all duration-300"
      aria-label="WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
