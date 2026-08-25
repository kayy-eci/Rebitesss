-- ============================================================================
-- CLEANUP DEV: reset schema public ke kondisi kosong
-- Jalankan sekali di SQL Editor dashboard Supabase.
-- PERINGATAN: menghapus SEMUA tabel & data di schema public. Hanya untuk
-- project development yang belum punya data produksi!
-- ============================================================================

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Restore hak akses default khas Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Bersihkan riwayat migration supaya db push jalan ulang dari awal
DELETE FROM supabase_migrations.schema_migrations;

-- (Opsional) hapus bucket lama kalau sempat dibuat eksperimen
DELETE FROM storage.objects WHERE bucket_id IN ('product-images','avatars');
DELETE FROM storage.buckets WHERE id IN ('product-images','avatars');
