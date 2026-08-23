'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PackageSearch, SearchX } from 'lucide-react';
import type { StoredOrder } from '@/lib/types';
import { getReviewFor } from '@/lib/review-storage';
import { getCurrentUserId } from '@/lib/current-user';
import { useOrders } from '@/hooks/use-orders';
import {
  OrderToolbar,
  type FulfillmentFilter,
  type OrderTab,
} from './order-toolbar';
import { OrderCard } from './order-card';
import { OrderDetailModal } from './order-detail-modal';
import { OrderPageHeader } from './page-header';
import { Toaster } from '@/app/components/ui/toaster';

/**
 * Pesanan Saya — Transaction History + Order Tracking.
 *
 * Struktur sederhana: Header → Search/Filter → Tab → Daftar Pesanan.
 * Bukan dashboard: tanpa statistik spending/Coin/analytics — semua
 * angka hanya berkaitan dengan transaksi yang pernah dibuat user
 * (identitas via getCurrentUserId).
 */
export function OrderHistoryView() {
  const { orders, activeOrders, completedOrders, loading } = useOrders();

  const [tab, setTab] = useState<OrderTab>('active');
  const [query, setQuery] = useState('');
  const [fulfillment, setFulfillment] = useState<FulfillmentFilter>('all');
  const [detailOrder, setDetailOrder] = useState<StoredOrder | null>(null);
  /* Naikkan tiap review tersimpan agar indikator "✓ Sudah Dinilai" ikut segar. */
  const [reviewsTick, setReviewsTick] = useState(0);

  /* Urutan tetap: ongoing terbaru dulu; selesai per completedAt desc. */
  const baseList =
    tab === 'active' ? activeOrders : completedOrders;

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseList.filter((order) => {
      if (fulfillment !== 'all' && order.fulfillment !== fulfillment) {
        return false;
      }
      if (q) {
        const haystacks = [order.orderId, order.productName, order.vendorName];
        if (!haystacks.some((h) => h.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [baseList, fulfillment, query]);

  const reviewedMap = useMemo(() => {
    void reviewsTick;
    const map = new Set<string>();
    for (const order of completedOrders) {
      if (getReviewFor(order.orderId, getCurrentUserId())) map.add(order.orderId);
    }
    return map;
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [completedOrders, reviewsTick]);

  if (loading) {
    return (
      <div className="w-full space-y-5">
        <div className="h-14 w-56 animate-pulse rounded-xl bg-white ring-1 ring-hairline" />
        <div className="h-24 animate-pulse rounded-2xl bg-white ring-1 ring-hairline" />
        <div className="h-52 animate-pulse rounded-2xl bg-white ring-1 ring-hairline" />
      </div>
    );
  }

  const isFiltering = query.trim() !== '' || fulfillment !== 'all';

  return (
    <>
      <div className="w-full space-y-6">
        <OrderPageHeader />

        {/* Tab + Search/Filter */}
        <div className="rounded-2xl border border-hairline bg-white p-4 shadow-[0_10px_30px_-22px_rgba(27,77,50,0.35)] sm:p-5">
          <OrderToolbar
            tab={tab}
            onTabChange={setTab}
            activeCount={activeOrders.length}
            completedCount={completedOrders.length}
            query={query}
            onQueryChange={setQuery}
            fulfillment={fulfillment}
            onFulfillmentChange={setFulfillment}
          />
        </div>

        {/* Daftar pesanan */}
        {filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                reviewed={reviewedMap.has(order.orderId)}
                onViewDetail={setDetailOrder}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            variant={
              isFiltering ? 'no-result' : orders.length === 0 ? 'empty' : 'tab'
            }
            isCompletedTab={tab === 'completed'}
            onClear={() => {
              setQuery('');
              setFulfillment('all');
            }}
          />
        )}
      </div>

      <OrderDetailModal
        order={detailOrder}
        userId={getCurrentUserId()}
        onClose={() => setDetailOrder(null)}
        onReviewed={() => setReviewsTick((t) => t + 1)}
      />
      <Toaster />
    </>
  );
}

/* ── Empty states sesuai kondisi ── */
function EmptyState({
  variant,
  isCompletedTab,
  onClear,
}: {
  variant: 'empty' | 'no-result' | 'tab';
  isCompletedTab: boolean;
  onClear: () => void;
}) {
  if (variant === 'no-result') {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-cream-50 px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-charcoal-500">
          <SearchX className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-medium text-charcoal-900">
          Pesanan tidak ditemukan
        </h3>
        <p className="mt-1 max-w-xs text-sm text-charcoal-500">
          Coba cari dengan nama produk, toko, atau Order ID lain.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex h-10 items-center rounded-full border border-green-700 px-5 text-[13px] font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
        >
          Hapus Pencarian
        </button>
      </div>
    );
  }

  if (variant === 'tab') {
    /* Tab ini kosong, tapi user punya pesanan di tab sebelah. */
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-cream-50 px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-700">
          <PackageSearch className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-display text-lg font-medium text-charcoal-900">
          {isCompletedTab
            ? 'Belum ada pesanan selesai'
            : 'Tidak ada pesanan yang sedang berlangsung'}
        </h3>
        <p className="mt-1 max-w-xs text-sm text-charcoal-500">
          {isCompletedTab
            ? 'Pesanan yang sudah selesai akan muncul di sini.'
            : 'Semua pesananmu sudah selesai.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-hairline bg-cream-50 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-600">
        <PackageSearch className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-medium text-charcoal-900">
        Belum Ada Pesanan
      </h3>
      <p className="mt-1 max-w-xs text-sm text-charcoal-500">
        Pesanan yang kamu lakukan akan muncul di sini.
      </p>
      <Link
        href="/home"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-green-700 px-5 text-[13px] font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
      >
        Mulai Belanja
      </Link>
    </div>
  );
}
