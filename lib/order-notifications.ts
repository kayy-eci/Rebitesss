'use client';

import { supabase } from './supabase';
import type { StoredOrder } from './types';
import { createNotification } from './notification-storage';

const NOTIFIED_ORDERS_KEY = 'rebites-notified-orders';

function getNotifiedOrderIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(NOTIFIED_ORDERS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function markOrderNotified(orderId: string): void {
  if (typeof window === 'undefined') return;
  const ids = getNotifiedOrderIds();
  ids.add(orderId);
  window.localStorage.setItem(
    NOTIFIED_ORDERS_KEY,
    JSON.stringify(Array.from(ids))
  );
}

export async function notifyOrderCompleted(order: StoredOrder): Promise<void> {
  if (!order.userId) return;

  const notified = getNotifiedOrderIds();
  if (notified.has(order.orderId)) return;

  await createNotification({
    userId: order.userId,
    role: 'buyer',
    type: 'order_completed',
    title: 'Pesanan Selesai!',
    message: `Pesanan #${order.orderId} (${order.productName}) dari ${order.vendorName} telah selesai. Selamat menikmati!`,
    referenceId: order.orderId,
    href: '/riwayatPesanan',
  });

  markOrderNotified(order.orderId);
}

export async function notifyNewReview(input: {
  umkmId?: string;
  orderCode: string;
  productName: string;
  rating: number;
  authorName: string;
}): Promise<void> {
  let umkmId = input.umkmId;
  if (!umkmId) {
    const { data: order } = await supabase
      .from('orders')
      .select('umkm_id')
      .eq('order_code', input.orderCode)
      .maybeSingle();
    umkmId = (order as Record<string, any>)?.umkm_id ?? undefined;
  }
  if (!umkmId) return;
  const { data } = await supabase
    .from('umkm_profiles')
    .select('user_id')
    .eq('id', umkmId)
    .maybeSingle();
  const sellerUserId = (data as Record<string, any>)?.user_id;
  if (!sellerUserId) return;

  await createNotification({
    userId: sellerUserId,
    role: 'seller',
    type: 'new_review',
    title: 'Ulasan Baru Diterima!',
    message: `${input.authorName} memberi ${input.rating}★ untuk ${input.productName} (pesanan #${input.orderCode})`,
    referenceId: input.orderCode,
    href: '/dashboard/penjual/ulasan',
  });
}
