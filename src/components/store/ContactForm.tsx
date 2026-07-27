"use client";

import { useState } from "react";
import { Send, Phone, MapPin, AtSign } from "lucide-react";

const PURCHASE_TYPES = [
  "Cosméticos Mayorista",
  "Lencería Mayorista",
  "Mix Mayorista",
  "Minorista",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let msg = `*Consulta Dana Talía*\n\n`;
    msg += `Nombre: ${form.name}\n`;
    msg += `Teléfono: ${form.phone}\n`;
    msg += `Email: ${form.email}\n`;
    msg += `Tipo de compra: ${form.type}\n`;
    msg += `Mensaje: ${form.message}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/5493482312433?text=${encoded}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="section-padding bg-cream">
      <div className="container-site mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-terracota/60 mb-3 font-semibold">
              Contacto
            </p>
            <h2 className="heading-serif text-3xl md:text-4xl text-piedra mb-6">
              Hablemos
            </h2>
            <p className="text-piedra/50 mb-8 leading-relaxed">
              ¿Tenés alguna consulta? ¿Querés ser revendedora? Escribinos y te
              respondemos a la brevedad.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center">
                  <Phone size={18} className="text-terracota" />
                </div>
                <div>
                  <p className="text-xs text-piedra/40">WhatsApp</p>
                  <p className="text-sm font-medium text-piedra">+54 9 3482 31-2433</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center">
                  <MapPin size={18} className="text-terracota" />
                </div>
                <div>
                  <p className="text-xs text-piedra/40">Showroom</p>
                  <p className="text-sm font-medium text-piedra">Belgrano al 700, Reconquista, Santa Fe</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-terracota/10 rounded-xl flex items-center justify-center">
                  <AtSign size={18} className="text-terracota" />
                </div>
                <div>
                  <p className="text-xs text-piedra/40">Instagram</p>
                  <p className="text-sm font-medium text-piedra">@danatalia.lenceria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-600" />
                </div>
                <h3 className="heading-serif text-xl text-piedra mb-2">¡Mensaje Enviado!</h3>
                <p className="text-sm text-piedra/50">
                  Te redirigimos a WhatsApp para completar tu consulta.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-outline mt-6 text-xs"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-piedra/60 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-nude/50 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-terracota/20 focus:border-terracota transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-piedra/60 mb-1.5">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-nude/50 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-terracota/20 focus:border-terracota transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-piedra/60 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-nude/50 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-terracota/20 focus:border-terracota transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-piedra/60 mb-1.5">
                    Tipo de compra
                  </label>
                  <select
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-nude/50 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-terracota/20 focus:border-terracota transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    {PURCHASE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-piedra/60 mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-nude/50 bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-terracota/20 focus:border-terracota transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send size={16} className="mr-2" />
                  Enviar por WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
