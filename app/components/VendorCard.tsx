'use client';

import { MapPin, Star, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/app/components/Badge';
import { SmartImage } from '@/app/components/SmartImage';
import type { Vendor } from '@/lib/types';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={vendor.image}
          alt={`Foto tampilan ${vendor.name}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {vendor.isRescuePartner && (
          <div className="absolute left-3 top-3">
            <Badge variant="green">
              <Store className="h-3 w-3" />
              UMKM Penyelamat Makanan
            </Badge>
          </div>
        )}

        <div className="absolute -bottom-5 left-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-green-700 to-green-600 font-sans text-base font-bold text-white shadow-lg">
            {vendor.logo}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-6">
        <h3 className="font-sans text-lg font-bold text-charcoal-900">
          {vendor.name}
        </h3>

        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {vendor.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-sage-500" />
            {vendor.distanceKm} km
          </span>
        </div>

        <p className="text-sm text-charcoal-500">{vendor.category}</p>

        <span className="mt-1 w-fit rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-charcoal-500">
          {vendor.itemCount} makanan tersedia
        </span>

        <a
          href="#explore"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById('explore')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={cn(
            'mt-auto flex w-full items-center justify-center rounded-full border-2 border-green-700 py-2.5 text-sm font-semibold text-green-700 transition-colors duration-200 hover:bg-green-700 hover:text-white active:scale-[0.98]',
            FOCUS_RING
          )}
        >
          Lihat Toko
        </a>
      </div>
    </article>
  );
}
