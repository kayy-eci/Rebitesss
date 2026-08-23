'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Gift, Share2, X } from 'lucide-react';
import { DotPattern, LeafSprig } from './decor';

/** Slug toko penjual demo — dipakai sebagai identitas referral. */
const REFERRAL_PATH = '/auth/register/penjual?ref=dapur-ibu-tini';

export function ReferralCard() {
  const [dismissed, setDismissed] = useState(false);
  const [shared, setShared] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const markShared = () => {
    setShared(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setShared(false), 2400);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${REFERRAL_PATH}`;
    const payload = {
      title: 'ReBites',
      text: 'Ajak tokomu gabung ReBites lewat link ini — berdua dapat slot unggulan 7 hari gratis!',
      url,
    };

    /* Web Share API bila tersedia (mobile), fallback salin ke clipboard. */
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(payload);
        markShared();
        return;
      } catch (error) {
        /* User membatalkan share sheet — jangan anggap gagal keras,
           coba clipboard sebagai fallback yang ramah desktop. */
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      markShared();
    } catch {
      /* Clipboard ditolak browser — feedback minimal tetap ditampilkan
         agar tombol tidak terasa mati. */
      markShared();
    }
  };

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-forest-900 p-5 text-cream-50"
        >
          <DotPattern className="right-0 top-0 h-24 w-24 text-cream-50/10" />
          <LeafSprig className="-bottom-8 -right-6 h-32 w-32 text-cream-50/10" />

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Tutup undangan mitra"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-cream-50/70 transition-colors hover:bg-cream-50/10 hover:text-cream-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/15">
              <Gift className="h-5 w-5 text-cream-50" />
            </div>
            <h3 className="mt-3 font-display text-base font-semibold leading-snug">
              Undang UMKM, Dapat Bonus Promo!
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-cream-50/75">
              Ajak toko lain bergabung ReBites, kalian berdua dapat slot unggulan 7 hari gratis.
            </p>
            <button
              type="button"
              onClick={handleShare}
              aria-live="polite"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream-50 px-4 py-2.5 text-xs font-semibold text-forest-900 transition-colors hover:bg-white"
            >
              {shared ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-700" />
                  Link Undangan Disalin!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Bagikan Link Undangan
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
