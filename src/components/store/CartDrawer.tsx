"use client";

import { useStore } from "@/lib/store";
import Image from "next/image";
import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";

export function CartDrawer() {
  const { state, dispatch, cartTotal, cartCount, sendWhatsApp } = useStore();

  if (!state.cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={() => dispatch({ type: "SET_CART_OPEN", payload: false })}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nude/30">
          <div>
            <h3 className="heading-serif text-xl text-piedra">Tu Carrito</h3>
            <p className="text-xs text-piedra/40">{cartCount} producto{cartCount !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_CART_OPEN", payload: false })}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-piedra/20" />
              </div>
              <p className="text-piedra/40 text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-cream rounded-2xl p-3"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-piedra truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-terracota font-semibold">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { id: item.id, quantity: item.quantity - 1 },
                          })
                        }
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-nude/30"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { id: item.id, quantity: item.quantity + 1 },
                          })
                        }
                        className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-nude/30"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                        }
                        className="ml-auto text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div className="border-t border-nude/30 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-piedra/60">Subtotal</span>
              <span className="heading-serif text-xl text-piedra">
                ${cartTotal.toLocaleString("es-AR")}
              </span>
            </div>
            <button onClick={sendWhatsApp} className="btn-whatsapp w-full">
              <MessageCircle size={16} className="mr-2" />
              Enviar Pedido por WhatsApp
            </button>
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="w-full text-center text-xs text-piedra/40 hover:text-piedra/60 py-1"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
