"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  X,
  Edit,
} from "lucide-react";
import { Banner } from "@/lib/types";

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link: "/",
    active: true,
  });

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        setBanners(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ title: "", subtitle: "", image_url: "", link: "/", active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      link: banner.link || "/",
      active: banner.active,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "banners");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setUploading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sort_order: banners.length + 1,
        }),
      });
      const newBanner = await res.json();
      setBanners((prev) => [...prev, newBanner]);
      resetForm();
    } catch {
      alert("Error al crear banner");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch(`/api/banners/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setBanners((prev) =>
        prev.map((b) => (b.id === editingId ? updated : b))
      );
      resetForm();
    } catch {
      alert("Error al actualizar banner");
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      setBanners((prev) =>
        prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
      );
    } catch {
      alert("Error al actualizar");
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("¿Estás segura de eliminar este banner?")) return;
    try {
      await fetch(`/api/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [
      newBanners[index],
      newBanners[index - 1],
    ];
    for (let i = 0; i < newBanners.length; i++) {
      await fetch(`/api/banners/${newBanners[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: i + 1 }),
      });
    }
    setBanners(newBanners);
  };

  const moveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [
      newBanners[index + 1],
      newBanners[index],
    ];
    for (let i = 0; i < newBanners.length; i++) {
      await fetch(`/api/banners/${newBanners[i].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: i + 1 }),
      });
    }
    setBanners(newBanners);
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
          Gestión de Banners
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary text-xs"
        >
          <Plus size={16} className="mr-2" />
          Nuevo Banner
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
          className="admin-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {editingId ? "Editar Banner" : "Nuevo Banner"}
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
              <label className="admin-label">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label className="admin-label">Subtítulo</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Enlace</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="admin-input"
                placeholder="/catalogo"
              />
            </div>
            <div>
              <label className="admin-label">Estado</label>
              <div className="flex items-center gap-3 h-[38px]">
                <input
                  type="checkbox"
                  id="banner-active"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="banner-active" className="text-sm text-gray-700">
                  Banner visible
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="admin-label">Imagen del Banner</label>
            {form.image_url ? (
              <div className="relative inline-block">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image_url: "" })}
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
                  {uploading ? "Subiendo imagen..." : "Hacé clic para subir imagen"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG o WEBP. Máx 5MB. Recomendado: 1920x1080px
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
              {editingId ? "Guardar Cambios" : "Crear Banner"}
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

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div key={banner.id} className="admin-card flex items-center gap-4">
            {/* Sort arrows */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                disabled={index === 0}
              >
                <GripVertical size={14} className="rotate-180" />
              </button>
              <button
                onClick={() => moveDown(index)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30"
                disabled={index === banners.length - 1}
              >
                <GripVertical size={14} />
              </button>
            </div>

            {/* Image preview */}
            {banner.image_url ? (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-32 h-20 object-cover rounded-lg shrink-0"
              />
            ) : (
              <div className="w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-xs text-gray-500">Sin imagen</span>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">
                {banner.title}
              </h4>
              <p className="text-sm text-gray-500 truncate">
                {banner.subtitle}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Enlace: {banner.link}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleActive(banner.id, banner.active)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {banner.active ? (
                  <>
                    <Eye size={14} className="text-green-600" />
                    <span className="text-xs text-green-600">Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} className="text-red-500" />
                    <span className="text-xs text-red-500">Oculto</span>
                  </>
                )}
              </button>

              <button
                onClick={() => startEdit(banner)}
                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit size={14} className="text-blue-600" />
              </button>

              <button
                onClick={() => deleteBanner(banner.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="admin-card text-center py-12 text-gray-400">
            No hay banners. Creá el primero.
          </div>
        )}
      </div>
    </div>
  );
}
