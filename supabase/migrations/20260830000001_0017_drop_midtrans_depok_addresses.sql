-- ============================================================================
-- 0017: Bersihkan sisa Midtrans + alamat toko demo ke Depok
--
--   1. Hapus kolom legacy orders.midtrans_order_id — payment gateway kini
--      sepenuhnya Xendit (kolom orders.xendit_invoice_id dipakai sejak 0013).
--      Semua referensi kode ke kolom ini sudah dihapus bersamaan.
--   2. Ganti alamat 3 toko demo (seed 0004, sebelumnya daerah Bogor) ke
--      daerah Kota Depok, konsisten dengan pilihan KECAMATAN_DEPOK di form
--      registrasi penjual.
--
--   Idempoten: aman dijalankan berulang.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Hapus kolom legacy Midtrans
-- ----------------------------------------------------------------------------
ALTER TABLE public.orders
  DROP COLUMN IF EXISTS midtrans_order_id;

-- ----------------------------------------------------------------------------
-- 2. Alamat toko demo -> Kota Depok
-- ----------------------------------------------------------------------------
UPDATE public.umkm_profiles
SET address = 'Jl. Margonda Raya No. 45, Beji, Kota Depok',
    city = 'Beji'
WHERE slug = 'warung-nusantara';

UPDATE public.umkm_profiles
SET address = 'Jl. Nusantara Raya No. 22, Sukmajaya, Kota Depok',
    city = 'Sukmajaya'
WHERE slug = 'dapur-ibu-tini';

UPDATE public.umkm_profiles
SET address = 'Jl. Juanda Raya No. 8, Cimanggis, Kota Depok',
    city = 'Cimanggis'
WHERE slug = 'warkop-pak-iman';
