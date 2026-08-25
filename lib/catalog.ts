'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { FoodItem, PromoCode, UrgentItem, UrgentSlot, Vendor } from './types';

export interface CatalogData {
  foodItems: FoodItem[];
  urgentItems: UrgentItem[];
  vendors: Vendor[];
  /** Pesan error pertama saat memuat katalog (null = sukses). */
  error: string | null;
}

const EMPTY_CATALOG: CatalogData = {
  foodItems: [],
  urgentItems: [],
  vendors: [],
  error: null,
};

type ProductRow = Record<string, any>;
type UmkmRow = Record<string, any>;

function parseStockFromLabel(label: string | null | undefined, fallback: number): number {
  const match = (label ?? '').match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function productToFoodItem(row: ProductRow): FoodItem {
  return {
    id: row.slug ?? row.id,
    name: row.name ?? '',
    vendorName: row.umkm?.business_name ?? '',
    image: row.image_url ?? '/foods/ikansayur.jpg',
    category: row.category ?? 'Lainnya',
    rating: Number(row.rating ?? 5),
    distanceKm: Number(row.distance_km ?? 1),
    availableFrom: (row.sell_window_start ?? '09:00').slice(0, 5),
    availableTo: (row.sell_window_end ?? '21:00').slice(0, 5),
    stockLabel:
      row.stock_label ?? `${row.stock ?? 0} porsi tersisa`,
    originalPrice: row.original_price ?? 0,
    discountedPrice: row.surplus_price ?? 0,
    discountPercent: row.discount_percent ?? 0,
    expiresAt: row.expires_at ?? undefined,
  };
}

function umkmToVendor(row: UmkmRow, itemCount: number): Vendor {
  return {
    id: row.slug ?? row.id,
    name: row.business_name ?? '',
    image:
      row.logo_url ??
      'https://images.pexels.com/photos/37193132/pexels-photo-37193132.jpeg?auto=compress&cs=tinysrgb&w=800',
    isRescuePartner: row.is_rescue_partner ?? false,
    rating: Number(row.rating ?? 5),
    distanceKm: Number(row.distance_km ?? 1),
    category: row.category ?? 'Makanan Berat',
    itemCount,
    address: row.address ?? '',
    openHours: row.open_hours ?? '09.00–21.00',
    description: row.description ?? '',
  };
}

type FetchResult<T> = { items: T[]; error: string | null };

export async function fetchFoodItems(): Promise<FoodItem[]> {
  return (await queryFoodItems()).items;
}

async function queryFoodItems(): Promise<FetchResult<FoodItem>> {
  const { data, error } = await supabase
    .from('products')
    .select('*, umkm:umkm_profiles(business_name)')
    .is('slot', null)
    .eq('status', 'available')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('[catalog] gagal memuat produk:', error.message);
    return { items: [], error: error.message };
  }
  return { items: (data ?? []).map(productToFoodItem), error: null };
}

export async function fetchUrgentItems(): Promise<UrgentItem[]> {
  return (await queryUrgentItems()).items;
}

async function queryUrgentItems(): Promise<FetchResult<UrgentItem>> {
  const { data, error } = await supabase
    .from('products')
    .select('*, umkm:umkm_profiles(business_name)')
    .not('slot', 'is', null)
    .eq('status', 'available')
    .order('expires_at', { ascending: true });
  if (error) {
    console.error('[catalog] gagal memuat urgent deals:', error.message);
    return { items: [], error: error.message };
  }
  return {
    items: (data ?? []).map((row) => ({
      ...productToFoodItem(row),
      expiresAt:
        row.expires_at ?? new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      slot: (row.slot ?? '09-12') as UrgentSlot,
    })),
    error: null,
  };
}

export async function fetchVendors(): Promise<Vendor[]> {
  return (await queryVendors()).items;
}

async function queryVendors(): Promise<FetchResult<Vendor>> {
  const [umkmResult, productResult] = await Promise.all([
    supabase.from('umkm_profiles').select('*').order('rating', { ascending: false }),
    supabase.from('products').select('umkm_id'),
  ]);
  if (umkmResult.error) {
    console.error('[catalog] gagal memuat vendor:', umkmResult.error.message);
    return { items: [], error: umkmResult.error.message };
  }

  const counts = new Map<string, number>();
  for (const p of productResult.data ?? []) {
    counts.set(p.umkm_id, (counts.get(p.umkm_id) ?? 0) + 1);
  }
  return {
    items: (umkmResult.data ?? []).map((row: UmkmRow) =>
      umkmToVendor(row, counts.get(row.id) ?? 0)
    ),
    error: null,
  };
}

export async function fetchCatalog(): Promise<CatalogData> {
  const [foodResult, urgentResult, vendorResult] = await Promise.all([
    queryFoodItems(),
    queryUrgentItems(),
    queryVendors(),
  ]);
  return {
    foodItems: foodResult.items,
    urgentItems: urgentResult.items,
    vendors: vendorResult.items,
    error:
      foodResult.error ??
      urgentResult.error ??
      vendorResult.error ??
      null,
  };
}

export function useCatalog() {
  const [data, setData] = useState<CatalogData>(EMPTY_CATALOG);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchCatalog();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, loading, refresh };
}

// ---- promo codes ----

function rowToPromoCode(row: Record<string, any>): PromoCode {
  return {
    code: row.code,
    percentOff: row.percent_off,
    isValid: Boolean(row.is_valid),
  };
}

export async function getValidPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('is_valid', true);
  if (error) {
    console.error('[catalog] gagal memuat promo codes:', error.message);
    return [];
  }
  return (data ?? []).map(rowToPromoCode);
}

export async function validatePromoCode(code: string): Promise<PromoCode | null> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', trimmed)
    .eq('is_valid', true)
    .maybeSingle();
  if (error || !data) return null;
  return rowToPromoCode(data);
}
