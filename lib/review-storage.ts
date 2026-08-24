'use client';

import { supabase } from './supabase';
import type { OrderReview } from './types';

type ReviewRow = Record<string, any>;

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
