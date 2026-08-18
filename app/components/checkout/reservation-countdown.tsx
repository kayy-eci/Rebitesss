'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Timer } from 'lucide-react';
import { useCountdown } from '@/lib/useCountdown';
import { cn } from '@/lib/utils';

function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function ReservationCountdown({
  reservedUntil,
}: {
  reservedUntil: string;
}) {
  const remaining = useCountdown(reservedUntil);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (remaining === null) return null;

  if (remaining <= 0) {
    return (
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-sage-100 bg-sage-100/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Timer className="h-4 w-4 shrink-0 text-sage-500" />
          <span className="text-sm font-medium text-charcoal-500">
            Waktu reservasi habis
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-600"
        >
          <Search className="h-3.5 w-3.5" />
          Cari lagi
        </Link>
      </div>
    );
  }

  const urgent = remaining < 120;
  const label = urgent
    ? 'Reservasi segera berakhir'
    : 'Pesanan diamankan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3',
        urgent
          ? 'border-green-700/40 bg-green-700/5'
          : 'border-sage-100 bg-sage-100/50'
      )}
    >
      <div className="flex items-center gap-2.5">
        <motion.span
          animate={
            urgent && !reduced ? { opacity: [1, 0.45, 1] } : { opacity: 1 }
          }
          transition={
            urgent && !reduced
              ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0 }
          }
        >
          <Timer
            className={cn(
              'h-4 w-4 shrink-0',
              urgent ? 'text-green-700' : 'text-sage-500'
            )}
          />
        </motion.span>
        <span className="text-sm text-charcoal-500">{label}</span>
      </div>
      <span
        className={cn(
          'font-display text-base font-semibold tabular-nums',
          urgent ? 'text-green-700' : 'text-charcoal-900'
        )}
      >
        {formatClock(remaining)}
      </span>
    </motion.div>
  );
}
