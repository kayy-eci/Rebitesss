/*
# ReBites marketplace schema

## Overview
Creates the full database for the ReBites food-surplus marketplace:
- profiles (role per user: admin/umkm/buyer)
- plans (subscription tiers for UMKM)
- subscriptions (a UMKM's active/trial plan)
- umkm_profiles (business info + geolocation)
- products (surplus food listings)
- orders (buyer purchases, Midtrans payment)

## Tables
1. profiles — extends auth.users with role, full name, phone, verification flag.
2. plans — subscription packages an admin can manage (name, prices, max products, features, popular flag).
3. subscriptions — links a UMKM to a plan, tracks trial period and billing period.
4. umkm_profiles — business details for users with role 'umkm', includes lat/lng for map, rating.
5. products — surplus food items a UMKM lists (name, prices, stock, status, sell window, delivery/pickup flags, image).
6. orders — a buyer's order for a product (quantity, total, delivery option/address, note, payment + order status, Midtrans order id).

## Security / RLS
- RLS enabled on every table.
- profiles: user reads/updates own row; admins read all. INSERT handled by trigger (not client), but a policy exists for safety.
- plans: public read (anon + authenticated); only admins write.
- subscriptions: a UMKM reads/inserts/updates own subscription; admins read all.
- umkm_profiles: public read (marketplace listing needs it); owner updates own; admins read + update (verification).
- products: public read (browse marketplace); owner UMKM inserts/updates/deletes own; admins update (moderation).
- orders: buyer reads own orders; UMKM reads orders for their products; admin reads all. buyer inserts own; buyer/umkm/admin update within scope.

## Notes
- profiles.role uses a check constraint limited to admin/umkm/buyer.
- umkm_profiles.is_verified defaults false; admin flips it true after review.
- products.surplus_price is the discounted price; original_price is the reference original.
- A trigger auto-creates a profiles row on auth.users insert using new-user metadata.
- Order indexes on buyer_id, umkm_id, product_id for dashboard queries.
*/

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'buyer' CHECK (role IN ('admin','umkm','buyer')),
  phone text,
  avatar_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- plans
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_monthly integer NOT NULL DEFAULT 0,
  price_yearly integer NOT NULL DEFAULT 0,
  max_products integer NOT NULL DEFAULT 10,
  features text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plans_select_public" ON public.plans;
CREATE POLICY "plans_select_public"
ON public.plans FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "plans_insert_admin" ON public.plans;
CREATE POLICY "plans_insert_admin"
ON public.plans FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "plans_update_admin" ON public.plans;
CREATE POLICY "plans_update_admin"
ON public.plans FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "plans_delete_admin" ON public.plans;
CREATE POLICY "plans_delete_admin"
ON public.plans FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- umkm_profiles
CREATE TABLE IF NOT EXISTS public.umkm_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  description text,
  category text,
  address text,
  city text,
  latitude double precision,
  longitude double precision,
  logo_url text,
  is_verified boolean NOT NULL DEFAULT false,
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.umkm_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "umkm_select_public" ON public.umkm_profiles;
CREATE POLICY "umkm_select_public"
ON public.umkm_profiles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "umkm_insert_own" ON public.umkm_profiles;
CREATE POLICY "umkm_insert_own"
ON public.umkm_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "umkm_update_own_or_admin" ON public.umkm_profiles;
CREATE POLICY "umkm_update_own_or_admin"
ON public.umkm_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "umkm_delete_own" ON public.umkm_profiles;
CREATE POLICY "umkm_delete_own"
ON public.umkm_profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  umkm_id uuid NOT NULL REFERENCES public.umkm_profiles(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','expired','cancelled')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subs_select_own_or_admin" ON public.subscriptions;
CREATE POLICY "subs_select_own_or_admin"
ON public.subscriptions FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "subs_insert_own" ON public.subscriptions;
CREATE POLICY "subs_insert_own"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid())
);

DROP POLICY IF EXISTS "subs_update_own_or_admin" ON public.subscriptions;
CREATE POLICY "subs_update_own_or_admin"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  umkm_id uuid NOT NULL REFERENCES public.umkm_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Lainnya',
  original_price integer NOT NULL DEFAULT 0,
  surplus_price integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','sold_out','hidden')),
  image_url text,
  sell_window_start text,
  sell_window_end text,
  is_delivery boolean NOT NULL DEFAULT true,
  is_pickup boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
ON public.products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "products_insert_own" ON public.products;
CREATE POLICY "products_insert_own"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid())
);

DROP POLICY IF EXISTS "products_update_own_or_admin" ON public.products;
CREATE POLICY "products_update_own_or_admin"
ON public.products FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "products_delete_own" ON public.products;
CREATE POLICY "products_delete_own"
ON public.products FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid())
);

-- orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  umkm_id uuid NOT NULL REFERENCES public.umkm_profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL DEFAULT 0,
  delivery_option text NOT NULL DEFAULT 'pickup' CHECK (delivery_option IN ('delivery','pickup')),
  delivery_address text,
  note text,
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','failed','refunded')),
  order_status text NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending','paid','preparing','ready','completed','cancelled','refunded')),
  midtrans_order_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_umkm ON public.orders(umkm_id);
CREATE INDEX IF NOT EXISTS idx_orders_product ON public.orders(product_id);

DROP POLICY IF EXISTS "orders_select_participants" ON public.orders;
CREATE POLICY "orders_select_participants"
ON public.orders FOR SELECT
TO authenticated
USING (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "orders_update_participants" ON public.orders;
CREATE POLICY "orders_update_participants"
ON public.orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed default plans
INSERT INTO public.plans (name, price_monthly, price_yearly, max_products, features, is_popular)
VALUES
  ('Starter', 0, 0, 5, ARRAY['Maksimal 5 produk','Kelola stok & harga','Riwayat penjualan 30 hari','Dasbor UMKM'], false),
  ('Berkembang', 49000, 490000, 25, ARRAY['Maksimal 25 produk','Kelola stok & harga','Riwayat penjualan tanpa batas','Prioritas tampil di marketplace','Laporan penjualan lanjutan','Lencana UMKM Terverifikasi'], true),
  ('Premium', 99000, 990000, 100, ARRAY['Produk tak terbatas','Semua fitur Berkembang','Promosi posisi unggulan','Analitik tren permintaan','Dukungan prioritas','API integrasi kasir'], false)
ON CONFLICT DO NOTHING;
