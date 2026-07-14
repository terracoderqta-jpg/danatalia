export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category?: Category;
  price: number;
  sizes: string[];
  colors: string[];
  active: boolean;
  featured: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  alt_text: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
}
