'use client';

import { Clock, MapPin } from 'lucide-react';
import { useCheckout } from './checkout-context';

export function PickupInfoRow() {
  const { draft } = useCheckout();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-green-700">
          <Clock className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
            Waktu ambil
          </p>
          <p className="mt-0.5 text-sm font-medium text-charcoal-900">
            {draft.pickupTime.from} – {draft.pickupTime.to}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-green-700">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
            Titik ambil
          </p>
          <p className="mt-0.5 text-sm font-medium text-charcoal-900">
            {draft.pickupLocation}
          </p>
        </div>
      </div>
    </div>
  );
}
