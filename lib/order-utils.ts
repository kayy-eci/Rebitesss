import type { StoredOrder } from './types';
import { paymentMethods } from '@/app/components/checkout/payment-methods';

/** Helper tampilan bersama untuk Order Center. */

export function paymentMethodName(id?: string): string {
  if (!id) return '—';
  return paymentMethods.find((m) => m.id === id)?.name ?? id;
}

export function formatOrderDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatOrderTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Milidetik tersisa menuju estimasi selesai (≥0). */
export function getRemainingMs(order: StoredOrder): number {
  if (!order.estimatedCompletionAt) return 0;
  return Math.max(0, new Date(order.estimatedCompletionAt).getTime() - Date.now());
}

/** Rasio waktu berjalan 0→1 berdasarkan createdAt vs estimatedCompletionAt. */
export function getOrderProgress(order: StoredOrder): number {
  if (!order.estimatedCompletionAt || order.status === 'completed') return 1;
  const start = new Date(order.createdAt).getTime();
  const end = new Date(order.estimatedCompletionAt).getTime();
  if (end <= start) return 1;
  const ratio = (Date.now() - start) / (end - start);
  return Math.min(1, Math.max(0, ratio));
}

export type OrderSubStatus =
  | 'diproses'
  | 'diantar'
  | 'disiapkan'
  | 'siap-diambil'
  | 'selesai';

/**
 * Sub-status tampilan per fulfillment — delivery dan pickup punya alur
 * berbeda. Ditentukan dari sisa waktu (implementasi sederhana sesuai
 * spesifikasi), bukan dari status terpisah.
 */
export function getOrderSubStatus(
  order: StoredOrder,
  progress = getOrderProgress(order)
): OrderSubStatus {
  if (order.status === 'completed') return 'selesai';
  /* Setelah ~60% waktu berjalan, pesanan dianggap dalam perjalanan/siap. */
  return progress >= 0.6
    ? order.fulfillment === 'delivery'
      ? 'diantar'
      : 'siap-diambil'
    : order.fulfillment === 'delivery'
      ? 'diproses'
      : 'disiapkan';
}

export const SUB_STATUS_LABEL: Record<OrderSubStatus, string> = {
  diproses: 'Sedang diproses',
  diantar: 'Sedang diantar',
  disiapkan: 'Sedang disiapkan',
  'siap-diambil': 'Siap diambil',
  selesai: 'Selesai',
};

/** Link Google Maps untuk alamat toko / tujuan. */
export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Timeline aktivitas order — SEMUA timestamp diturunkan dari data yang
 * tersimpan saat checkout (createdAt, preparationMinutes,
 * estimatedCompletionAt/completedAt). Tidak ada angka acak.
 */
export interface OrderTimelineEntry {
  timeIso: string;
  label: string;
  done: boolean;
}

export function getOrderTimeline(order: StoredOrder): OrderTimelineEntry[] {
  const created = new Date(order.createdAt).getTime();
  const readyAt =
    created + Math.max(0, order.preparationMinutes ?? 20) * 60_000;
  const finishedIso = order.completedAt ?? order.estimatedCompletionAt;
  const finished = finishedIso ? new Date(finishedIso).getTime() : NaN;
  const isDone = order.status === 'completed';

  const entries: OrderTimelineEntry[] = [
    { timeIso: order.createdAt, label: 'Pesanan dibuat', done: true },
    ...(isDone || !Number.isNaN(finished)
      ? [
          {
            timeIso: new Date(readyAt).toISOString(),
            label:
              order.fulfillment === 'pickup'
                ? 'Siap diambil'
                : 'Kurir mengambil pesanan',
            done: isDone || Date.now() >= readyAt,
          },
        ]
      : []),
    {
      timeIso: finishedIso ?? new Date(readyAt).toISOString(),
      label:
        order.fulfillment === 'pickup'
          ? 'Diterima di lokasi'
          : 'Tiba di tujuan',
      done: isDone,
    },
  ];
  return entries;
}
