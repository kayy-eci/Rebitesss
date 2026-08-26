'use client';

import { supabase } from './supabase';

export interface LikedFood {
  id: string;
  name?: string;
}

async function getSessionUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

/**
 * Ambil daftar makanan yang disukai user.
 * Coba query tabel `favorites` atau `liked_foods` jika ada.
 * Jika tabel belum ada / error, fallback ke 0 (jangan hardcode dummy).
 */
export async function getLikedFoods(): Promise<LikedFood[]> {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];

    // Coba beberapa kemungkinan nama tabel agar tidak hardcode salah
    const tables = ['favorites', 'liked_foods', 'product_favorites', 'food_likes'];
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id, product_id, food_id, name')
          .eq('user_id', userId)
          .limit(100);
        if (!error && data) {
          return data.map((row: any) => ({
            id: String(row.id ?? row.product_id ?? row.food_id ?? ''),
            name: row.name ?? undefined,
          }));
        }
      } catch {
        continue;
      }
    }

    // Fallback localStorage jika ada (mis. dari cta-buttons local state)
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('rebites_favorites');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            return arr.map((id: string) => ({ id: String(id) }));
          }
        }
      } catch {
        // ignore
      }
    }

    return [];
  } catch {
    return [];
  }
}
