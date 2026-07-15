"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Loader2, X, Check, Edit } from "lucide-react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
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
    fetch("/api/categorias").then((r) => r.json()).then(setCategories);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !productId) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "products");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          const imgRes = await fetch(`/api/productos/${productId}/imagenes`, {
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
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id && productId) {
      await fetch(`/api/productos/${productId}/imagenes?imageId=${img.id}`, {
        method: "DELETE",
      });
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name: form.name,
        slug: generateSlug(form.name),
        description: form.description,
        category_id: form.category_id,
        price: Number(form.price),
        sizes: form.sizes.split(",").map((s) => s.trim()),
        colors: form.colors
          ? form.colors.split(",").map((c) => c.trim())
          : [],
        active: form.active,
        featured: form.featured,
      };

      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Error");

      const newProduct = await res.json();
      setProductId(newProduct.id);
    } catch {
      alert("Error al crear producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/productos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">
          Nuevo Producto
        </h2>
      </div>

      {productId ? (
        /* Step 2: Product created — upload images */
        <div className="space-y-6">
          <div className="admin-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={16} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Producto creado</h3>
                <p className="text-sm text-gray-500">Ahora podés agregar imágenes</p>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block">
              {uploading ? (
                <Loader2 size={32} className="mx-auto text-gray-400 mb-3 animate-spin" />
              ) : (
                <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              )}
              <p className="text-sm text-gray-600">
                {uploading ? "Subiendo..." : "Agregar imágenes"}
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

          <div className="flex gap-3">
            <Link
              href={`/admin/productos/${productId}`}
              className="btn-primary text-xs"
            >
              <Edit size={16} className="mr-2" />
              Editar producto
            </Link>
            <Link
              href="/admin/productos"
              className="btn-outline text-xs"
            >
              Ir a la lista
            </Link>
          </div>
        </div>
      ) : (
        /* Step 1: Create product form */
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="admin-card">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Información del Producto
                </h3>
                <div className="space-y-4">
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
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="admin-input min-h-[120px] resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Categoría</label>
                      <select
                        value={form.category_id}
                        onChange={(e) =>
                          setForm({ ...form, category_id: e.target.value })
                        }
                        className="admin-input"
                        required
                      >
                        <option value="">Seleccionar</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Precio (ARS)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        className="admin-input"
                        required
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Poner 0 para "Consultar"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="admin-label">Talles (coma)</label>
                      <input
                        type="text"
                        value={form.sizes}
                        onChange={(e) =>
                          setForm({ ...form, sizes: e.target.value })
                        }
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Colores (coma)</label>
                      <input
                        type="text"
                        value={form.colors}
                        onChange={(e) =>
                          setForm({ ...form, colors: e.target.value })
                        }
                        className="admin-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="admin-card">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Publicación
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <label htmlFor="active" className="text-sm text-gray-700">
                      Activo
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      Destacado
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full text-xs disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Save size={16} className="mr-2" />
                )}
                Crear Producto
              </button>

              <Link
                href="/admin/productos"
                className="block text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
