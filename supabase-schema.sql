-- ====================================================================
-- VERDORA MARKETPLACE - COMPLETE SUPABASE SCHEMA
-- Run this in Supabase Dashboard > SQL Editor (New Query > Paste > Run)
-- ====================================================================

-- ==================== EXTENSIONS ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== 1. USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  mobile VARCHAR(20) DEFAULT '',
  password_hash TEXT DEFAULT '',
  role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  business TEXT DEFAULT '',
  location TEXT DEFAULT '',
  pincode VARCHAR(10) DEFAULT '',
  address TEXT DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  profile_picture TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 2. CATEGORIES TABLE ====================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 3. SELLER PRODUCTS TABLE ====================
CREATE TABLE IF NOT EXISTS seller_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  price_per_kg DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT 0,
  discount_percent INTEGER DEFAULT 0,
  image TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  location TEXT DEFAULT '',
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  daily_stock INTEGER DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'kg',
  minimum_order DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(100) DEFAULT 'Vegetables',
  subcategory VARCHAR(100) DEFAULT '',
  contact_phone VARCHAR(20) DEFAULT '',
  freshness VARCHAR(50) DEFAULT 'Fresh' CHECK (freshness IN ('Fresh', '1 Day Old', '2 Days Old', 'Organic')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 4. ORDERS TABLE ====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE DEFAULT '',
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  location TEXT DEFAULT '',
  address TEXT DEFAULT '',
  pincode VARCHAR(10) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT '',
  payment_method VARCHAR(50) DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'Cash', 'Card', 'Net Banking')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id VARCHAR(255) DEFAULT '',
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 5. ORDER ITEMS TABLE ====================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'kg',
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 6. SAVED CARTS TABLE ====================
CREATE TABLE IF NOT EXISTS saved_carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_type VARCHAR(20) DEFAULT 'seller' CHECK (product_type IN ('seller')),
  product_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit VARCHAR(50) DEFAULT 'kg',
  image TEXT DEFAULT '',
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_type, product_id)
);

-- ==================== 7. ADDRESSES TABLE ====================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Other')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  landmark TEXT DEFAULT '',
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 8. PAYMENT TRANSACTIONS TABLE ====================
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  transaction_id VARCHAR(255) DEFAULT '',
  upi_id VARCHAR(255) DEFAULT '',
  upi_link TEXT DEFAULT '',
  qr_url TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  response_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 9. REVIEWS TABLE ====================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES seller_products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ==================== 10. NOTIFICATIONS TABLE ====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'order', 'payment', 'approval', 'promo')),
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 11. EMAIL OTPS TABLE ====================
CREATE TABLE IF NOT EXISTS email_otps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 12. CONTACT / ENQUIRY TABLE ====================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_seller_products_seller_id ON seller_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_products_status ON seller_products(status);
CREATE INDEX IF NOT EXISTS idx_seller_products_category ON seller_products(category);
CREATE INDEX IF NOT EXISTS idx_seller_products_featured ON seller_products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_saved_carts_user_id ON saved_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_email_otps_email ON email_otps(email);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);

-- ====================================================================
-- AUTO FUNCTIONS & TRIGGERS
-- ====================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seller_products_updated_at
  BEFORE UPDATE ON seller_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_part VARCHAR(8);
  random_part VARCHAR(6);
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  NEW.order_number := 'VER-' || date_part || '-' || random_part;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Cleanup expired OTPs automatically
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM email_otps WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Decrement stock when order is placed
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE seller_products
  SET daily_stock = GREATEST(daily_stock - qty, 0)
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Users: can read/update own profile, admins can read all
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_read_own ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Seller products: public read active, sellers manage own
ALTER TABLE seller_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY seller_products_read_active ON seller_products
  FOR SELECT USING (status = 'active' OR auth.uid()::text = seller_id::text);

CREATE POLICY seller_products_insert_own ON seller_products
  FOR INSERT WITH CHECK (auth.uid()::text = seller_id::text);

CREATE POLICY seller_products_update_own ON seller_products
  FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY seller_products_delete_own ON seller_products
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Orders: users see own, admins see all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_read_own ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY orders_insert_own ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Carts: users manage own
ALTER TABLE saved_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY carts_read_own ON saved_carts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY carts_insert_own ON saved_carts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY carts_update_own ON saved_carts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY carts_delete_own ON saved_carts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Addresses: users manage own
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY addresses_read_own ON addresses
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY addresses_insert_own ON addresses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY addresses_update_own ON addresses
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY addresses_delete_own ON addresses
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Notifications: users read own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_read_own ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- ====================================================================
-- SEED DATA: Categories
-- ====================================================================
INSERT INTO categories (name, slug, description, image, sort_order) VALUES
  ('Fruits', 'fruits', 'Fresh seasonal fruits from farms', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=400&auto=format&fit=crop', 1),
  ('Vegetables', 'vegetables', 'Farm-fresh vegetables daily', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=400&auto=format&fit=crop', 2),
  ('Organic', 'organic', 'Certified organic produce', 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&auto=format&fit=crop', 3),
  ('Exotic', 'exotic', 'Premium exotic fruits & vegetables', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop', 4),
  ('Bulk Orders', 'bulk-orders', 'Wholesale prices for bulk purchases', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop', 5)
ON CONFLICT (name) DO NOTHING;

-- ==================================
==================================
-- HELPER FUNCTIONS FOR BACKEND
-- ====================================================================

-- Function to create user (called by backend instead of raw insert)
CREATE OR REPLACE FUNCTION create_user(
  p_firebase_uid VARCHAR,
  p_name VARCHAR,
  p_phone VARCHAR,
  p_email VARCHAR DEFAULT '',
  p_password_hash TEXT DEFAULT '',
  p_role VARCHAR DEFAULT 'buyer',
  p_business TEXT DEFAULT '',
  p_location TEXT DEFAULT '',
  p_pincode VARCHAR DEFAULT ''
) RETURNS JSONB AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_user_id UUID;
  v_role VARCHAR;
  v_status VARCHAR;
BEGIN
  SELECT COUNT(*) = 0 INTO v_is_admin FROM users WHERE role = 'admin';
  v_role := CASE WHEN v_is_admin THEN 'admin' ELSE p_role END;
  v_status := CASE WHEN v_role = 'seller' THEN 'pending' ELSE 'approved' END;

  INSERT INTO users (firebase_uid, name, phone, email, password_hash, role, status, business, location, pincode)
  VALUES (p_firebase_uid, p_name, p_phone, p_email, p_password_hash, v_role, v_status, p_business, p_location, p_pincode)
  RETURNING id INTO v_user_id;

  RETURN jsonb_build_object(
    'id', v_user_id,
    'role', v_role,
    'status', v_status,
    'message', CASE WHEN v_role = 'admin' THEN 'Admin account created!' WHEN v_role = 'seller' THEN 'Registration submitted for approval.' ELSE 'Account created successfully!' END
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get marketplace products with seller info
CREATE OR REPLACE FUNCTION get_marketplace_products(p_category VARCHAR DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', sp.id,
      'seller_id', sp.seller_id,
      'name', sp.name,
      'description', sp.description,
      'price_per_kg', sp.price_per_kg,
      'image', sp.image,
      'location', sp.location,
      'daily_stock', sp.daily_stock,
      'category', sp.category,
      'contact_phone', sp.contact_phone,
      'freshness', sp.freshness,
      'created_at', sp.created_at,
      'seller', CASE WHEN u.id IS NOT NULL THEN
        jsonb_build_object('name', u.name, 'location', u.location, 'profile_picture', u.profile_picture)
      ELSE NULL END
    )
    ORDER BY sp.created_at DESC
  ) INTO result
  FROM seller_products sp
  LEFT JOIN users u ON u.id = sp.seller_id
  WHERE sp.status = 'active'
    AND (p_category IS NULL OR p_category = 'All' OR sp.category = p_category);

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- COMPLETE SCHEMA CREATED SUCCESSFULLY
-- ====================================================================
