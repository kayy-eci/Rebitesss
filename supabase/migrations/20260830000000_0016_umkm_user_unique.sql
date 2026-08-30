-- ============================================================================
-- 0016: Unique constraint umkm_profiles.user_id
--
--   Masalah: tabel umkm_profiles tidak punya unique constraint pada
--   user_id, sehingga satu user bisa memiliki lebih dari satu row toko
--   (mis. double-submit saat registrasi). Dampaknya getSellerUmkm() yang
--   semula memakai .maybeSingle() selalu error bila ada 2 row, dan user
--   yang sudah punya toko terus dialihkan ke halaman registrasi ulang.
--
--   1. Hapus row duplikat - untuk tiap user_id sisakan toko TERBARU
--      (child rows: products, subscriptions, orders, reviews, follows,
--      dst. ikut terhapus via ON DELETE CASCADE).
--   2. Tambahkan UNIQUE (user_id) agar duplikat tidak bisa terbentuk lagi.
--      Guard sisi klien juga sudah di-hardening, constraint ini pengaman
--      di sisi database.
--
--   Idempoten: aman dijalankan berulang.
-- ============================================================================

-- 1. Hapus duplikat: simpan hanya row dengan created_at terbaru per user_id
DELETE FROM public.umkm_profiles a
USING public.umkm_profiles b
WHERE a.user_id = b.user_id
  AND a.id <> b.id
  AND (a.created_at, a.id) < (b.created_at, b.id);

-- 2. Kunci: satu user maksimal satu toko
ALTER TABLE public.umkm_profiles
  DROP CONSTRAINT IF EXISTS umkm_profiles_user_id_key;
ALTER TABLE public.umkm_profiles
  ADD CONSTRAINT umkm_profiles_user_id_key UNIQUE (user_id);
