'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, Check, Crown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/data';
import {
  SUBSCRIPTION_PLANS,
  getPlanPrice,
  type BillingCycle,
} from '@/lib/subscription-plans';
import {
  SUBSCRIPTION_UPDATED_EVENT,
  getActiveSubscription,
  type StoredSubscription,
} from '@/lib/subscription-storage';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { Reveal } from '@/app/components/reveal';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function LanggananPenjualPage() {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [subscription, setSubscription] = useState<StoredSubscription | null>(
    null
  );

  useEffect(() => {
    const refresh = () => {
      getActiveSubscription().then(setSubscription);
    };
    refresh();
    window.addEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(SUBSCRIPTION_UPDATED_EVENT, refresh);
    };
  }, []);

  const activeSlug = subscription?.planSlug ?? 'basic';

  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Dashboard Penjual
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
          Paket Langganan
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <Crown className="h-3.5 w-3.5" />
          Lihat status paketmu dan sesuaikan dengan kebutuhan tokomu.
        </p>
      </motion.div>

      { }
      <Reveal delay={0.05}>
        <Card className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
                Paket Saat Ini
              </p>
              <h2 className="mt-1 flex items-center gap-1.5 font-display text-xl font-medium tracking-tight text-forest-900">
                <Crown className="h-5 w-5 text-gold-500" />
                ReBites{' '}
                {SUBSCRIPTION_PLANS.find((plan) => plan.slug === activeSlug)?.name}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Aktif
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-cream-50 p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900">
                Siklus Tagihan
              </dt>
              <dd className="mt-1 text-sm font-bold text-charcoal-900">
                {subscription ? (subscription.billing === 'yearly' ? 'Tahunan' : 'Bulanan') : '—'}
              </dd>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900">
                Mulai Berlangganan
              </dt>
              <dd className="mt-1 text-sm font-bold text-charcoal-900">
                {subscription ? formatDate(subscription.startedAt) : '—'}
              </dd>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-900">
                Berlaku Hingga
              </dt>
              <dd className="mt-1 text-sm font-bold text-charcoal-900">
                {subscription ? formatDate(subscription.currentPeriodEnd) : 'Tanpa batas waktu'}
              </dd>
            </div>
          </dl>

          {!subscription && (
            <p className="mt-3 inline-flex items-start gap-1.5 rounded-lg bg-amber-100 px-3 py-2 text-[11px] font-medium text-charcoal-900">
              <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              Kamu belum berlangganan aktif. Pilih paket di bawah — Basic 24.999/bulan wajib untuk mulai berjualan.
            </p>
          )}
        </Card>
      </Reveal>

      { }
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-sage-100 bg-white p-1">
          {(
            [
              { key: 'monthly', label: 'Bulanan' },
              { key: 'yearly', label: 'Tahunan' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setBilling(mode.key)}
              aria-pressed={billing === mode.key}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-medium transition-colors',
                billing === mode.key
                  ? 'bg-green-700 text-white shadow-sm shadow-green-700/20'
                  : 'text-charcoal-500 hover:text-green-700'
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      { }
      <div className="mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan, index) => {
          const isActive = plan.slug === activeSlug;
          const price = getPlanPrice(plan, billing);
          const priceLabel = formatRupiah(price);

          return (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index, ease: 'easeOut' }}
              className="h-full"
            >
              <Card
                className={cn(
                  'relative flex h-full flex-col',
                  isActive && 'border-green-700 ring-1 ring-green-700/25'
                )}
              >
                {isActive && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-green-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    <BadgeCheck className="h-3 w-3" />
                    Paket Aktif
                  </span>
                )}

                <h3 className="font-display text-lg font-medium tracking-tight text-forest-900">
                  ReBites {plan.name}
                </h3>
                <p className="mt-1 min-h-[2.5rem] text-xs leading-relaxed text-sage-500">
                  {plan.tagline}
                </p>

                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-semibold leading-none text-charcoal-900">
                    {priceLabel}
                  </span>
                  <span className="text-xs text-sage-500">
                    /{billing === 'yearly' ? 'tahun' : 'bulan'}
                  </span>
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" />
                      <span className="font-medium text-charcoal-900">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  {isActive ? (
                    <span className="inline-flex w-full cursor-default items-center justify-center gap-2 rounded-full bg-sage-100 px-5 py-2.5 text-xs font-semibold text-charcoal-500">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Paket Kamu Saat Ini
                    </span>
                  ) : (
                    <Link
                      href={`/langganan/pembayaran?plan=${plan.slug}&billing=${billing}`}
                      className={cn(
                        'inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors',
                        plan.popular
                          ? 'bg-green-700 text-white shadow-sm shadow-green-700/25 hover:bg-green-600'
                          : 'border border-green-700 text-green-700 hover:bg-green-700/10'
                      )}
                    >
                      <Wallet className="h-3.5 w-3.5" />
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </SellerShell>
  );
}
