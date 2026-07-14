"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ id?: string; url: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    sizes: "",
    colors: "",
    active: true,
    featured: false,
  });

  useEffect(() => {
    params.then(({ id }) => {
      if (id === "nuevo" || id === "crear") {
        router.replace("/admin/productos/crear");
        return;
      }
      setProductId(id);
      Promise.all([
        fetch(`/api/productos/${id}`).then((r) => r.json()),
        fetch("/api/categorias").then((r) => r.json()),
      ]).then(([product, cats]) => {
        setCategories(cats);
        if (product && !product.error) {
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

          if (product.images) {
            setImages(
              product.images.map((img: { id: string; image_url: string }) => ({
                id: img.id,
                url: img.image_url,
              }))
            );
          }
        }
        setLoading(false);
      });
    });
  }, [params]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "products");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          // Save to database
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
          setImages((prev) => [
            ...prev,
            { id: imgData.id, url: data.url },
          ]);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
    setUploading(false);
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id) {
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

      const res = await fetch(`/api/productos/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Error");

      router.push("/admin/productos");
    } catch {
      alert("Error al guardar");
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/productos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">
          Editar Producto
        </h2>
      </div>

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

            {/* Images */}
            <div className="admin-card">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Imágenes
              </h3>

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
                  <Loader2
                    size={32}
                    className="mx-auto text-gray-400 mb-3 animate-spin"
                  />
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
              Guardar Cambios
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
    </div>
  );
}
