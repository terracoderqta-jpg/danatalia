"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Clock, Heart } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on admin and login pages
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname === "/login";

  if (isAdminRoute) return null;

  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Dana Talía"
              width={180}
              height={50}
              className="h-14 w-auto mb-6"
              unoptimized
            />
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Lencería fina y trajes de baño de diseño propio. Cada pieza está
              pensada para hacer sentir única a quien la lleva.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 font-medium">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/catalogo?cat=conjuntos", label: "Lencería" },
                { href: "/catalogo?cat=bikinis", label: "Bikinis" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-6 font-medium">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-white/40 mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  Belgrano al 700, Reconquista
                  <br />
                  Santa Fe, Argentina
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-white/40 mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  Lun a Vie: 9:00 - 19:00
                  <br />
                  Sáb: 9:00 - 14:00
                </span>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/danatalia.lenceria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  @danatalia.lenceria
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Dana Talía Lencería & Bikinis.
            Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs flex items-center gap-1">
            Hecho con <Heart size={12} className="text-rose" /> en Reconquista
          </p>
        </div>
      </div>
    </footer>
  );
}
