'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFollowedStores, type FollowedStore } from '@/lib/store-follows';

/** Daftar toko yang diikuti user yang sedang login. */
export function useFollowedStores() {
  const [stores, setStores] = useState<FollowedStore[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getFollowedStores();
    setStores(list);
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stores, hydrated, refresh };
}
