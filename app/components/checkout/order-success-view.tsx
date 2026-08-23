'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Coins,
  MapPin,
  ReceiptText,
  Truck,
} from 'lucide-react';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import { getOrderById } from '@/lib/order-storage';
import type { StoredOrder } from '@/lib/types';
import { AnimatedNumber } from './animated-number';

const EASE = [0.22, 1, 0.36, 1] as const;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PAYMENT_NAMES: Record<string, string> = {
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  'transfer-bank': 'Transfer Bank',
};

/**
 * Halaman "Pesanan Berhasil".
 * HANYA menampilkan data order — Coin sudah diberikan saat submit
 * di halaman checkout, sehingga refresh halaman ini tidak menambah Coin.
 */
export function OrderSuccessView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  /* undefined = memuat; null = tidak ditemukan */
  const [order, setOrder] = useState<StoredOrder | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!orderId) {
      router.replace('/home');
      return;
    }
    setOrder(getOrderById(orderId));
  }, [orderId, router]);

  useEffect(() => {
    if (order === null) router.replace('/home');
  }, [order, router]);

  if (order === undefined || order === null) {
    return <main className="min-h-screen bg-cream-50" />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-cream-50 px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-sage-100 bg-white shadow-[0_40px_80px_-30px_rgba(47,66,53,0.25)]"
      >
        {/* Header sukses */}
        <div className="relative overflow-hidden bg-green-700 px-8 pb-10 pt-9 text-center text-white">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-green-700 shadow-lg"
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </motion.span>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
            Pesanan Berhasil!
          </h1>
          <p className="mt-1.5 text-sm text-white/85">
            Pesanan kamu sedang diproses oleh{' '}
            <span className="font-semibold">{order.vendorName}</span>
          </p>
          <p className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tabular-nums">
            #{order.orderId}
          </p>
        </div>

        {/* Reward Coin */}
        <div className="-mt-5 px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
            className="flex items-center gap-3 rounded-2xl border border-gold-500/40 bg-gold-100 px-4 py-3.5 shadow-md shadow-gold-500/10"
          >
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.55 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white shadow"
            >
              <Coins className="h-5 w-5" />
            </motion.span>
            <div>
              <p className="font-display text-xl font-bold tabular-nums text-gold-600">
                +<AnimatedNumber value={order.coinEarned} format={(v) => v.toLocaleString('id-ID')} />{' '}
                ReBites Coin
              </p>
              <p className="text-xs text-charcoal-500">
                Coin akan ditambahkan ke saldo kamu
              </p>
            </div>
          </motion.div>
        </div>

        {/* Ringkasan pesanan */}
        <div className="px-6 pb-7 pt-5">
          <div className="flex items-start gap-4 rounded-2xl border border-sage-100 bg-cream-50 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sage-100">
              <SmartImage src={order.image} alt={order.productName} sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-charcoal-900">
                {order.productName}
              </p>
              <p className="mt-0.5 text-xs text-charcoal-500">
                {order.quantity} porsi ·{' '}
                {formatDateTime(order.createdAt)}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                {order.fulfillment === 'delivery' ? (
                  <>
                    <Truck className="h-3 w-3" /> Diantar
                  </>
                ) : (
                  <>
                    <MapPin className="h-3 w-3" /> Ambil Sendiri
                  </>
                )}
              </span>
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
            {order.discount > 0 && (
              <Row
                label="Diskon promo"
                value={`−${formatRupiah(order.discount)}`}
                accent
              />
            )}
            <Row label="Biaya layanan" value={formatRupiah(order.serviceFee)} />
            {order.deliveryFee > 0 && (
              <Row
                label="Biaya pengantaran"
                value={formatRupiah(order.deliveryFee)}
              />
            )}
            {(order.coinUsed ?? 0) > 0 && (
              <Row
                label="ReBites Coin"
                value={`−${formatRupiah(order.coinUsed ?? 0)}`}
                accent
              />
            )}
            <div className="flex items-center justify-between border-t border-sage-100 pt-2.5">
              <dt className="font-display font-medium text-charcoal-900">
                Total
              </dt>
              <dd className="font-display text-lg font-semibold tabular-nums text-green-700">
                {formatRupiah(order.total)}
              </dd>
            </div>
            <Row
              label="Metode pembayaran"
              value={PAYMENT_NAMES[order.paymentMethodId] ?? '—'}
            />
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/riwayatPesanan"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-green-700 px-4 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <ReceiptText className="h-4 w-4" />
              Riwayat
            </Link>
            <Link
              href="/home"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition-colors hover:bg-green-600"
            >
              Beranda
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-charcoal-500">{label}</dt>
      <dd
        className={
          accent
            ? 'font-medium tabular-nums text-green-700'
            : 'font-medium tabular-nums text-charcoal-900'
        }
      >
        {value}
      </dd>
    </div>
  );
}
