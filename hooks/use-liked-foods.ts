'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FAVORITE_UPDATED_EVENT,
  getLikedFoods,
  isFavorited,
  setFavorite,
  type LikedFood,
} from '@/lib/liked-foods';

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
    const onFav = () => refresh();
    const onVis = () => {
      if (typeof document !== 'undefined' && !document.hidden) refresh();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener(FAVORITE_UPDATED_EVENT, onFav);
      document.addEventListener('visibilitychange', onVis);
    }
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(FAVORITE_UPDATED_EVENT, onFav);
        document.removeEventListener('visibilitychange', onVis);
      }
      data.subscription.unsubscribe();
    };
  }, [refresh]);

  const isLiked = useCallback(
    (productId: string) => foods.some((f) => f.productId === productId || f.id === productId),
    [foods]
  );

  const toggle = useCallback(
    async (productId: string) => {
      const next = !isLiked(productId);
      
      setFoods((prev) =>
        next ? [...prev, { id: productId, productId }] : prev.filter((f) => f.productId !== productId && f.id !== productId)
      );
      const ok = await setFavorite(productId, next);
      if (!ok) {
        
        setFoods((prev) =>
          next ? prev.filter((f) => f.productId !== productId && f.id !== productId) : [...prev, { id: productId, productId }]
        );
      } else {
        
        refresh();
      }
      return ok;
    },
    [isLiked, refresh]
  );

  const likedIds = useMemo(() => new Set(foods.map((f) => f.productId || f.id)), [foods]);

  return { foods, hydrated, refresh, count: foods.length, isLiked, toggle, likedIds, isFavorited };
}
