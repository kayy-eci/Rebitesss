-- ============================================================================
-- 0019: Perbaikan gagal simpan rating + status progres pesanan penjual
--
--   1. reviews: index unik (user_id, order_code) sebelumnya PARTIAL
--      (WHERE order_code IS NOT NULL). Partial index tidak bisa dipakai
--      sebagai target ON CONFLICT oleh supabase-js (error 42P10), sehingga
--      simpan rating dari halaman riwayat pesanan selalu gagal.
--      Ganti dengan unique index penuh.
--   2. orders.progress_status: status progres yang dikendalikan penjual
--      di dashboard "Pesanan Masuk" (disiapkan -> siap-diambil / diantar
--      -> selesai). NULL = fallback estimasi timer (pesanan lama).
-- ============================================================================

-- 1) reviews: ganti partial index dengan unique index penuh
DROP INDEX IF EXISTS public.reviews_once_per_user_order;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_order_code_once
  ON public.reviews(user_id, order_code);

-- 2) orders: kolom status progres penjual
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS progress_status text
  CHECK (
    progress_status IN ('disiapkan', 'siap-diambil', 'diantar')
    OR progress_status IS NULL
  );

CREATE INDEX IF NOT EXISTS idx_orders_progress_status
  ON public.orders(progress_status);
