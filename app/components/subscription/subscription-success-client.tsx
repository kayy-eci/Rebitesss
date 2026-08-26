'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Clock, LayoutDashboard, Store, XCircle } from 'lucide-react';
import { getSubscriptionPlan, computePeriodEnd, type BillingCycle } from '@/lib/subscription-plans';
import { supabase } from '@/lib/supabase';

const METHOD_NAMES: Record<string, string> = {
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  'transfer-bank': 'Transfer Bank',
  xendit: 'Xendit',
};

interface Props {
  planSlug?: string;
  billingParam?: string;
  externalId?: string;
}

export function SubscriptionSuccessClient({ planSlug, billingParam, externalId }: Props) {
  const plan = getSubscriptionPlan(planSlug);
  const billing: BillingCycle = billingParam === 'yearly' ? 'yearly' : 'monthly';

  const [status, setStatus] = useState<'loading' | 'pending' | 'active' | 'failed'>(
    externalId ? 'pending' : 'active'
  );

  useEffect(() => {
    if (!externalId) return;
    let cancelled = false;
    let elapsed = 0;
    let interval: ReturnType<typeof setInterval>;

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      // Cari umkm milik user
      const { data: umkm } = await supabase
        .from('umkm_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      if (!umkm || cancelled) return;
      const umkmId = (umkm as Record<string, string>).id;

      const { data: subs } = await supabase
        .from('subscriptions')
        .select('status, xendit_invoice_id')
        .eq('umkm_id', umkmId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (cancelled || !subs) return;
      const rows = subs as Array<Record<string, string>>;
      // Cari yang match external_id ATAU paling terbaru yang pending/active
      const target =
        rows.find((r) => r.xendit_invoice_id && externalId.includes(r.xendit_invoice_id.slice(0, 8))) ??
        rows[0];

      if (!target) return;

      if (target.status === 'active') {
        setStatus('active');
        if (interval) clearInterval(interval);
      } else if (target.status === 'expired' || target.status === 'cancelled') {
        setStatus('failed');
        if (interval) clearInterval(interval);
      } else {
        setStatus('pending');
      }
    };

    check();
    interval = setInterval(() => {
      elapsed += 3000;
      if (elapsed >= 90_000) {
        clearInterval(interval);
        return;
      }
      check();
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [externalId]);

  if (!plan) {
    return (
      <main className="min-h-screen bg-cream">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-2xl font-medium text-charcoal-900">Langganan ReBites</h1>
          <p className="mt-2 text-sm text-charcoal-500">Pilih paket langganan terlebih dahulu.</p>
          <Link href="/#langganan" className="mt-6 inline-flex h-11 items-center rounded-full bg-green-700 px-6 text-sm font-semibold text-white">
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

  if (status === 'pending') {
    return (
      <main className="min-h-screen bg-cream">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-hairline bg-white p-8 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)] sm:p-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-[0_16px_32px_-16px_rgba(245,158,11,0.6)]">
              <Clock className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-medium tracking-tight text-charcoal-900">Menunggu Pembayaran</h1>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
              Selesaikan pembayaran di halaman Xendit. Langganan <strong className="text-charcoal-900">ReBites {plan.name}</strong> akan aktif otomatis setelah pembayaran terverifikasi.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              Memverifikasi…
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/dashboard/penjual/langganan" className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-hairline px-5 text-sm font-semibold text-charcoal-700">
                Cek Langganan
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="min-h-screen bg-cream">
        <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-hairline bg-white p-8 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)] sm:p-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
              <XCircle className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-medium tracking-tight text-charcoal-900">Pembayaran Gagal</h1>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-500">Pembayaran kadaluarsa atau dibatalkan. Silakan coba lagi.</p>
            <Link href="/dashboard/penjual/langganan" className="mt-6 inline-flex h-11 items-center rounded-full bg-green-700 px-6 text-sm font-semibold text-white">
              Kembali ke Langganan
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // active
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl border border-hairline bg-white p-8 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)] sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white shadow-[0_16px_32px_-16px_rgba(27,77,50,0.6)]">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-medium tracking-tight text-charcoal-900">Langganan Aktif!</h1>
          <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
            Selamat! Paket <strong className="text-charcoal-900">ReBites {plan.name}</strong> kamu sudah aktif hingga{' '}
            <strong className="text-charcoal-900">{periodEnd}</strong>.
          </p>
          <dl className="mt-6 space-y-2.5 rounded-2xl bg-cream-100 p-4 text-left text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-charcoal-500">Paket</dt>
              <dd className="font-medium text-charcoal-900">ReBites {plan.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-charcoal-500">Siklus</dt>
              <dd className="font-medium capitalize text-charcoal-900">{billing === 'yearly' ? 'Tahunan' : 'Bulanan'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-hairline pt-2.5">
              <dt className="text-charcoal-500">Perpanjangan berikutnya</dt>
              <dd className="font-medium text-charcoal-900">{periodEnd}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/dashboard/penjual" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-5 text-sm font-semibold text-white shadow-sm shadow-green-700/25 hover:bg-green-600">
              <LayoutDashboard className="h-4 w-4" />
              Ke Dashboard Penjual
            </Link>
            <Link href="/home" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-green-700 px-5 text-sm font-semibold text-green-700 hover:bg-green-50">
              <Store className="h-4 w-4" />
              Ke Beranda
            </Link>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-charcoal-500">Pembayaran diproses aman via Xendit.</p>
        </div>
      </div>
    </main>
  );
}
