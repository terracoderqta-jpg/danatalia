"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import { formatPrice } from "./utils";

// ============================================
// TYPES
// ============================================

export type PriceMode = "minorista" | "mayorista";
export type CosmeticCategory = "todos" | (string & {});

export interface CosmeticProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  wholesalePrice: number;
  image: string;
  images?: (string | { image: string })[];
  cosmeticCategory: CosmeticCategory;
  badge?: string;
  rating: number;
  crueltyFree: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  wholesalePrice: number;
  image: string;
  gallery?: string[];
  category: string;
  badge?: string;
  rating?: number;
  source: "cosmetica";
}

interface StoreState {
  mode: PriceMode;
  cart: CartItem[];
  cartOpen: boolean;
  searchOpen: boolean;
  quickViewProduct: StoreProduct | null;
}

type StoreAction =
  | { type: "SET_MODE"; payload: PriceMode }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "SET_SEARCH_OPEN"; payload: boolean }
  | { type: "SET_QUICK_VIEW"; payload: StoreProduct | null };

// ============================================
// COSMETIC PRODUCTS (editables desde /admin - Decap CMS)
// ============================================
// Cada producto es un archivo en src/data/productos/*.json

interface JsonContext {
  keys: () => string[];
  (id: string): unknown;
}

// @ts-expect-error - require.context es una API de webpack disponible en el bundle de Next.js
const productosContext: JsonContext = require.context(
  "../data/productos",
  false,
  /\.json$/
);

export const COSMETIC_PRODUCTS: CosmeticProduct[] = (
  productosContext.keys() as string[]
)
  .map((k) => {
    const p = productosContext(k) as CosmeticProduct;
    const key = p.id || p.slug;
    return { ...p, id: key };
  })
  .sort(
    (a, b) =>
      (parseInt((a.id || "0").replace(/\D/g, ""), 10) || 0) -
      (parseInt((b.id || "0").replace(/\D/g, ""), 10) || 0)
  );

// ============================================
// REDUCER
// ============================================

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "ADD_TO_CART": {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cartOpen: true,
          cart: state.cart.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.payload],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [], cartOpen: false };

    case "TOGGLE_CART":
      return { ...state, cartOpen: !state.cartOpen };

    case "SET_CART_OPEN":
      return { ...state, cartOpen: action.payload };

    case "SET_SEARCH_OPEN":
      return { ...state, searchOpen: action.payload };

    case "SET_QUICK_VIEW":
      return { ...state, quickViewProduct: action.payload };

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface StoreContextValue {
  state: StoreState;
  allProducts: StoreProduct[];
  dispatch: React.Dispatch<StoreAction>;
  getPrice: (product: { price: number; wholesalePrice?: number }) => string;
  getNumericPrice: (product: { price: number; wholesalePrice?: number }) => number;
  cartTotal: number;
  cartCount: number;
  sendWhatsApp: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, {
    mode: "minorista",
    cart: [],
    cartOpen: false,
    searchOpen: false,
    quickViewProduct: null,
  });

  const cosmeticaProducts: StoreProduct[] = COSMETIC_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    wholesalePrice: p.wholesalePrice,
    image: p.image,
    gallery: [
      p.image,
      ...(p.images || []).map((i) => (typeof i === "string" ? i : i.image)),
    ],
    category: p.cosmeticCategory,
    badge: p.badge,
    rating: p.rating,
    source: "cosmetica" as const,
  }));

  const allProducts = cosmeticaProducts;

  const getPrice = useCallback(
    (product: { price: number; wholesalePrice?: number }) => {
      const p = state.mode === "mayorista" && product.wholesalePrice
        ? product.wholesalePrice
        : product.price;
      return formatPrice(p);
    },
    [state.mode]
  );

  const getNumericPrice = useCallback(
    (product: { price: number; wholesalePrice?: number }) => {
      return state.mode === "mayorista" && product.wholesalePrice
        ? product.wholesalePrice
        : product.price;
    },
    [state.mode]
  );

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsApp = useCallback(() => {
    const modeLabel = state.mode === "mayorista" ? "MAYORISTA" : "MINORISTA";
    let msg = `*NUEVO PEDIDO DANA TALÃA - MODO ${modeLabel}*\n\n`;
    state.cart.forEach((item, i) => {
      const sub = item.price * item.quantity;
      msg += `${i + 1}. ${item.name} x${item.quantity} = ${formatPrice(sub)}\n`;
    });
    msg += `\n*TOTAL ESTIMADO: ${formatPrice(cartTotal)}*`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/5493482312433?text=${encoded}`, "_blank");
  }, [state.cart, state.mode, cartTotal]);

  return (
    <StoreContext.Provider
      value={{
        state,
        allProducts,
        dispatch,
        getPrice,
        getNumericPrice,
        cartTotal,
        cartCount,
        sendWhatsApp,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
