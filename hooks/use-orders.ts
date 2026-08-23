'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { StoredOrder } from '@/lib/types';
import {
  ORDERS_UPDATED_EVENT,
  completeExpiredOrders,
  getUserOrders,
} from '@/lib/order-storage';
import { getCurrentUserId } from '@/lib/current-user';

const SWEEP_INTERVAL_MS = 5_000;

/**
 * Order milik user saat ini (demo: `demo-user`) — satu-satunya sumber
 * data halaman Pesanan Saya.
 *
 * - Filter ketat `order.userId === getCurrentUserId()`.
 * - Sweep berkala: order ongoing yang melewati `estimatedCompletionAt`
 *   otomatis menjadi `completed` (persist di storage, refresh-safe).
 * - Sinkron realtime lintas komponen & tab (custom event + `storage`).
 */
export function useOrders() {
  const userId = getCurrentUserId();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    /* Sweep dulu agar status kedaluwarsa ikut terbaca. */
    completeExpiredOrders();
    setOrders(getUserOrders(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const onUpdate = () => setOrders(getUserOrders(userId));
    window.addEventListener(ORDERS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);

    /* Pemindaian status berkala — data statis tidak di-fetch ulang,
       hanya sweep status yang murah dan idempotent. */
    const intervalId = window.setInterval(onUpdate, SWEEP_INTERVAL_MS);

    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
      window.clearInterval(intervalId);
    };
  }, [userId, refresh]);

  const activeOrders = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'ongoing')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders]
  );

  const completedOrders = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'completed')
        .sort(
          (a, b) =>
            (b.completedAt ?? b.createdAt).localeCompare(a.completedAt ?? a.createdAt)
        ),
    [orders]
  );

  return {
    orders,
    activeOrders,
    completedOrders,
    hydrated,
    loading: !hydrated,
  };
}
