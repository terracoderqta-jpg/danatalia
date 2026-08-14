"use client";

import { LogOut } from "lucide-react";
import { useIsAdmin } from "@/components/EditLink";

export function LogoutButton({ className = "" }: { className?: string }) {
  const isAdmin = useIsAdmin();

  const handleLogout = () => {
    try {
      localStorage.removeItem("decap-cms-user");
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  if (!isAdmin) return null;
  return (
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      className={`inline-flex items-center gap-1.5 rounded-full bg-piedra/85 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm shadow-md hover:bg-red-500 transition-colors ${className}`}
    >
      <LogOut size={11} />
      Cerrar sesión
    </button>
  );
}