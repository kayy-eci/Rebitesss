'use client';

import { supabase } from './supabase';
import type { OrderReview } from './types';
import type { Review } from '@/app/detail/product/data';

type ReviewRow = Record<string, any>;

function rowToDisplayReview(row: ReviewRow): Review {
  const created = row.created_at ? new Date(row.created_at) : null;
  return {
    id: String(row.id ?? ''),
    reviewerName: row.author_name?.trim() || 'Pembeli ReBites',
    avatar: row.author_avatar ?? '',
    rating: Number(row.rating ?? 5),
    comment: row.comment ?? '',
    date: created
      ? created.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
  };
}

async function resolveProductId(slug: string): Promise<string | null> {
  if (!slug) return null;
  const { data } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  return data?.id ?? null;
}

async function resolveUmkmId(slug: string): Promise<string | null> {
  if (!slug) return null;
  const { data } = await supabase
    .from('umkm_profiles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  return data?.id ?? null;
}

/** Ulasan produk (kind='product') untuk halaman detail produk. */
export async function getProductReviews(
  productSlug: string
): Promise<Review[]> {
  const productId = await resolveProductId(productSlug);
  if (!productId) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(12);
  if (error || !data) return [];
  return data.map(rowToDisplayReview);
}

/** Ulasan layanan toko (kind='service') untuk halaman detail toko. */
export async function getServiceReviews(storeSlug: string): Promise<Review[]> {
  const umkmId = await resolveUmkmId(storeSlug);
  if (!umkmId) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('umkm_id', umkmId)
    .eq('kind', 'service')
    .order('created_at', { ascending: false })
    .limit(9);
  if (error || !data) return [];
  return data.map(rowToDisplayReview);
}

/** Jumlah ulasan atas toko milik user yang sedang login (semua kind). */
export async function getSellerProductReviewCount(): Promise<number> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) return 0;
  const umkm = await supabase
    .from('umkm_profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();
  if (!umkm.data) return 0;
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('umkm_id', (umkm.data as Record<string, any>).id);
  if (error) return 0;
  return count ?? 0;
}

function rowToOrderReview(row: ReviewRow): OrderReview {
  return {
    orderId: row.order_code ?? '',
    userId: row.user_id,
    rating: Number(row.rating),
    comment: row.comment ?? '',
    createdAt: row.created_at,
  };
}

export async function getReviewFor(
  orderId: string,
  userId: string
): Promise<OrderReview | undefined> {
  if (!orderId || !userId) return undefined;
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('order_code', orderId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return undefined;
  return rowToOrderReview(data);
}

export async function saveReview(review: OrderReview): Promise<void> {
  const { error } = await supabase.from('reviews').upsert(
    {
      order_code: review.orderId,
      user_id: review.userId,
      kind: 'product',
      rating: review.rating,
      comment: review.comment,
    },
    { onConflict: 'user_id,order_code' }
  );
  if (error) {
    console.error('[review-storage] gagal menyimpan review:', error.message);
    throw error;
  }
}
