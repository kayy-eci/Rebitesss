'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { formatRupiah } from '@/lib/data';
import { cn } from '@/lib/utils';
import { DotPattern } from '@/app/components/Ornaments';
import { AnimatedNumber } from './animated-number';
import { PromoCodeInput } from './promo-code-input';
import { useCheckout } from './checkout-context';

const STICKY_TOP = 112;

export function PaymentSummaryCard() {
  const { draft, quantity, summary, canPay } = useCheckout();
  const cardRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      setStuck(rect.top <= STICKY_TOP + 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-3xl bg-cream-100 p-5 transition-shadow duration-300 sm:p-6',
        stuck ? 'shadow-xl shadow-green-900/10' : 'shadow-md shadow-green-900/5'
      )}
    >
      <DotPattern className="pointer-events-none absolute inset-0 h-full w-full text-green-700/[0.05]" />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
          Ringkasan pembayaran
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-charcoal-500">
              Subtotal ({quantity} porsi)
            </dt>
            <dd className="font-medium tabular-nums text-charcoal-900">
              <AnimatedNumber value={summary.subtotal} format={formatRupiah} />
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-charcoal-500">Biaya layanan</dt>
            <dd className="font-medium tabular-nums text-charcoal-900">
              <AnimatedNumber value={summary.serviceFee} format={formatRupiah} />
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="text-charcoal-500">Biaya metode</dt>
            <dd className="font-medium tabular-nums text-charcoal-900">
              {canPay ? (
                <AnimatedNumber value={summary.methodFee} format={formatRupiah} />
              ) : (
                <span className="text-sage-500">—</span>
              )}
            </dd>
          </div>

          {summary.promoDiscount > 0 && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-green-700">Diskon promo</dt>
              <dd className="font-semibold tabular-nums text-green-700">
                −{formatRupiah(summary.promoDiscount)}
              </dd>
            </div>
          )}
        </dl>

        <PromoCodeInput />

        <div className="mt-5 border-t border-sage-500/25 pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-base font-medium text-charcoal-900">
              Total
            </span>
            <span className="font-display text-2xl font-semibold tabular-nums text-green-700">
              <AnimatedNumber value={summary.total} format={formatRupiah} />
            </span>
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-green-700">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Kamu hemat {formatRupiah(summary.totalSavings)} dan mencegah
              ≈{summary.co2eSaved.toFixed(1)} kg CO2e
            </span>
          </p>
        </div>

        <motion.button
          type="button"
          disabled={!canPay}
          whileHover={canPay ? { scale: 1.02 } : undefined}
          whileTap={canPay ? { scale: 0.98 } : undefined}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'mt-6 w-full rounded-full py-3.5 text-sm font-semibold transition-colors duration-200',
            canPay
              ? 'bg-green-700 text-white shadow-lg shadow-green-700/25 hover:bg-green-600'
              : 'cursor-not-allowed bg-sage-100 text-sage-500'
          )}
        >
          {canPay
            ? `Bayar Sekarang · ${formatRupiah(summary.total)}`
            : 'Pilih metode pembayaran'}
        </motion.button>

        {!canPay && (
          <p className="mt-2 text-center text-xs text-sage-500">
            Pilih salah satu metode di atas dulu
          </p>
        )}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-charcoal-500">
          <Lock className="h-3.5 w-3.5 text-green-700" />
          Transaksi terenkripsi · Dana ditahan sampai pesanan diambil
        </p>
      </div>
    </div>
  );
}
