'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clock, MapPin, Navigation, Store } from 'lucide-react';
import { vendors } from '@/lib/data';
import {
  PICKUP_READY_ESTIMATE,
} from '@/lib/useOrderCalculation';
import { useCheckout } from './checkout-context';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Informasi pengambilan pesanan — hanya tampil pada mode Pickup.
 * Data toko diambil dari data vendor yang sudah ada (lib/data.ts).
 */
export function PickupInfoCard() {
  const { draft, fulfillment } = useCheckout();

  const vendor = vendors.find((item) => item.id === draft.vendorSlug);

  return (
    <AnimatePresence initial={false}>
      {fulfillment === 'pickup' && (
        <motion.section
          key="pickup-info"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
          aria-label="Informasi pengambilan pesanan"
        >
          <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
              Ambil pesanan di toko
            </p>

            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-green-700">
                <Store className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h4 className="font-display text-lg font-semibold leading-snug text-charcoal-900">
                  {vendor?.name ?? draft.vendorName}
                </h4>
                <p className="mt-0.5 flex items-start gap-1 text-sm leading-relaxed text-charcoal-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" />
                  {draft.pickupLocation}
                  {draft.distanceKm !== undefined && (
                    <> · {draft.distanceKm} km</>
                  )}
                </p>
                {vendor?.openHours && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500">
                    <Clock className="h-3.5 w-3.5 text-sage-500" />
                    Jam operasional {vendor.openHours}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-green-700/[0.05] px-4 py-3">
              <p className="text-xs font-medium text-charcoal-500">
                Pesanan siap diambil
              </p>
              <p className="mt-0.5 flex items-baseline gap-2 text-sm font-semibold text-charcoal-900">
                {PICKUP_READY_ESTIMATE}
                <span className="text-xs font-normal text-sage-500">
                  ({draft.pickupTime.from} – {draft.pickupTime.to})
                </span>
              </p>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-charcoal-500">
              Kamu perlu mengambil pesanan langsung ke toko di jendela waktu
              di atas. Tunjukkan kode pengambilan ke mitra saat sampai.
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                draft.pickupLocation
              )}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-700 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <Navigation className="h-3.5 w-3.5" />
              Lihat Lokasi
            </a>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
