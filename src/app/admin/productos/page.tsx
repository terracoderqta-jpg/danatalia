"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Upload } from "lucide-react";
import { Product, Category } from "@/lib/types";
import { formatPrice, generateSlug } from "@/lib/utils";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ id?: string; url: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    sizes: "S, M, L, XL",
    colors: "",
    active: true,
    featured: false,
  });

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

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category_id: "",
      price: "",
      sizes: "S, M, L, XL",
      colors: "",
      active: true,
      featured: false,
    });
    setImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    const sizes = Array.isArray(product.sizes)
      ? product.sizes
      : typeof product.sizes === "string"
      ? JSON.parse(product.sizes)
      : [];
    const colors = Array.isArray(product.colors)
      ? product.colors
      : typeof product.colors === "string"
      ? JSON.parse(product.colors)
      : [];

    setForm({
      name: product.name,
      description: product.description || "",
      category_id: product.category_id,
      price: String(product.price),
      sizes: sizes.join(", "),
      colors: colors.join(", "),
      active: product.active,
      featured: product.featured,
    });
    setImages(
      (product.images || []).map((img) => ({ id: img.id, url: img.image_url }))
    );
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "products");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url && editingId) {
          const imgRes = await fetch(`/api/productos/${editingId}/imagenes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: data.url,
              sort_order: images.length,
              alt_text: `${form.name} imagen ${images.length + 1}`,
            }),
          });
          const imgData = await imgRes.json();
          setImages((prev) => [...prev, { id: imgData.id, url: data.url }]);
        } else if (data.url) {
          setImages((prev) => [...prev, { url: data.url }]);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id && editingId) {
      await fetch(`/api/productos/${editingId}/imagenes?imageId=${img.id}`, {
        method: "DELETE",
      });
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: form.name,
      slug: generateSlug(form.name),
      description: form.description,
      category_id: form.category_id,
      price: Number(form.price),
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
      active: form.active,
      featured: form.featured,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/productos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!res.ok) {
          const err = await res.json();
          console.error("PUT error:", err);
          alert("Error al actualizar: " + (err.error || "desconocido"));
          return;
        }
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...updated, images: p.images }
              : p
          )
        );
      } else {
        const res = await fetch("/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (!res.ok) {
          const err = await res.json();
          console.error("POST error:", err);
          alert("Error al crear: " + (err.error || "desconocido"));
          return;
        }
        const newProduct = await res.json();
        setProducts((prev) => [{ ...newProduct, images: [] }, ...prev]);
        setEditingId(newProduct.id);
        setForm((f) => ({ ...f }));
        return;
      }
      resetForm();
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error de red o servidor");
    }
  };

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
    } catch {
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
    } catch {
      alert("Error al actualizar");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Estás segura de eliminar este producto?")) return;
    try {
      await fetch(`/api/productos/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
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
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary text-xs"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="admin-label">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div>
                <label className="admin-label">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="admin-input min-h-[100px] resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Categoría</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="admin-input"
                    required
                  >
                    <option value="">Seleccionar</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Precio (ARS)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Talles (coma)</label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Colores (coma)</label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">Activo</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">Destacado</label>
                </div>
              </div>

              {/* Images (only when editing) */}
              {editingId && (
                <div>
                  <label className="admin-label">Imágenes</label>
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {images.map((img, idx) => (
                        <div key={img.id || idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                    {uploading ? (
                      <Loader2 size={20} className="mx-auto text-gray-400 animate-spin" />
                    ) : (
                      <Upload size={20} className="mx-auto text-gray-400" />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {uploading ? "Subiendo..." : "Agregar imagen"}
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <button type="submit" className="btn-primary w-full text-xs">
                {editingId ? "Guardar Cambios" : "Crear Producto"}
              </button>
            </div>
          </div>
        </form>
      )}

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
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">{filtered.length} productos</span>
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
                <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Edit size={14} className="text-gray-600" />
                      </button>
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
                  <td colSpan={5} className="py-8 text-center text-gray-400">
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
