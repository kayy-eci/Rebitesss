'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PackageSearch, SearchX } from 'lucide-react';
import type { StoredOrder } from '@/lib/types';
import { getReviewFor } from '@/lib/review-storage';
import { useCurrentUser } from '@/lib/current-user';
import { useOrders } from '@/hooks/use-orders';
import { OrderToolbar, type StatusFilter, type FulfillmentFilter } from './order-toolbar';
import { OrderCard } from './order-card';
import { OrderDetailModal } from './order-detail-modal';
import { Toaster } from '@/app/components/ui/toaster';

export function OrderHistoryView() {
  const { orders, activeOrders, completedOrders, loading } = useOrders();
  const { userId } = useCurrentUser();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [fulfillment, setFulfillment] = useState<FulfillmentFilter>('all');
  const [dateRange, setDateRange] = useState('all');
  const [detailOrder, setDetailOrder] = useState<StoredOrder | null>(null);

  const [reviewsTick, setReviewsTick] = useState(0);
  const [reviewedMap, setReviewedMap] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    if (!userId) {
      setReviewedMap(new Set());
      return;
    }
    (async () => {
      const map = new Set<string>();
      for (const order of completedOrders) {
        const review = await getReviewFor(order.orderId, userId);
        if (review) map.add(order.orderId);
      }
      if (mounted) setReviewedMap(map);
    })();
    return () => {
      mounted = false;
    };
  }, [completedOrders, reviewsTick, userId]);

  const statusToList = (filter: StatusFilter): StoredOrder[] => {
    if (filter === 'all') return orders ?? [];
    if (filter === 'ongoing') return activeOrders;
    if (filter === 'delivered') return completedOrders;
    if (filter === 'cancelled') return [];
    return orders ?? [];
  };

  const baseList = statusToList(statusFilter);

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseList.filter((order) => {
      if (fulfillment !== 'all' && order.fulfillment !== fulfillment) {
        return false;
      }
      if (dateRange !== 'all') {
        const now = Date.now();
        const created = new Date(order.createdAt).getTime();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        if (dateRange === '7d' && diffDays > 7) return false;
        if (dateRange === '30d' && diffDays > 30) return false;
        if (dateRange === '90d' && diffDays > 90) return false;
      }
      if (q) {
        const haystacks = [order.orderId, order.productName, order.vendorName];
        if (!haystacks.some((h) => h.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [baseList, fulfillment, query, dateRange]);

  if (loading) {
    return (
      <div className="w-full space-y-5">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-white ring-1 ring-hairline" />
        <div className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-white" />
        <div className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white" />
      </div>
    );
  }

  const isFiltering = query.trim() !== '' || fulfillment !== 'all' || dateRange !== 'all' || statusFilter !== 'all';

  const counts = {
    all: orders.length,
    ongoing: activeOrders.length,
    delivered: completedOrders.length,
    cancelled: 0,
  };

  return (
    <>
      <div className="w-full space-y-4">
        {/* Filter card like foto: pills top, no breadcrumb */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <OrderToolbar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={counts}
            query={query}
            onQueryChange={setQuery}
            fulfillment={fulfillment}
            onFulfillmentChange={setFulfillment}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {filteredList.length > 0 ? (
          <div className="space-y-3">
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
            variant={isFiltering ? 'no-result' : orders.length === 0 ? 'empty' : 'tab'}
            isCompletedTab={statusFilter === 'delivered'}
            onClear={() => {
              setQuery('');
              setFulfillment('all');
              setDateRange('all');
              setStatusFilter('all');
            }}
          />
        )}
      </div>

      {/* Popup detail - existing feature, click card */}
      <OrderDetailModal
        order={detailOrder}
        userId={userId}
        onClose={() => setDetailOrder(null)}
        onReviewed={() => setReviewsTick((t) => t + 1)}
      />
      <Toaster />
    </>
  );
}

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
      <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <SearchX className="h-5 w-5" />
        </span>
        <h3 className="mt-3 font-display text-base font-medium text-zinc-900">Pesanan tidak ditemukan</h3>
        <p className="mt-1 max-w-xs text-sm text-zinc-500">Coba cari dengan Order ID atau nama produk lain.</p>
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex h-9 items-center rounded-full border border-[#7A1C1C] px-5 text-xs font-semibold text-[#7A1C1C] hover:bg-[#7A1C1C] hover:text-white"
        >
          Hapus Filter
        </button>
      </div>
    );
  }

  if (variant === 'tab') {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <PackageSearch className="h-5 w-5" />
        </span>
        <h3 className="mt-3 font-display text-base font-medium text-zinc-900">
          {isCompletedTab ? 'Belum ada pesanan selesai' : 'Tidak ada pesanan'}
        </h3>
        <p className="mt-1 max-w-xs text-sm text-zinc-500">
          {isCompletedTab ? 'Pesanan yang sudah selesai akan muncul di sini.' : 'Semua pesananmu sudah selesai.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-100 text-green-700">
        <PackageSearch className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-display text-base font-medium text-zinc-900">Belum Ada Pesanan</h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500">Pesanan yang kamu lakukan akan muncul di sini.</p>
      <Link href="/home" className="mt-4 inline-flex h-9 items-center rounded-full bg-[#225138] px-5 text-xs font-semibold text-white hover:bg-[#143B2D]">
        Mulai Belanja
      </Link>
    </div>
  );
}
