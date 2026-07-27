"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { formatPrice } from "./utils";

// ============================================
// TYPES
// ============================================

export type PriceMode = "minorista" | "mayorista";
export type CosmeticCategory = "todos" | "skincare" | "maquillaje" | "perfumes" | "sets";

export interface CosmeticProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  wholesalePrice: number;
  image: string;
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
  category: string;
  badge?: string;
  rating?: number;
  source: "cosmetica" | "lenceria";
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
// COSMETIC PRODUCTS (Hardcoded)
// ============================================

export const COSMETIC_PRODUCTS: CosmeticProduct[] = [
  {
    id: "cos-1",
    name: "Sérum Vitamina C Bright",
    slug: "serum-vitamina-c",
    description: "Sérum concentrado con vitamina C pura, ácido hialurónico y antioxidantes. Ilumina y protege tu piel del envejecimiento prematuro.",
    price: 8500,
    wholesalePrice: 4930,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    cosmeticCategory: "skincare",
    badge: "Más Vendido",
    rating: 4.8,
    crueltyFree: true,
  },
  {
    id: "cos-2",
    name: "Crema Hidratante Rosa Mosqueta",
    slug: "crema-rosa-mosqueta",
    description: "Hidratación profunda con aceite de rosa mosqueta orgánico. Textura sedosa que absorbé al instante.",
    price: 6200,
    wholesalePrice: 3596,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop",
    cosmeticCategory: "skincare",
    rating: 4.6,
    crueltyFree: true,
  },
  {
    id: "cos-3",
    name: "Tónico Floral Botánico",
    slug: "tonico-floral",
    description: "Tónico refrescante con extractos de rosa, caléndula y manzanilla. Prepara tu piel para la hidratación.",
    price: 4800,
    wholesalePrice: 2784,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    cosmeticCategory: "skincare",
    crueltyFree: true,
    rating: 4.5,
  },
  {
    id: "cos-4",
    name: "Paleta Nude Terracota",
    slug: "paleta-nude-terracota",
    description: "12 tonos matte y shimmer en paleta de lujo. Desde nude suave hasta terracota intenso para looks versátiles.",
    price: 12900,
    wholesalePrice: 7482,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop",
    cosmeticCategory: "maquillaje",
    badge: "Nuevo",
    rating: 4.9,
    crueltyFree: true,
  },
  {
    id: "cos-5",
    name: "Labial Matte Botánico",
    slug: "labial-matte-botanico",
    description: "Labial de larga duración con fórmula enriquecida con aceites vegetales. Colores intensos sin resecar los labios.",
    price: 3900,
    wholesalePrice: 2262,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
    cosmeticCategory: "maquillaje",
    rating: 4.7,
    crueltyFree: true,
  },
  {
    id: "cos-6",
    name: "Base Glow Natural",
    slug: "base-glow-natural",
    description: "Base de maquillaje con acabado luminoso natural. Cobertura buildable con protección solar SPF 15.",
    price: 7600,
    wholesalePrice: 4408,
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop",
    cosmeticCategory: "maquillaje",
    rating: 4.4,
    crueltyFree: true,
  },
  {
    id: "cos-7",
    name: "Bruma Floral Dana",
    slug: "bruma-floral-dana",
    description: "Fragancia delicada con notas de peonía, jazmín y almizco suave. Perfecta para el uso diario.",
    price: 9800,
    wholesalePrice: 5684,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
    cosmeticCategory: "perfumes",
    badge: "Exclusivo",
    rating: 4.9,
    crueltyFree: false,
  },
  {
    id: "cos-8",
    name: "Eau de Parfum Velvet",
    slug: "eau-de-parfum-velvet",
    description: "Fragancia oriental con notas de vainilla, sándalo y rosa negra. Elegancia en cada spray.",
    price: 14500,
    wholesalePrice: 8410,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop",
    cosmeticCategory: "perfumes",
    rating: 4.8,
    crueltyFree: false,
  },
  {
    id: "cos-9",
    name: "Agua de Colonia Fresh",
    slug: "agua-de-colonia-fresh",
    description: "Fragancia cítrica y fresca con notas de bergamota, limón y menta. Ideal para el verano.",
    price: 5400,
    wholesalePrice: 3132,
    image: "https://images.unsplash.com/photo-1594035910387-fbd1a18e5004?w=600&h=600&fit=crop",
    cosmeticCategory: "perfumes",
    rating: 4.3,
    crueltyFree: false,
  },
  {
    id: "cos-10",
    name: "Kit Skincare Completo",
    slug: "kit-skincare-completo",
    description: "Tu rutina completa: limpiador, tónico, sérum y crema hidratante. Todo lo que necesitás en un solo kit.",
    price: 22900,
    wholesalePrice: 13282,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    cosmeticCategory: "sets",
    badge: "Ahorro 30%",
    rating: 4.9,
    crueltyFree: true,
  },
  {
    id: "cos-11",
    name: "Set Maquillaje Daily",
    slug: "set-maquillaje-daily",
    description: "Base, corrector, rubor y labial en un set compacto. Tu look natural diario en 4 pasos.",
    price: 18500,
    wholesalePrice: 10730,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
    cosmeticCategory: "sets",
    rating: 4.6,
    crueltyFree: true,
  },
  {
    id: "cos-12",
    name: "Kit Regalo Premium",
    slug: "kit-regalo-premium",
    description: "Pack de regalo con sérum, bruma floral y crema humectante en caja de lujo. El regalo perfecto.",
    price: 28900,
    wholesalePrice: 16762,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&h=600&fit=crop",
    cosmeticCategory: "sets",
    badge: "Edición Limitada",
    rating: 5.0,
    crueltyFree: true,
  },
  {
    id: "cos-13",
    name: "Mascarilla de Arcilla Verde",
    slug: "mascarilla-arcilla-verde",
    description: "Mascarilla purificante con arcilla verde y té verde. Limpia poros y controla la grasa sin resecar.",
    price: 4200,
    wholesalePrice: 2436,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop",
    cosmeticCategory: "skincare",
    rating: 4.5,
    crueltyFree: true,
  },
  {
    id: "cos-14",
    name: "Brush Set Profesional",
    slug: "brush-set-profesional",
    description: "Set de 12 brochas profesionales con cerdas sintéticas premium. Incluye neceser de cuero vegano.",
    price: 15800,
    wholesalePrice: 9164,
    image: "https://images.unsplash.com/photo-1522338140-7f3a68a4a21b?w=600&h=600&fit=crop",
    cosmeticCategory: "maquillaje",
    rating: 4.7,
    crueltyFree: true,
  },
  {
    id: "cos-15",
    name: "Aceite Corporal Nutritivo",
    slug: "aceite-corporal-nutritivo",
    description: "Aceite corporal con almendras dulces, vitamina E yextracto de caléndula. Piel suave y sedosa.",
    price: 5600,
    wholesalePrice: 3248,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    cosmeticCategory: "skincare",
    rating: 4.4,
    crueltyFree: true,
  },
];

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

  const [lenceriaProducts, setLenceriaProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then((r) => r.json())
      .then((data) => {
        const mapped: StoreProduct[] = (data || [])
          .filter((p: { active: boolean }) => p.active)
          .map((p: {
            id: string;
            name: string;
            slug: string;
            price: number;
            images?: { image_url: string }[];
            category?: { name: string };
          }) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            wholesalePrice: Math.round(p.price * 0.58),
            image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop",
            category: p.category?.name || "Lencería",
            source: "lenceria" as const,
          }));
        setLenceriaProducts(mapped);
      })
      .catch(() => {});
  }, []);

  const cosmeticaProducts: StoreProduct[] = COSMETIC_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    wholesalePrice: p.wholesalePrice,
    image: p.image,
    category: p.cosmeticCategory,
    badge: p.badge,
    rating: p.rating,
    source: "cosmetica" as const,
  }));

  const allProducts = [...cosmeticaProducts, ...lenceriaProducts];

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
    let msg = `*NUEVO PEDIDO DANA TALÍA - MODO ${modeLabel}*\n\n`;
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
