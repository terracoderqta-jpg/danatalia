"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

// Decap CMS guarda la sesión del usuario (con su token de GitHub) en este key.
function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem("decap-cms-user"));
  } catch {
    return false;
  }
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const check = () => setIsAdmin(hasSession());
    check();
    window.addEventListener("focus", check);
    const timer = setInterval(check, 2000);
    return () => {
      window.removeEventListener("focus", check);
      clearInterval(timer);
    };
  }, []);

  return isAdmin;
}

export function EditLink({
  href,
  className = "",
}: {
  href: string;
  className?: string;
}) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Editar en el panel"
      className={`inline-flex items-center gap-1.5 rounded-full bg-piedra/85 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm shadow-md hover:bg-terracota transition-colors ${className}`}
    >
      <Pencil size={11} />
      Editar
    </a>
  );
}