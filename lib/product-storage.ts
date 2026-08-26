'use client';

import { supabase } from './supabase';

export const SELLER_VENDOR_SLUG = 'dapur-ibu-tini';
export const SELLER_VENDOR_NAME = 'Dapur Ibu Tini';

export const PRODUCTS_UPDATED_EVENT = 'rebites-seller-products-updated';

export interface SellerProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  originalPrice: number;
  surplusPrice: number;
  discountPercent: number;
  stock: number;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  isSurplusToday: boolean;
  featured?: boolean;
  flashSale?: {
    price: number;
    startIso: string;
    endIso: string;
  } | null;
  createdAt: string;
}

export interface SellerUmkm {
  id: string;
  slug: string | null;
  businessName: string;
}

type ProductRow = Record<string, any>;

function dispatchUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

function rowToSellerProduct(row: ProductRow): SellerProduct {
  return {
    id: row.slug ?? row.id,
    name: row.name ?? '',
    category: row.category ?? 'Lainnya',
    description: row.description ?? '',
    image: row.image_url ?? '/foods/ikansayur.jpg',
    originalPrice: row.original_price ?? 0,
    surplusPrice: row.surplus_price ?? 0,
    discountPercent: row.discount_percent ?? 0,
    stock: row.stock ?? 0,
    startTime: (row.sell_window_start ?? '09:00').slice(0, 5),
    endTime: (row.sell_window_end ?? '21:00').slice(0, 5),
    allDay: row.all_day ?? false,
    isSurplusToday: row.is_surplus_today ?? true,
    featured: row.featured ?? false,
    flashSale:
      row.flash_sale_price != null
        ? {
            price: Number(row.flash_sale_price),
            startIso: row.flash_sale_start,
            endIso: row.flash_sale_end,
          }
        : null,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function sellerProductToRow(product: Partial<SellerProduct>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (product.name !== undefined) payload.name = product.name;
  if (product.category !== undefined) payload.category = product.category;
  if (product.description !== undefined) payload.description = product.description;
  if (product.image !== undefined) payload.image_url = product.image;
  if (product.originalPrice !== undefined) payload.original_price = product.originalPrice;
  if (product.surplusPrice !== undefined) payload.surplus_price = product.surplusPrice;
  if (product.discountPercent !== undefined) payload.discount_percent = product.discountPercent;
  if (product.stock !== undefined) {
    payload.stock = product.stock;
    payload.status = product.stock > 0 ? 'available' : 'sold_out';
  }
  if (product.startTime !== undefined) payload.sell_window_start = product.startTime;
  if (product.endTime !== undefined) payload.sell_window_end = product.endTime;
  if (product.allDay !== undefined) payload.all_day = product.allDay;
  if (product.isSurplusToday !== undefined) payload.is_surplus_today = product.isSurplusToday;
  if (product.featured !== undefined) payload.featured = product.featured;
  if (product.flashSale !== undefined) {
    payload.flash_sale_price = product.flashSale?.price ?? null;
    payload.flash_sale_start = product.flashSale?.startIso ?? null;
    payload.flash_sale_end = product.flashSale?.endIso ?? null;
  }
  return payload;
}

/** UMKM milik user yang sedang login. */
export async function getSellerUmkm(): Promise<SellerUmkm | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from('umkm_profiles')
    .select('id, slug, business_name')
    .eq('user_id', uid)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    slug: data.slug ?? null,
    businessName: data.business_name ?? '',
  };
}

export async function getSellerProducts(): Promise<SellerProduct[]> {
  const umkm = await getSellerUmkm();
  if (!umkm) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('umkm_id', umkm.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[product-storage] gagal memuat produk:', error.message);
    return [];
  }
  return (data ?? []).map(rowToSellerProduct);
}

/** Produk milik satu toko (UMKM) berdasarkan slug/id routing, bukan sesi viewer. */
export async function getStoreProductsBySlug(
  slug: string
): Promise<{ products: SellerProduct[]; error: string | null }> {
  if (!slug) return { products: [], error: null };

  const STORE_LOAD_ERROR = 'Gagal memuat produk toko.';

  // Resolusi slug → id UMKM (relasi resmi products.umkm_id).
  const bySlug = await supabase
    .from('umkm_profiles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (bySlug.error) {
    console.error('[product-storage] gagal resolusi slug toko:', bySlug.error.message);
    return { products: [], error: STORE_LOAD_ERROR };
  }
  let umkmId: string | null = bySlug.data?.id ?? null;

  if (!umkmId) {
    // Vendor tanpa slug memakai id sebagai identitas routing.
    const byId = await supabase
      .from('umkm_profiles')
      .select('id')
      .eq('id', slug)
      .maybeSingle();
    if (byId.error) {
      console.error('[product-storage] gagal resolusi id toko:', byId.error.message);
      return { products: [], error: STORE_LOAD_ERROR };
    }
    umkmId = byId.data?.id ?? null;
  }

  if (!umkmId) return { products: [], error: null };

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('umkm_id', umkmId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[product-storage] gagal memuat produk toko:', error.message);
    return { products: [], error: STORE_LOAD_ERROR };
  }
  return { products: (data ?? []).map(rowToSellerProduct), error: null };
}

export async function getSellerProductCount(): Promise<number> {
  const products = await getSellerProducts();
  return products.length;
}

function generateProductSlug(): string {
  return `prd-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Filter ownership: produk HARUS milik UMKM user aktif. id klien tidak dipercaya mentah. */
function ownProductMatch(umkmId: string, productId: string): Record<string, unknown> {
  // Identifier bisa berupa slug (row baru) atau uuid (row legacy tanpa slug).
  return UUID_RE.test(productId)
    ? { umkm_id: umkmId, id: productId }
    : { umkm_id: umkmId, slug: productId };
}

export async function saveSellerProduct(
  input: Omit<SellerProduct, 'id' | 'createdAt'>
): Promise<SellerProduct | null> {
  const umkm = await getSellerUmkm();
  if (!umkm) {
    console.error('[product-storage] tidak ada profil UMKM untuk user ini.');
    return null;
  }

  const payload = {
    umkm_id: umkm.id,
    slug: generateProductSlug(),
    ...sellerProductToRow({ ...input, flashSale: input.flashSale ?? null }),
  };

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .maybeSingle();
  if (error || !data) {
    console.error('[product-storage] gagal menyimpan produk:', error?.message);
    return null;
  }
  dispatchUpdated();
  return rowToSellerProduct(data);
}

export async function patchSellerProduct(
  productId: string,
  patch: Partial<Omit<SellerProduct, 'id'>>
): Promise<SellerProduct | undefined> {
  const umkm = await getSellerUmkm();
  if (!umkm) {
    console.error('[product-storage] tidak ada profil UMKM untuk user ini.');
    return undefined;
  }
  const { data, error } = await supabase
    .from('products')
    .update(sellerProductToRow(patch))
    .match(ownProductMatch(umkm.id, productId))
    .select()
    .maybeSingle();
  if (error || !data) {
    console.error('[product-storage] gagal update produk:', error?.message ?? 'produk bukan milik toko ini.');
    return undefined;
  }
  dispatchUpdated();
  return rowToSellerProduct(data);
}

export async function deleteSellerProduct(productId: string): Promise<void> {
  const umkm = await getSellerUmkm();
  if (!umkm) {
    console.error('[product-storage] tidak ada profil UMKM untuk user ini.');
    return;
  }
  const { error } = await supabase
    .from('products')
    .delete()
    .match(ownProductMatch(umkm.id, productId));
  if (error) {
    console.error('[product-storage] gagal menghapus produk:', error.message);
    return;
  }
  dispatchUpdated();
}

export async function getFeaturedProductIds(): Promise<string[]> {
  const products = await getSellerProducts();
  return products.filter((p) => p.featured).map((p) => p.id);
}

export async function getSellerProductById(id: string): Promise<SellerProduct | undefined> {
  const products = await getSellerProducts();
  return products.find((p) => p.id === id);
}

/** Upload foto produk ke Supabase Storage, kembalikan URL publik. */
export async function uploadProductImage(
  file: File | Blob,
  fileName?: string
): Promise<string | null> {
  const umkm = await getSellerUmkm();
  const folder = umkm?.id ?? 'misc';
  const safeName = (fileName ?? (file as File).name ?? 'menu.jpg').replace(/[^\w.\-]+/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('[product-storage] upload foto gagal:', error.message);
    return null;
  }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl ?? null;
}

// ---- util murni (tetap sinkron) ----

export function isProductAvailable(product: SellerProduct): boolean {
  if (product.stock <= 0) return false;
  if (product.allDay) return true;
  return isWithinSaleWindow(product.startTime, product.endTime);
}

export function isWithinSaleWindow(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start <= end) {
    return currentMinutes >= start && currentMinutes < end;
  }
  return currentMinutes >= start || currentMinutes < end;
}

function parseTimeToMinutes(time: string): number {
  const match = time.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}
