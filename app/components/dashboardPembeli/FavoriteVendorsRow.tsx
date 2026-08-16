'use client';

import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { Card } from './Card';
import { favoriteVendors } from './data';
import { SmartImage } from '@/app/components/SmartImage';

export function FavoriteVendorsRow() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">UMKM Favorit Saya</h2>
        <button
          type="button"
          aria-label="Menu UMKM favorit"
          className="flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 hover:text-charcoal-900"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {favoriteVendors.map((vendor) => (
          <Link key={vendor.id} href="/" className="group relative" aria-label={`Kunjungi toko ${vendor.name}`}>
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal-900 px-2 py-1 text-[11px] font-medium text-cream-50 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              {vendor.name}
            </span>
            <span className="relative block h-12 w-12 overflow-hidden rounded-full ring-2 ring-sage-100 transition-transform duration-150 group-hover:scale-105">
              <SmartImage src={vendor.logo} alt={`Logo ${vendor.name}`} />
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
