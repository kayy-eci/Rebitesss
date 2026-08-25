/**
 * Saklar sumber data aplikasi.
 *
 * - 'local'    : pakai data & penyimpanan bawaan frontend (localStorage + dataset statis).
 *                Dipakai sementara selama backend Supabase belum selesai.
 * - 'supabase' : paksa semua query lewat Supabase.
 * - 'auto'     : pakai Supabase hanya jika NEXT_PUBLIC_SUPABASE_URL/ANON_KEY terisi,
 *                selain itu fallback ke local.
 *
 * KETIKA API SUPABASE TEMAN SUDAH SELESAI:
 * cukup ubah baris di bawah menjadi `export const DATA_SOURCE: DataSourceMode = 'supabase';`
 * (atau isi .env.local lalu set 'auto'). Tidak ada file lain yang perlu diubah.
 */
export type DataSourceMode = 'auto' | 'local' | 'supabase';

export const DATA_SOURCE: DataSourceMode = 'auto';
