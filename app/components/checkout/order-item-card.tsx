'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import { useCheckout } from './checkout-context';
import { ReservationCountdown } from './reservation-countdown';

export function OrderItemCard() {
  const { draft } = useCheckout();

  return (
    <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sage-100 sm:h-28 sm:w-28">
          <SmartImage src={draft.image} alt={draft.productName} sizes="112px" />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/detail/toko?id=${encodeURIComponent(draft.vendorSlug)}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500 transition-colors hover:text-primary"
          >
            {draft.vendorName}
            <ChevronRight className="h-3 w-3" />
          </Link>

          <h2 className="mt-1 block font-display text-lg font-medium leading-snug text-charcoal-900 sm:text-xl">
            {draft.productName}
          </h2>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-display text-lg font-semibold text-primary">
              {formatRupiah(draft.discountedPrice)}
            </span>
            <span className="text-sm text-sage-500 line-through">
              {formatRupiah(draft.originalPrice)}
            </span>
          </div>
        </div>
      </div>

      <ReservationCountdown reservedUntil={draft.reservedUntil} />
    </div>
  );
}
