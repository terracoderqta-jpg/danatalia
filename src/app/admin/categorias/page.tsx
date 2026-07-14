"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { Category } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image: "" });

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "products");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setUploading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: generateSlug(form.name),
          description: form.description,
          image: form.image,
          sort_order: categories.length + 1,
        }),
      });
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      resetForm();
    } catch {
      alert("Error al crear categoría");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch(`/api/categorias/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: generateSlug(form.name),
          description: form.description,
          image: form.image,
        }),
      });
      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? updated : c))
      );
      resetForm();
    } catch {
      alert("Error al actualizar");
    }
  };

  const startEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Estás segura? Los productos no se eliminarán.")) return;
    try {
      await fetch(`/api/categorias/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
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
          Gestión de Categorías
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary text-xs"
        >
          <Plus size={16} className="mr-2" />
          Nueva Categoría
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          className="admin-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="admin-input"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="admin-label">Imagen de la Categoría</label>
            {form.image ? (
              <div className="relative inline-block">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer block">
                {uploading ? (
                  <Loader2
                    size={32}
                    className="mx-auto animate-spin text-gray-400 mb-2"
                  />
                ) : (
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600">
                  {uploading ? "Subiendo..." : "Hacé clic para subir imagen"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG o WEBP. Máx 5MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary text-xs">
              {editingId ? "Guardar Cambios" : "Crear Categoría"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="btn-outline text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div key={category.id} className="admin-card">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs text-gray-400">#{index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(category)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Edit size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>

            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-nude to-blush rounded-lg mb-3 flex items-center justify-center">
                <span className="heading-serif text-3xl text-foreground/10">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            <h4 className="font-medium text-gray-800">{category.name}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {category.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
