'use client';

import type { StoredOrder } from './types';
import { notifyOrderCompleted } from './order-notifications';

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

  }
}export function getOrderById(orderId: string): StoredOrder | undefined {
  return readOrders().find((order) => order.orderId === orderId);
}

export function getUserOrders(userId: string | null | undefined): StoredOrder[] {
  if (!userId) return [];
  return readOrders().filter((order) => order.userId === userId);
}

export function getAllOrders(): StoredOrder[] {
  return readOrders();
}

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

    for (const order of next) {
      if (order.status === 'completed' && order.userId) {
        notifyOrderCompleted(order);
      }
    }
  }
  return changed;
}
