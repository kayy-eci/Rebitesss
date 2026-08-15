'use client';

import { useMemo, useState } from 'react';
import { foodItems } from '@/lib/data';
import type { FilterKey } from '@/lib/types';

function applyFilter(key: FilterKey) {
  return (a: (typeof foodItems)[number], b: (typeof foodItems)[number]) => {
    switch (key) {
      case 'terdekat': 
        return a.distanceKm - b.distanceKm;
      case 'diskon-terbesar':
        return b.discountPercent - a.discountPercent;
      case 'segera-habis':
        return (
          (a.expiresAt ? new Date(a.expiresAt).getTime() : Number.MAX_SAFE_INTEGER) -
          (b.expiresAt ? new Date(b.expiresAt).getTime() : Number.MAX_SAFE_INTEGER)
        );
      default:
        return 0;
    }
  };
}

export function ExploreSection() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('terdekat');

  const filteredItems = useMemo(() => {
    let items = [...foodItems];

    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.vendorName.toLowerCase().includes(q)
      );
    }

    const categoryFilters: FilterKey[] = ['umkm', 'bakery', 'restoran', 'minuman'];
    if (categoryFilters.includes(activeFilter)) {
      items = items.filter((item) => item.category === activeFilter);
    } else if (activeFilter === 'segera-habis') {
      items = items.filter((item) => item.expiresAt);
    }

    items.sort(applyFilter(activeFilter));
    return items;
  }, [query, activeFilter]);

  const resetAll = () => {
    setQuery('');
    setActiveFilter('terdekat');
  };
}
