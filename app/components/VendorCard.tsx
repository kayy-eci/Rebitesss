'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Crown, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/app/components/SmartImage';
import type { Vendor } from '@/lib/types';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

function isOpenNow(openHours: string): boolean {
  const match = openHours.match(/(\d{1,2})\.(\d{2})\s*[–-]\s*(\d{1,2})\.(\d{2})/);
  if (!match) return true;

  const open = Number(match[1]) * 60 + Number(match[2]);
  const close = Number(match[3]) * 60 + Number(match[4]);
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  return open <= close
    ? minutes >= open && minutes < close
    : minutes >= open || minutes < close;
}

export function VendorCard({
  vendor,
  badgeLabel,
}: {
  vendor: Vendor;
  badgeLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(isOpenNow(vendor.openHours));
  }, [vendor.openHours]);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-forest-900/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={vendor.image}
          alt={`Foto tampilan ${vendor.name}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-forest-900/55 via-transparent to-transparent"
        />

        <div
          className={cn(
            'absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-md',
            isOpen ? 'bg-white/95 text-green-700' : 'bg-white/90 text-charcoal-500'
          )}
        >
          {isOpen ? 'Buka Sekarang' : 'Tutup Sekarang'}
        </div>

        {badgeLabel && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal-900 shadow-md">
            <Crown className="h-3 w-3" />
            {badgeLabel}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="font-sans text-lg font-bold leading-snug text-charcoal-900">
          {vendor.name}
        </h3>

        <p className="text-sm text-charcoal-500">{vendor.category}</p>

        <div className="mt-1 flex flex-col gap-2 text-xs text-charcoal-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 font-medium text-gold-600">
              <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
              {vendor.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-sage-500" />
              {isOpen
                ? `Buka ${vendor.openHours}`
                : `Tutup · ${vendor.openHours}`}
            </span>
          </div>
          <span className="flex items-start gap-1">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-500" />
            {vendor.address}
          </span>
        </div>

        <Link
          href={`/detail/toko?id=${vendor.id}`}
          className={cn(
            'group/cta mt-3 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-[#C8A882] active:scale-[0.98]',
            FOCUS_RING
          )}
        >
          Lihat Toko
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
