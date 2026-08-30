-- ============================================================================
-- 0013: Integrasi Xendit (payment gateway)
--
-- - Tambah kolom xendit_invoice_id di orders & subscriptions (+ index unique)
-- - Longgarkan CHECK status di subscriptions untuk nilai 'pending'
-- - Fungsi release_stock (kebalikan reserve_stock) untuk refund stok
-- - Guard trigger: cegah client mengubah payment_status sendiri - hanya
--   service_role/webhook yang boleh set paid/failed/refunded
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Orders: kolom Xendit
-- ----------------------------------------------------------------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS xendit_invoice_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_xendit_invoice
  ON public.orders(xendit_invoice_id)
  WHERE xendit_invoice_id IS NOT NULL;

-- Kolom midtrans_order_id tetap ada (kompatibilitas), tapi alur baru
-- memakai xendit_invoice_id sebagai external_id.

-- ----------------------------------------------------------------------------
-- 2. Subscriptions: kolom Xendit + status 'pending'
-- ----------------------------------------------------------------------------
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS xendit_invoice_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subs_xendit_invoice
  ON public.subscriptions(xendit_invoice_id)
  WHERE xendit_invoice_id IS NOT NULL;

-- Tambah kolom failed info (opsional, untuk debug webhook)
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS xendit_status text;

-- CHECK lama: status IN ('trial','active','expired','cancelled')
-- Perlu ditambah 'pending' untuk flow: checkout -> pending -> paid/active.
DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'public.subscriptions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%trial%'
  LIMIT 1;

  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.subscriptions DROP CONSTRAINT %I', cname);
  END IF;
END $$;

-- Recreate dengan 'pending' ditambahkan - idempotent (drop recreated variant jika sudah ada)
DO $$
DECLARE
  cname text;
BEGIN
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'public.subscriptions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%pending%'
  LIMIT 1;

  IF cname IS NULL THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_status_check
      CHECK (status IN ('trial','active','expired','cancelled','pending'));
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 3. release_stock: kebalikan dari reserve_stock
--    Dipanggil webhook saat invoice expired/cancelled untuk refund stok.
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.release_stock(text, integer);

CREATE OR REPLACE FUNCTION public.release_stock(p_slug text, p_quantity integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN false;
  END IF;

  UPDATE public.products
     SET stock = stock + p_quantity,
         sold_count = GREATEST(0, sold_count - p_quantity),
         status = CASE
           WHEN stock + p_quantity > 0 AND status = 'sold_out' THEN 'available'
           ELSE status
         END
   WHERE slug = p_slug;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated = 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.release_stock(text, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.release_stock(text, integer) TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 4. Guard trigger: cegah client mengubah payment_status sendiri
--
-- Policy RLS "orders_update_participants" memperbolehkan buyer/update
-- siapa saja yang menjadi peserta order. Tanpa guard, buyer bisa
-- SET payment_status='paid' langsung dari browser dan mendapat order gratis.
-- Guard ini memastikan hanya service_role (webhook) yang boleh merubah
-- payment_status dari 'unpaid' ke nilai lain. authenticated yang mencoba
-- akan dapat exception.
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS orders_guard_payment_status ON public.orders;
DROP FUNCTION IF EXISTS public.orders_guard_payment_status();

CREATE OR REPLACE FUNCTION public.orders_guard_payment_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hanya cek saat payment_status berubah
  IF NEW.payment_status IS NOT DISTINCT FROM OLD.payment_status THEN
    RETURN NEW;
  END IF;

  -- service_role selalu boleh (webhook)
  IF current_user = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- postgres / supabase_admin juga boleh (migration / dashboard)
  IF current_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  -- User biasa mencoba merubah payment_status -> blokir
  RAISE EXCEPTION 'payment_status hanya dapat diubah oleh sistem pembayaran (Xendit webhook). Hubungi admin jika ini kesalahan.';
END;
$$;

CREATE TRIGGER orders_guard_payment_status
BEFORE UPDATE OF payment_status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.orders_guard_payment_status();
