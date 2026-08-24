'use client';

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

export function notifyOrderCompleted(order: StoredOrder): void {
  if (!order.userId) return;

  const notified = getNotifiedOrderIds();
  if (notified.has(order.orderId)) return;

  createNotification({
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
