'use client';

import { useCallback, useEffect, useState } from 'react';
import { PRODUCTS_UPDATED_EVENT } from '@/lib/product-storage';
import { ORDERS_UPDATED_EVENT } from '@/lib/order-storage';
import {
  getSellerBestSellingMenus,
  type BestSellingMenu,
} from '@/lib/seller-product-sales';

export function useSellerBestSellingMenus() {
  const [menus, setMenus] = useState<BestSellingMenu[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setMenus(getSellerBestSellingMenus());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const onUpdate = () => setMenus(getSellerBestSellingMenus());
    window.addEventListener(PRODUCTS_UPDATED_EVENT, onUpdate);
    window.addEventListener(ORDERS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, onUpdate);
      window.removeEventListener(ORDERS_UPDATED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  return { menus, hydrated };
}
