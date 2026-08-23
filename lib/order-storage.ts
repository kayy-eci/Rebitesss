'use client';

import type { StoredOrder } from './types';
import { notifyOrderCompleted } from './order-notifications';

/**
 * Penyimpanan order berbasis localStorage — SATU sumber data untuk
 * checkout, halaman sukses, dan Order Center (Riwayat Pesanan).
 *
 * Setiap order menyimpan `userId` pembeli; pembacaan riwayat selalu
 * difilter per-user sehingga order tidak bocor antar akun.
 */

const ORDERS_KEY = 'rebites-orders';
export const ORDERS_UPDATED_EVENT = 'rebites-orders-updated';
const MAX_ORDERS = 60;

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RB-${stamp}${rand}`;
}

function readOrders(): StoredOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    /* Abaikan entri rusak agar daftar tetap konsisten. */
    return parsed.filter(
      (item): item is StoredOrder =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as StoredOrder).orderId === 'string' &&
        typeof (item as StoredOrder).createdAt === 'string'
    );
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]): void {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, MAX_ORDERS)));
  window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
}

export function saveOrder(order: StoredOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = readOrders();
    const next = [order, ...existing].slice(0, MAX_ORDERS);
    writeOrders(next);
  } catch {
    // Storage penuh/korup — jangan blokir alur checkout.
  }
}export function getOrderById(orderId: string): StoredOrder | undefined {
  return readOrders().find((order) => order.orderId === orderId);
}

/** Semua order milik satu user — basis Riwayat Pesanan. */
export function getUserOrders(userId: string | null | undefined): StoredOrder[] {
  if (!userId) return [];
  return readOrders().filter((order) => order.userId === userId);
}

/** Semua order perangkat ini — basis daftar Pesanan Masuk penjual. */
export function getAllOrders(): StoredOrder[] {
  return readOrders();
}

/** Patch sebagian field order (mis. status → completed). Emit event bila berubah. */
export function patchOrder(
  orderId: string,
  patch: Partial<StoredOrder>
): StoredOrder | undefined {
  if (typeof window === 'undefined') return undefined;
  const orders = readOrders();
  let updated: StoredOrder | undefined;
  const next = orders.map((order) => {
    if (order.orderId !== orderId) return order;
    updated = { ...order, ...patch };
    return updated;
  });
  if (updated) writeOrders(next);
  return updated;
}

/**
 * Sweep idempotent: order `ongoing` yang sudah melewati
 * `estimatedCompletionAt` otomatis menjadi `completed` beserta
 * `completedAt`. Aman dipanggil berkali-kali — hanya menulis saat ada
 * perubahan, sehingga status tetap benar walau browser ditutup lama
 * (refresh/tab ditutup/user offline).
 */
export function completeExpiredOrders(): boolean {
  if (typeof window === 'undefined') return false;
  const orders = readOrders();
  const now = Date.now();
  let changed = false;

  const next = orders.map((order) => {
    if (
      order.status !== 'ongoing' ||
      !order.estimatedCompletionAt ||
      now < new Date(order.estimatedCompletionAt).getTime()
    ) {
      return order;
    }
    changed = true;
    return {
      ...order,
      status: 'completed' as const,
      completedAt: order.estimatedCompletionAt,
    };
  });

  if (changed) {
    try {
      writeOrders(next);
    } catch {
      return false;
    }
    // Buat notifikasi untuk pesanan yang baru saja selesai
    for (const order of next) {
      if (order.status === 'completed' && order.userId) {
        notifyOrderCompleted(order);
      }
    }
  }
  return changed;
}
