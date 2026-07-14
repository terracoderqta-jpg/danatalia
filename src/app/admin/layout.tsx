"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-800">
              Panel de Administración
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Dana Talía</span>
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white text-xs">
                DT
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
