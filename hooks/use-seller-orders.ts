'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ORDERS_UPDATED_EVENT,
  getSellerOrders,
} from '@/lib/order-storage';
import type { StoredOrder } from '@/lib/types';

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
    window.addEventListener(ORDERS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  const hasOrders = hydrated && orders.length > 0;

  return { orders, hasOrders, hydrated };
}
