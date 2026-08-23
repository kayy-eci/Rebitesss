import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, LayoutDashboard, Store } from 'lucide-react';
import {
  getSubscriptionPlan,
  computePeriodEnd,
  type BillingCycle,
} from '@/lib/subscription-plans';

export const metadata: Metadata = {
  title: 'Langganan Aktif | ReBites',
  description: 'Langganan paket penjual ReBites berhasil diaktifkan.',
};

const METHOD_NAMES: Record<string, string> = {
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  'transfer-bank': 'Transfer Bank',
};

interface SuccessPageProps {
  searchParams?: { plan?: string; billing?: string; method?: string };
}

export default function SubscriptionSuccessPage({ searchParams }: SuccessPageProps) {
  const plan = getSubscriptionPlan(searchParams?.plan);
  const billing: BillingCycle =
    searchParams?.billing === 'yearly' ? 'yearly' : 'monthly';
  const methodName = searchParams?.method
    ? METHOD_NAMES[searchParams.method]
    : undefined;

  /* Fallback bila dibuka langsung tanpa param. */
  if (!plan) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-2xl font-medium text-charcoal-900">
            Langganan ReBites
          </h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Pilih paket langganan terlebih dahulu.
          </p>
          <Link
            href="/#langganan"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-green-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            Lihat Paket
          </Link>
        </div>
      </main>
    );
  }

  const periodEnd = computePeriodEnd(billing).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl border border-hairline bg-white p-8 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)] sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white shadow-[0_16px_32px_-16px_rgba(27,77,50,0.6)]">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>

          <h1 className="mt-5 font-display text-2xl font-medium tracking-tight text-charcoal-900">
            Langganan Aktif!
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
            Selamat! Paket <strong className="text-charcoal-900">ReBites {plan.name}</strong>{' '}
            kamu sudah aktif hingga{' '}
            <strong className="text-charcoal-900">{periodEnd}</strong>.
          </p>

          <dl className="mt-6 space-y-2.5 rounded-2xl bg-cream-100 p-4 text-left text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-charcoal-500">Paket</dt>
              <dd className="font-medium text-charcoal-900">ReBites {plan.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-charcoal-500">Siklus</dt>
              <dd className="font-medium capitalize text-charcoal-900">
                {billing === 'yearly' ? 'Tahunan' : 'Bulanan'}
              </dd>
            </div>
            {!plan.monthly && !plan.yearly ? null : (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-charcoal-500">Metode pembayaran</dt>
                <dd className="font-medium text-charcoal-900">
                  {methodName ?? '—'}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 border-t border-hairline pt-2.5">
              <dt className="text-charcoal-500">Perpanjangan berikutnya</dt>
              <dd className="font-medium text-charcoal-900">{periodEnd}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/dashboard/penjual"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-5 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
            >
              <LayoutDashboard className="h-4 w-4" />
              Ke Dashboard Penjual
            </Link>
            <Link
              href="/home"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-green-700 px-5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
            >
              <Store className="h-4 w-4" />
              Ke Beranda
            </Link>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-charcoal-500">
            Mode demo — langganan tersimpan lokal di perangkat ini dan tidak
            ada transaksi sungguhan.
          </p>
        </div>
      </div>
    </main>
  );
}
