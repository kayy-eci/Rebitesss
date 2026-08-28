'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { formatRupiah } from '@/lib/data';
import {
  SUBSCRIPTION_PLANS,
  computePeriodEnd,
  getPlanPrice,
  getSubscriptionPlan,
  type BillingCycle,
} from '@/lib/subscription-plans';
import { saveSubscription } from '@/lib/subscription-storage';
import { supabase } from '@/lib/supabase';

export function SubscriptionCheckoutView() {
  const router = useRouter();
  const params = useSearchParams();

  const planParam = params.get('plan');
  const initialPlan = getSubscriptionPlan(planParam);
  const billing: BillingCycle =
    params.get('billing') === 'yearly' ? 'yearly' : 'monthly';

  // 3 chooser: Basic, Standar, Max — sinkron dengan SUBSCRIPTION_PLANS 3/5/15
  const chooserPlans = useMemo(() => SUBSCRIPTION_PLANS, []);

  const [selectedSlug, setSelectedSlug] = useState<'basic' | 'standar' | 'premium'>(() => {
    if (initialPlan && (initialPlan.slug === 'basic' || initialPlan.slug === 'standar' || initialPlan.slug === 'premium')) return initialPlan.slug as 'basic' | 'standar' | 'premium';
    return 'basic';
  });

  // Jika query berubah dari luar (navigate), sync
  useEffect(() => {
    if (initialPlan && (initialPlan.slug === 'basic' || initialPlan.slug === 'standar' || initialPlan.slug === 'premium')) {
      setSelectedSlug(initialPlan.slug as 'basic' | 'standar' | 'premium');
    }
  }, [initialPlan]);

  const plan = getSubscriptionPlan(selectedSlug) ?? getSubscriptionPlan('basic')!;

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });
  }, []);

  if (!plan) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-hairline bg-white px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-primary">
          <CreditCard className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-xl font-medium tracking-tight text-charcoal-900">Paket tidak tersedia</h1>
        <Link
          href="/dashboard/penjual/langganan"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#225138] px-6 text-sm font-semibold text-white hover:bg-[#143B2D]"
        >
          Pilih Paket
        </Link>
      </div>
    );
  }

  // Semua tier berbayar — Basic 24.999 wajib bayar
  const isFree = false;
  const price = getPlanPrice(plan, billing);
  const subtotal = price;
  const tax = Math.round(subtotal * 0.02);
  const total = subtotal + tax;
  const periodEndLabel = computePeriodEnd(billing).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePay = async () => {
    if (processing) return;
    setProcessing(true);
    setErrorMessage(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setProcessing(false);
        setErrorMessage('Sesi habis, silakan login ulang.');
        router.push('/auth/login');
        return;
      }
      const res = await fetch('/api/subscriptions/xendit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planSlug: plan.slug, billing }),
      });
      const json = (await res.json().catch(() => null)) as
        | { error?: string; invoiceUrl?: string }
        | null;
      if (!res.ok) {
        setProcessing(false);
        setErrorMessage(json?.error ?? 'Gagal membuat invoice.');
        return;
      }
      if (json?.invoiceUrl) {
        window.location.href = json.invoiceUrl;
        return;
      }
      setProcessing(false);
      setErrorMessage('Respons pembayaran tidak valid.');
    } catch (err) {
      console.error('[subscription] handlePay error', err);
      setProcessing(false);
      setErrorMessage('Terjadi kesalahan saat memproses pembayaran.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        disabled={processing}
        className="inline-flex h-9 items-center gap-1.5 -ml-2 rounded-full px-2 text-[13px] font-semibold text-charcoal-500 transition-colors hover:bg-white hover:text-[#225138] disabled:pointer-events-none disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      {/* Header 1 halaman penuh - bukan popup */}
      <section className="mt-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#225138] sm:text-3xl">
          Pilih Paket Langganan
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6B6A63]">
          Pilih Basic, Standar atau Max. Klik card untuk mengganti, detail di bawah akan mengikuti pilihanmu. Semua paket berbayar via Xendit (Basic 24.999).
        </p>
      </section>

      {/* 3 card chooser — Basic 3, Standar 5, Max 15 */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {chooserPlans.map((p) => {
          const isSelected = p.slug === selectedSlug;
          const pPrice = getPlanPrice(p, billing);
          const pTotal = pPrice + Math.round(pPrice * 0.02);
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedSlug(p.slug as 'basic' | 'standar' | 'premium')}
              className={`relative flex flex-col rounded-2xl border bg-white p-5 text-left transition-all ${
                isSelected
                  ? 'border-[#225138] bg-[#F7F5EF] shadow-sm ring-1 ring-[#225138]/20'
                  : 'border-[#DEDACF] hover:border-[#AEB89B] hover:bg-white'
              }`}
            >
              {/* Radio dot like foto */}
              <span
                className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  isSelected ? 'border-[#225138] bg-[#225138]' : 'border-[#DEDACF] bg-white'
                }`}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>

              <h3 className="font-display text-lg font-semibold text-[#225138]">ReBites {p.name}</h3>
              <p className="mt-1 min-h-[2.2rem] text-xs leading-relaxed text-[#6B6A63]">{p.tagline}</p>
              <p className="mt-3">
                <span className="font-display text-2xl font-bold text-[#225138]">{formatRupiah(pPrice)}</span>
                <span className="ml-1 text-xs text-[#6B6A63]">/ {billing === 'yearly' ? 'tahun' : 'bulan'}</span>
              </p>
              <p className="mt-1 text-[11px] text-[#9A9994]">+ Pajak 2% → {formatRupiah(pTotal)}</p>
              <ul className="mt-3 space-y-1.5">
                {p.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-1.5 text-[12px] leading-snug text-[#225138]">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#225138]" />
                    {f}
                  </li>
                ))}
              </ul>
              {isSelected && (
                <span className="absolute -top-2 right-8 rounded-full bg-[#225138] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Dipilih
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Full page detail - bukan popup, 1 halaman */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LEFT - Rincian pure detail tanpa input */}
        <div className="rounded-2xl border border-[#DEDACF] bg-white p-6 shadow-sm sm:p-7 lg:col-span-3">
          <h2 className="font-display text-[18px] font-semibold tracking-tight text-[#225138]">Rincian Pembayaran</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B6A63]">
            ReBites {plan.name} {billing === 'yearly' ? 'Tahunan' : 'Bulanan'} • berlaku s.d. {periodEndLabel}
          </p>

          {userEmail && (
            <p className="mt-4 rounded-lg bg-[#F7F5EF] px-3 py-2 text-[12px] text-[#6B6A63]">
              Pembayaran untuk <span className="font-semibold text-[#225138]">{userEmail}</span> , akan diproses via Xendit
            </p>
          )}

          <div className="mt-6 rounded-xl border border-[#DEDACF] bg-[#FCFCF9] p-4">
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-[#6B6A63]">Paket terpilih</span>
              <span className="font-semibold text-[#225138]">ReBites {plan.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[13px]">
              <span className="text-[#6B6A63]">Periode</span>
              <span className="font-medium text-[#225138]">{billing === 'yearly' ? 'Tahunan' : 'Bulanan'}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[13px]">
              <span className="text-[#6B6A63]">Fitur utama</span>
              <span className="max-w-[60%] truncate text-right text-[#225138]">{plan.features[0]}</span>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-[#DEDACF] pt-5">
            <div className="flex items-center justify-between text-[14px]">
              <dt className="text-[#6B6A63]">Subtotal</dt>
              <dd className="font-medium tabular-nums text-[#225138]">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <dt className="text-[#6B6A63]">Pajak 2%</dt>
              <dd className="font-medium tabular-nums text-[#225138]">{formatRupiah(tax)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-[#DEDACF] pt-3">
              <dt className="text-[14px] font-semibold text-[#225138]">Total</dt>
              <dd className="font-display text-[18px] font-semibold tabular-nums text-[#225138]">{formatRupiah(total)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex gap-2 rounded-xl border border-[#AEB89B]/40 bg-[#EAF2EC] px-3 py-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#225138]" />
            <p className="text-[12px] leading-relaxed text-[#225138]">
              Tidak ada form yang perlu diisi. Klik bayar untuk lanjut ke Xendit (QRIS, GoPay, OVO, DANA, ShopeePay, VA, Kartu).
            </p>
          </div>

          {errorMessage && !processing && (
            <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5">
              <p className="flex items-start gap-1.5 text-[13px] font-semibold text-red-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Pembayaran belum dapat diproses.
              </p>
              <p className="mt-1 pl-[1.375rem] text-xs leading-relaxed text-red-600">{errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="mt-6 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#225138] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(34,81,56,0.20)] transition-colors hover:bg-[#143B2D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses…
              </>
            ) : (
              `Bayar ${formatRupiah(total)} via Xendit`
            )}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-[#9A9994]">Aman & terverifikasi otomatis oleh Xendit. Pajak 2% sudah termasuk.</p>
        </div>

        {/* RIGHT - Plan include pure detail */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DEDACF] bg-white shadow-sm lg:col-span-2">
          <div className="bg-[#F7F5EF] px-6 py-5">
            <h3 className="font-display text-[15px] font-semibold text-[#225138]">ReBites {plan.name} Plan</h3>
            <p className="mt-1 text-xs text-[#6B6A63]">Plan include:</p>
          </div>
          <div className="flex-1 bg-white px-6 py-5">
            <ul className="space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-[13px] leading-snug">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#225138]" />
                  <span className="text-[#225138]">{feature}</span>
                </li>
              ))}
              <li className="flex gap-2.5 text-[13px] leading-snug">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#225138]" />
                <span className="text-[#225138]">Pembayaran aman via Xendit</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-[#DEDACF] bg-[#F7F5EF] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6A63]">Subtotal</span>
                <span className="font-medium text-[#225138]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-[#6B6A63]">Pajak 2%</span>
                <span className="font-medium text-[#225138]">{formatRupiah(tax)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[#DEDACF] pt-2 font-semibold">
                <span className="text-[#225138]">Total</span>
                <span className="text-[#225138]">{formatRupiah(total)}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2.5 rounded-full bg-[#F7F5EF] px-3.5 py-2 ring-1 ring-black/5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#225138] text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="text-[12px] font-medium text-[#225138]">Pembayaran via Xendit, aman & instan</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#6B6A63]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#225138]" />
        1 halaman penuh, tanpa form. Klik card Basic/Standar/Max di atas untuk ganti pilihan.
      </p>
    </>
  );
}
