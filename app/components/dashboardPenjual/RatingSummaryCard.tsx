'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { Card } from './Card';
import { SERVICE_REVIEWS } from '@/app/detail/toko/service-reviews';
import { SELLER_VENDOR_SLUG } from '@/lib/product-storage';
import { useCountUp } from './useCountUp';

/**
 * Ringkasan rating pelayanan toko — diambil dari data review yang sama
 * dengan halaman detail toko (SERVICE_REVIEWS).
 */
export function RatingSummaryCard() {
  const reviews = useMemo(
    () => SERVICE_REVIEWS[SELLER_VENDOR_SLUG] ?? [],
    []
  );

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const review of reviews) {
      counts[review.rating - 1] = (counts[review.rating - 1] ?? 0) + 1;
    }
    return counts;
  }, [reviews]);

  const { ref, value } = useCountUp(average, 1200, 1);

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Rating Pelayanan
          </p>
          <h3 className="mt-1 font-display text-lg font-medium tracking-tight text-forest-900">
            Penilaian Pembeli
          </h3>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <p className="font-display text-[38px] font-medium leading-none tracking-tight text-forest-900">
          <span ref={ref}>{value.toFixed(1)}</span>
        </p>
        <div>
          <div className="flex items-center gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  star <= Math.round(average)
                    ? 'h-3.5 w-3.5 fill-gold-500 text-gold-500'
                    : 'h-3.5 w-3.5 text-sage-100 fill-sage-100'
                }
              />
            ))}
          </div>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900">
            {reviews.length} Ulasan
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star - 1];
          const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <li key={star} className="flex items-center gap-2 text-[11px] text-sage-500">
              <span className="w-8 shrink-0 font-medium">{star} ★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-100">
                <span
                  className="block h-full rounded-full bg-gold-400"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-4 shrink-0 text-right tabular-nums">{count}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
