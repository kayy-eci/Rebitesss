-- Fix infinite recursion in profiles RLS when no admin actor exists
-- Only DDL on policies, no data deletion. Removes OR EXISTS admin checks that caused self-referencing recursion.

-- PROFILES: source of recursion
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Keep insert/update own as is (already non-recursive), ensure they exist
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

-- PLANS: remove admin-only write policies (no admin actor)
DROP POLICY IF EXISTS "plans_insert_admin" ON public.plans;
DROP POLICY IF EXISTS "plans_update_admin" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_admin" ON public.plans;
-- plans_select_public already exists and allows anon/authenticated read, no change

-- UMKM_PROFILES: simplify update (remove OR admin)
DROP POLICY IF EXISTS "umkm_update_own_or_admin" ON public.umkm_profiles;
CREATE POLICY "umkm_update_own"
ON public.umkm_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS
DROP POLICY IF EXISTS "subs_select_own_or_admin" ON public.subscriptions;
CREATE POLICY "subs_select_own"
ON public.subscriptions FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid()));

DROP POLICY IF EXISTS "subs_update_own_or_admin" ON public.subscriptions;
CREATE POLICY "subs_update_own"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = subscriptions.umkm_id AND u.user_id = auth.uid()));

-- PRODUCTS
DROP POLICY IF EXISTS "products_update_own_or_admin" ON public.products;
CREATE POLICY "products_update_own"
ON public.products FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = products.umkm_id AND u.user_id = auth.uid()));

-- ORDERS: remove OR admin
DROP POLICY IF EXISTS "orders_select_participants" ON public.orders;
CREATE POLICY "orders_select_participants"
ON public.orders FOR SELECT
TO authenticated
USING (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
);

DROP POLICY IF EXISTS "orders_update_participants" ON public.orders;
CREATE POLICY "orders_update_participants"
ON public.orders FOR UPDATE
TO authenticated
USING (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = buyer_id
  OR EXISTS (SELECT 1 FROM public.umkm_profiles u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid())
);

-- PROMO_CODES: remove admin write (no admin actor, keep read public)
DROP POLICY IF EXISTS "promo_codes_admin_write" ON public.promo_codes;
-- promo_codes_read_public remains
