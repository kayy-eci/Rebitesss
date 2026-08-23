'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { formatRupiah } from '@/lib/data';
import {
  getPlanPrice,
  getSubscriptionPlan,
  type BillingCycle,
} from '@/lib/subscription-plans';
import { saveSubscription } from '@/lib/subscription-storage';
import { paymentMethods } from '@/app/components/checkout/payment-methods';
import { cn } from '@/lib/utils';

/**
 * Checkout langganan penjual — ringkasan paket + metode pembayaran
 * simulasi (pattern sama dengan checkout pembeli). Paket gratis aktif
 * tanpa memilih metode. Demo: tidak ada transaksi sungguhan.
 */
export function SubscriptionCheckoutView() {
  const router = useRouter();
  const params = useSearchParams();

  const plan = getSubscriptionPlan(params.get('plan'));
  const billing: BillingCycle =
    params.get('billing') === 'yearly' ? 'yearly' : 'monthly';

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  /* Plan tak dikenal → arahkan balik ke daftar paket. */
  if (!plan) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-cream-50 px-6 py-14 text-center">
        <h1 className="font-display text-xl font-medium tracking-tight text-charcoal-900">
          Paket tidak ditemukan
        </h1>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-charcoal-500">
          Silakan pilih paket langganan terlebih dahulu.
        </p>
        <Link
          href="/#langganan"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-green-700 px-6 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
        >
          Lihat Paket Langganan
        </Link>
      </div>
    );
  }

  const isFree = plan.monthly === 0 && plan.yearly === 0;
  const price = getPlanPrice(plan, billing);
  const canPay = isFree || selectedMethodId !== null;

  const handlePay = () => {
    if (processing || !canPay) return;
    setProcessing(true);

    /* Simulasi proses pembayaran, lalu simpan & lanjut ke sukses. */
    window.setTimeout(() => {
      saveSubscription({
        planSlug: plan.slug,
        billing,
        paymentMethodId: isFree ? null : selectedMethodId,
      });
      router.push(
        `/langganan/sukses?plan=${plan.slug}&billing=${billing}`
      );
    }, 1_100);
  };

  return (
    <>
      {/* Kembali */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 -ml-2 text-[13px] font-semibold text-charcoal-500 transition-colors hover:bg-white hover:text-green-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <section className="mt-4">
        <h1 className="font-display text-2xl font-medium tracking-tight text-charcoal-900 sm:text-3xl">
          Berlangganan ReBites {plan.name}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal-500">
          {isFree
            ? 'Aktifkan paket gratis dan mulai jualan hari ini.'
            : 'Selesaikan pembayaran untuk mengaktifkan paket usaha kamu.'}
        </p>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Ringkasan paket */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-[0_10px_30px_-22px_rgba(27,77,50,0.35)] sm:p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-600">
              <BadgeCheck className="h-3.5 w-3.5" />
              Paket Penjual
            </span>
            {plan.popular && (
              <span className="rounded-full bg-green-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Paling Populer
              </span>
            )}
          </div>

          <h2 className="mt-4 font-display text-xl font-semibold text-charcoal-900">
            ReBites {plan.name}
          </h2>
          <p className="mt-1 text-sm italic text-charcoal-500">{plan.tagline}</p>

          <div className="mt-5 flex items-end gap-1.5 border-t border-hairline pt-5">
            <span className="font-display text-3xl font-semibold tabular-nums text-green-700">
              {price === 0 ? 'Gratis' : formatRupiah(price)}
            </span>
            {price > 0 && (
              <span className="pb-1 text-sm text-charcoal-500">
                /{billing === 'yearly' ? 'tahun' : 'bulan'}
              </span>
            )}
          </div>
          {!isFree && billing === 'yearly' && (
            <p className="mt-1 text-xs text-charcoal-500">
              Setara Rp{Math.round(plan.yearly / 12).toLocaleString('id-ID')} /
              bulan
            </p>
          )}

          <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span className="text-charcoal-900">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pembayaran */}
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-[0_10px_30px_-22px_rgba(27,77,50,0.35)] sm:p-6 lg:col-span-2">
          <h2 className="font-display text-base font-semibold text-charcoal-900">
            {isFree ? 'Aktivasi' : 'Metode Pembayaran'}
          </h2>

          {isFree ? (
            <p className="mt-3 rounded-xl bg-cream-100 px-4 py-3 text-sm leading-relaxed text-charcoal-500">
              Paket Basic tidak dipungut biaya. Langganan langsung aktif
              setelah dikonfirmasi.
            </p>
          ) : (
            <div className="mt-3 space-y-2" role="radiogroup" aria-label="Metode pembayaran">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = selectedMethodId === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200',
                      active
                        ? 'border-green-700 bg-green-50 ring-2 ring-green-700/15'
                        : 'border-hairline hover:border-sage-500/50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        active ? 'bg-green-700 text-white' : 'bg-cream-100 text-charcoal-500'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-charcoal-900">
                        {method.name}
                      </span>
                      <span className="block truncate text-xs text-charcoal-500">
                        {method.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                        active ? 'border-green-700 bg-green-700 text-white' : 'border-hairline'
                      )}
                    >
                      {active && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Total */}
          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
            <span className="text-sm font-medium text-charcoal-900">Total bayar</span>
            <span className="font-display text-lg font-semibold tabular-nums text-green-700">
              {price === 0 ? 'Rp0' : formatRupiah(price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={!canPay || processing}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-5 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-sage-100 disabled:text-sage-500 disabled:shadow-none"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses…
              </>
            ) : isFree ? (
              'Aktifkan Gratis'
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Bayar Sekarang
              </>
            )}
          </button>

          <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-charcoal-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-700" />
            Mode demo — tidak ada transaksi sungguhan. Pada versi produksi,
            pembayaran diproses melalui payment gateway (Midtrans).
          </p>
        </div>
      </div>
    </>
  );
}
