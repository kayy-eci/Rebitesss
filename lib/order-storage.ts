'use client';

import type { StoredOrder } from './types';

/**
 * Penyimpanan order berbasis localStorage.
 * Dipakai untuk halaman sukses & data reward Coin; halaman riwayat
 * yang sudah ada tidak diubah.
 */

const ORDERS_KEY = 'rebites-orders';
const MAX_ORDERS = 30;

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RB-${stamp}${rand}`;
}

export function saveOrder(order: StoredOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const existing: StoredOrder[] = raw ? JSON.parse(raw) : [];
    const next = [order, ...existing].slice(0, MAX_ORDERS);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  } catch {
    // Storage penuh/korup — jangan blokir alur checkout.
  }
}

export function getOrderById(orderId: string): StoredOrder | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return undefined;
    const orders: StoredOrder[] = JSON.parse(raw);
    return orders.find((order) => order.orderId === orderId);
  } catch {
    return undefined;
  }
}
