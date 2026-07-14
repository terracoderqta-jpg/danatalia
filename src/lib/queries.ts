import { supabase, getSupabaseServer } from "./supabase";
import { Category, Product, Banner } from "./types";

// ============================================
// PUBLIC QUERIES (Client-side)
// ============================================

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  active?: boolean;
}): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .order("created_at", { ascending: false });

  if (options?.active !== undefined) {
    query = query.eq("active", options.active);
  } else {
    query = query.eq("active", true);
  }

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  if (options?.categorySlug) {
    query = query.eq("category.slug", options.categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
  return data || [];
}

// ============================================
// ADMIN QUERIES (Server-side with service role)
// ============================================

export async function getAdminProducts(): Promise<Product[]> {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
  return data || [];
}

export async function getAdminProductById(
  id: string
): Promise<Product | null> {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at" | "category" | "images">
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }
  return data;
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }
  return data;
}

export async function deleteProduct(id: string) {
  const db = getSupabaseServer();
  const { error } = await db.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function createProductImage(image: {
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order?: number;
}) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("product_images")
    .insert(image)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProductImage(id: string) {
  const db = getSupabaseServer();
  const { error } = await db.from("product_images").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// BANNERS
// ============================================

export async function getAdminBanners(): Promise<Banner[]> {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
  return data || [];
}

export async function createBanner(
  banner: Omit<Banner, "id" | "created_at">
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("banners")
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBanner(
  id: string,
  banner: Partial<Omit<Banner, "id" | "created_at">>
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("banners")
    .update(banner)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBanner(id: string) {
  const db = getSupabaseServer();
  const { error } = await db.from("banners").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// CATEGORIES
// ============================================

export async function getAdminCategories(): Promise<Category[]> {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at">
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  id: string,
  category: Partial<Omit<Category, "id" | "created_at">>
) {
  const db = getSupabaseServer();
  const { data, error } = await db
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const db = getSupabaseServer();
  const { error } = await db.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ============================================
// STATS
// ============================================

export async function getAdminStats() {
  const db = getSupabaseServer();

  const [products, categories, banners] = await Promise.all([
    db.from("products").select("id, active, featured", { count: "exact" }),
    db.from("categories").select("id", { count: "exact" }),
    db.from("banners").select("id, active", { count: "exact" }),
  ]);

  return {
    totalProducts: products.count || 0,
    activeProducts:
      products.data?.filter((p) => p.active).length || 0,
    featuredProducts:
      products.data?.filter((p) => p.featured).length || 0,
    totalCategories: categories.count || 0,
    totalBanners: banners.count || 0,
    activeBanners:
      banners.data?.filter((b) => b.active).length || 0,
  };
}
