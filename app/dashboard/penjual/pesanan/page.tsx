'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCheck,
  ClipboardList,
  PackageCheck,
  PackageOpen,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/data';
import type { StoredOrder } from '@/lib/types';
import {
  ORDERS_UPDATED_EVENT,
  completeExpiredOrders,
  getSellerOrders,
  getOrderById,
  patchOrder,
} from '@/lib/order-storage';
import { notifyOrderCompleted, notifyOrderDelivering } from '@/lib/order-notifications';
import { getSellerUmkm } from '@/lib/product-storage';
import {
  SUB_STATUS_LABEL,
  formatOrderDateTime,
  getOrderSubStatus,
} from '@/lib/order-utils';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { Card } from '@/app/components/dashboardPenjual/Card';
import { SmartImage } from '@/app/components/SmartImage';

type OrderTab = 'berlangsung' | 'selesai' | 'semua';

const SWEEP_INTERVAL_MS = 5_000;

function useVendorOrders() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const list = await getSellerOrders();
    setOrders(list);
    setHydrated(true);
  }, []);

  useEffect(() => {
    refresh();

    const onUpdate = () => refresh();
    window.addEventListener(ORDERS_UPDATED_EVENT, onUpdate);
    const intervalId = window.setInterval(onUpdate, SWEEP_INTERVAL_MS * 6);

    return () => {
      window.removeEventListener(ORDERS_UPDATED_EVENT, onUpdate);
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  const ongoing = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'ongoing')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders]
  );

  const completed = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'completed')
        .sort(
          (a, b) =>
            (b.completedAt ?? b.createdAt).localeCompare(
              a.completedAt ?? a.createdAt
            )
        ),
    [orders]
  );

  return { orders: [...ongoing, ...completed], ongoing, completed, hydrated };
}

function StatusChip({ order }: { order: StoredOrder }) {
  const subStatus = getOrderSubStatus(order);
  const isDone = subStatus === 'selesai';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em]',
        isDone
          ? 'bg-sage-100 text-charcoal-500'
          : 'bg-primary/10 text-primary'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isDone ? 'bg-charcoal-500' : 'bg-primary'
        )}
      />
      {SUB_STATUS_LABEL[subStatus]}
    </span>
  );
}

function OrderRow({
  order,
  onAdvance,
  onComplete,
}: {
  order: StoredOrder;
  onAdvance: (order: StoredOrder) => void;
  onComplete: (orderId: string) => void;
}) {
  const isOngoing = order.status === 'ongoing';
  const subStatus = getOrderSubStatus(order);
  // Tahap awal (disiapkan) -> penjual bisa lanjut ke siap-diambil / diantar.
  const isPreparing = isOngoing && (subStatus === 'diproses' || subStatus === 'disiapkan');
  const advanceLabel = order.fulfillment === 'delivery' ? 'Sedang Diantar' : 'Siap Diambil';
  const AdvanceIcon = order.fulfillment === 'delivery' ? Truck : PackageCheck;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-sage-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sage-100">
        <SmartImage src={order.image} alt={`Foto ${order.productName}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-charcoal-900">
            {order.productName}
            {order.quantity > 1 && (
              <span className="font-medium text-sage-500"> × {order.quantity}</span>
            )}
          </p>
          <StatusChip order={order} />
        </div>
        <p className="mt-1 truncate text-xs text-sage-500">
          {order.orderId} ·{' '}
          {order.fulfillment === 'delivery' ? 'Diantar' : 'Ambil sendiri'} ·{' '}
          {formatOrderDateTime(order.createdAt)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <p className="text-sm font-bold text-primary">
          {formatRupiah(order.total)}
        </p>
        {isOngoing ? (
          isPreparing ? (
            <button
              type="button"
              onClick={() => onAdvance(order)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-caramel"
            >
              <AdvanceIcon className="h-3.5 w-3.5" />
              {advanceLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(order.orderId)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-caramel"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tandai Selesai
            </button>
          )
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sage-500">
            <ClipboardList className="h-3.5 w-3.5" />
            Selesai diproses
          </span>
        )}
      </div>
    </li>
  );
}

function EmptyState({ hasAnyOrders }: { hasAnyOrders: boolean }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-primary">
        {hasAnyOrders ? (
          <PackageOpen className="h-6 w-6" />
        ) : (
          <ShoppingBag className="h-6 w-6" />
        )}
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-bold text-charcoal-900">
          {hasAnyOrders ? 'Tidak ada pesanan pada tab ini' : 'Belum ada pesanan masuk'}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-sage-500">
          {hasAnyOrders
            ? 'Coba buka tab lain untuk melihat pesanan berlangsung atau selesai.'
            : 'Pesanan dari pembeli akan muncul di sini. Untuk demo, buat pesanan lewat halaman toko sebagai pembeli, datanya langsung tersinkron.'}
        </p>
      </div>
    </Card>
  );
}

export default function PesananMasukPage() {
  const { orders, ongoing, completed, hydrated } = useVendorOrders();
  const [tab, setTab] = useState<OrderTab>('berlangsung');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    let cancelled = false;
    getSellerUmkm().then((umkm) => {
      if (!cancelled && umkm) setStoreName(umkm.businessName);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdvance = useCallback((order: StoredOrder) => {
    const next = order.fulfillment === 'delivery' ? 'diantar' : 'siap-diambil';
    patchOrder(order.orderId, { progressStatus: next }).then((updated) => {
      // Notifikasi pembeli: "Siap Diambil" / "Sedang Diantar" (best-effort).
      if (updated) notifyOrderDelivering(updated).catch(() => {});
    });
  }, []);

  const handleComplete = useCallback((orderId: string) => {
    getOrderById(orderId).then((order) => {
      patchOrder(orderId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      if (order) {
        notifyOrderCompleted({
          ...order,
          status: 'completed',
          completedAt: new Date().toISOString(),
        });
      }
    });
  }, []);

  const tabs = [
    { value: 'berlangsung' as const, label: `Berlangsung (${ongoing.length})` },
    { value: 'selesai' as const, label: `Selesai (${completed.length})` },
    { value: 'semua' as const, label: `Semua (${orders.length})` },
  ];

  const visibleOrders =
    tab === 'berlangsung'
      ? ongoing
      : tab === 'selesai'
        ? completed
        : orders;

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
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-primary">
          Pesanan Masuk
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <Store className="h-3.5 w-3.5" />
          Pesanan pembeli untuk {storeName || 'tokomu'}
        </p>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter status pesanan">
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => setTab(item.value)}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
              tab === item.value
                ? 'bg-primary text-white shadow-sm shadow-primary/25'
                : 'border border-sage-100 bg-white text-charcoal-500 hover:text-charcoal-900'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {!hydrated ? null : visibleOrders.length === 0 ? (
          <EmptyState hasAnyOrders={orders.length > 0} />
        ) : (
          <ul className="space-y-3">
            {visibleOrders.map((order) => (
              <OrderRow
                key={order.orderId}
                order={order}
                onAdvance={handleAdvance}
                onComplete={handleComplete}
              />
            ))}
          </ul>
        )}
      </div>
    </SellerShell>
  );
}
