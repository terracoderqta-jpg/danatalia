"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Product, Category } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/productos").then((r) => r.json()),
      fetch("/api/categorias").then((r) => r.json()),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filtered =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category_id === filterCategory);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
      );
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
      );
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás segura de eliminar este producto?")) return;
    try {
      await fetch(`/api/productos/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Gestión de Productos
        </h2>
        <Link href="/admin/productos/crear" className="btn-primary text-xs">
          <Plus size={16} className="mr-2" />
          Nuevo Producto
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Filtrar por categoría:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="all">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {filtered.length} productos
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Producto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Precio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Talles</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Destacado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {categories.find((c) => c.id === product.category_id)?.name || "—"}
                  </td>
                  <td className="py-3 px-4">{formatPrice(product.price)}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {Array.isArray(product.sizes)
                      ? product.sizes.join(", ")
                      : typeof product.sizes === "string"
                      ? JSON.parse(product.sizes).join(", ")
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleActive(product.id, product.active)}
                      className="flex items-center gap-1"
                    >
                      {product.active ? (
                        <Eye size={14} className="text-green-600" />
                      ) : (
                        <EyeOff size={14} className="text-red-500" />
                      )}
                      <span className={`text-xs ${product.active ? "text-green-600" : "text-red-500"}`}>
                        {product.active ? "Activo" : "Inactivo"}
                      </span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(product.id, product.featured)}
                      className={`text-xs px-2 py-1 rounded ${
                        product.featured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.featured ? "★ Sí" : "No"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit size={14} className="text-gray-600" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No hay productos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
