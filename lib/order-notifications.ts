'use client';

/**
 * Helper untuk membuat notifikasi terkait pesanan.
 * Dipanggil dari order-storage (auto-complete) dan
 * dashboard penjual (manual complete) untuk menghindari duplikasi.
 */

import type { StoredOrder } from './types';
import { createNotification } from './notification-storage';

/**
 * Tandai order sudah diberi notifikasi "selesai" agar tidak duplikat.
 * Disimpan di field custom `completedNotified` pada order patch.
 */
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

/**
 * Buat notifikasi "pesanan selesai" untuk pembeli jika belum pernah dikirim.
 * Aman dipanggil berkali-kali — hanya membuat notifikasi sekali per orderId.
 */
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
