-- ============================================
-- DANA TALÍA LENCERÍA & BIKINIS
-- Schema de Base de Datos para Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: categories
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: products
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sizes JSONB DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: product_images
-- ============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  alt_text VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: banners
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link TEXT DEFAULT '/',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_banners_active ON banners(active);
CREATE INDEX idx_banners_sort ON banners(sort_order);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Politica publica: lectura para todos
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (active = true);

-- Politica admin: escritura completa (solo usuarios autenticados con rol admin)
-- En produccion, verificar el rol desde una tabla de profiles o usar JWT claims
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage banners" ON banners FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Crear bucket para imagenes de productos
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Crear bucket para imagenes de banners
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

-- Politicas de storage: lectura publica
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Public can view banner images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

-- Politicas de storage: escritura solo autenticados
CREATE POLICY "Authenticated can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can upload banner images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- ============================================
-- DATOS INICIALES (Opcional - Seeds)
-- ============================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Conjuntos', 'conjuntos', 'Conjuntos de lencería fina con diseño propio', 1),
  ('Enterizas', 'enterizas', 'Enterizas elegantes para ocasiones especiales', 2),
  ('Bikinis', 'bikinis', 'Bikinis de diseño exclusivo para el verano', 3),
  ('Accesorios', 'accesorios', 'Accesorios complementarios para completar tu look', 4);
