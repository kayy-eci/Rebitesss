'use client';

import { supabase } from './supabase';

export interface FollowedStore {
  umkmId: string;
  slug: string | null;
  name: string;
  logoUrl: string | null;
  category: string | null;
  rating: number;
}

async function getSessionUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

/** Resolusi identifier toko (slug atau uuid) -> uuid umkm_profiles. */
async function resolveUmkmId(key: string): Promise<string | null> {
  const trimmed = key.trim();
  if (!trimmed) return null;
  const { data } = await supabase
    .from('umkm_profiles')
    .select('id')
    .or(`slug.eq.${trimmed},id.eq.${trimmed}`)
    .maybeSingle();
  return data?.id ?? null;
}

export async function isFollowingStore(key: string): Promise<boolean> {
  try {
    const userId = await getSessionUserId();
    if (!userId) return false;
    const umkmId = await resolveUmkmId(key);
    if (!umkmId) return false;
    const { data } = await supabase
      .from('store_follows')
      .select('id')
      .eq('user_id', userId)
      .eq('umkm_id', umkmId)
      .maybeSingle();
    return Boolean(data);
  } catch {
    // Tabel belum dimigrasi / offline -> anggap tidak mengikuti.
    return false;
  }
}

/** Set/unset status follow. Return true bila operasi berhasil disimpan. */
export async function setFollowingStore(
  key: string,
  follow: boolean
): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) {
    window.location.href = '/auth/login';
    return false;
  }
  const umkmId = await resolveUmkmId(key);
  if (!umkmId) return false;

  if (follow) {
    const { data: existing } = await supabase
      .from('store_follows')
      .select('id')
      .eq('user_id', userId)
      .eq('umkm_id', umkmId)
      .maybeSingle();
    if (existing) return true;
    const { error } = await supabase
      .from('store_follows')
      .insert({ user_id: userId, umkm_id: umkmId });
    if (error) {
      console.error('[store-follows] gagal mengikuti toko:', error.message);
      return false;
    }
    return true;
  }

  const { error } = await supabase
    .from('store_follows')
    .delete()
    .eq('user_id', userId)
    .eq('umkm_id', umkmId);
  if (error) {
    console.error('[store-follows] gagal berhenti mengikuti:', error.message);
    return false;
  }
  return true;
}

type FollowRow = Record<string, any>;

export async function getFollowedStores(): Promise<FollowedStore[]> {
  try {
    const userId = await getSessionUserId();
    if (!userId) return [];
    const { data, error } = await supabase
      .from('store_follows')
      .select(
        'created_at, umkm_profiles(id, slug, business_name, logo_url, category, rating)'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row: FollowRow) => {
      const umkm = row.umkm_profiles as
        | {
            id: string;
            slug: string | null;
            business_name: string | null;
            logo_url: string | null;
            category: string | null;
            rating: number | null;
          }
        | null;
      return {
        umkmId: umkm?.id ?? '',
        slug: umkm?.slug ?? null,
        name: umkm?.business_name ?? 'Toko',
        logoUrl: umkm?.logo_url ?? null,
        category: umkm?.category ?? null,
        rating: Number(umkm?.rating ?? 5),
      };
    });
  } catch {
    return [];
  }
}
