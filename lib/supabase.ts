'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { DATA_SOURCE } from './data-source';
import { supabase as localSupabaseClient } from './local/supabase-mock';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Mode lokal (lihat lib/data-source.ts): selama backend Supabase belum siap,
 * semua panggilan `supabase.*` diarahkan ke mock localStorage sehingga
 * aplikasi berjalan normal. Logic Supabase asli tidak diubah — begitu
 * DATA_SOURCE kembali ke 'supabase'/'auto' + env terisi, query nyata
 * dipakai lagi otomatis.
 */
const useLocalBackend =
  DATA_SOURCE === 'local' || (DATA_SOURCE === 'auto' && !hasSupabaseConfig);

if (!useLocalBackend && !hasSupabaseConfig) {
  // Tandai di window agar UI bisa menampilkan banner, bukan gagal diam-diam.
  if (typeof window !== 'undefined') {
    (window as unknown as { __REBITES_SUPABASE_MISCONFIG__?: boolean }).__REBITES_SUPABASE_MISCONFIG__ = true;
  }
  console.error(
    '[ReBites] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY tidak ditemukan. ' +
      'Katalog produk akan kosong. Pastikan file .env.local ada di root project lalu restart dev server.'
  );
}

let client: SupabaseClient;

if (useLocalBackend) {
  client = localSupabaseClient;
} else {
  client = createClient(
    supabaseUrl ?? 'http://localhost:54321',
    supabaseAnonKey ?? 'public-anon-key-placeholder',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}

export const supabase = client;
