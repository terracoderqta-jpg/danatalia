"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

declare global {
  interface Window {
    netlifyIdentity?: {
      currentUser: () => unknown;
      on?: (event: string, cb: () => void) => void;
      off?: (event: string, cb: () => void) => void;
    };
  }
}

function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  const identity = window.netlifyIdentity;
  if (identity && identity.currentUser()) return true;
  try {
    if (localStorage.getItem("netlify-cms-user")) return true;
    if (localStorage.getItem("netlify-identity-user")) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const check = () => setIsAdmin(hasSession());
    check();
    const identity = window.netlifyIdentity;
    identity?.on?.("login", check);
    identity?.on?.("logout", check);
    window.addEventListener("focus", check);
    const timer = setInterval(check, 2000);
    return () => {
      identity?.off?.("login", check);
      identity?.off?.("logout", check);
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
