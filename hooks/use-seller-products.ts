'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PRODUCTS_UPDATED_EVENT,
  getSellerProducts,
  type SellerProduct,
} from '@/lib/product-storage';

export function useSellerProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setProducts(getSellerProducts());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const onUpdate = () => setProducts(getSellerProducts());
    window.addEventListener(PRODUCTS_UPDATED_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  const sorted = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [products]
  );

  return { products: sorted, hydrated };
}
