'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ORDERS_UPDATED_EVENT,
  getSellerOrders,
} from '@/lib/order-storage';
import type { StoredOrder } from '@/lib/types';

const POLL_INTERVAL_MS = 20_000; // 20 detik

/** Pesanan nyata yang masuk ke toko seller yang sedang login. */
export function useSellerOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getSellerOrders();
    setOrders(list);
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
    // Event-driven refresh (browser lokal)
    window.addEventListener(ORDERS_UPDATED_EVENT, refresh);
    // Polling fallback → pesanan dari browser pembeli lain juga terlihat
    const intervalId = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, refresh);
      clearInterval(intervalId);
    };
  }, [refresh]);

  const hasOrders = hydrated && orders.length > 0;

  return { orders, hasOrders, hydrated };
}
