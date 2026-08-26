'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLikedFoods, type LikedFood } from '@/lib/liked-foods';

export function useLikedFoods() {
  const [foods, setFoods] = useState<LikedFood[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getLikedFoods();
    setFoods(list);
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { foods, hydrated, refresh, count: foods.length };
}
