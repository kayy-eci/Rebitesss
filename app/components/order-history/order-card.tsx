'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Coins,
  MapPin,
  ReceiptText,
  RotateCcw,
  Star,
  Store,
  Truck,
} from 'lucide-react';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import { fetchProductDetail } from '@/app/detail/product/detail-data';
import type { StoredOrder } from '@/lib/types';
import {
  getOrderProgress,
  getOrderSubStatus,
  SUB_STATUS_LABEL,
} from '@/lib/order-utils';
import { useCountdown, formatCountdown } from '@/lib/useCountdown';
import { formatOrderDate } from '@/lib/order-utils';
import { toast } from '@/hooks/use-toast';

export function OrderCard({
  order,
  reviewed,
  onViewDetail,
}: {
  order: StoredOrder;
  reviewed: boolean;
  onViewDetail: (order: StoredOrder) => void;
}) {
  const router = useRouter();
  const [reordering, setReordering] = useState(false);
  const isOngoing = order.status === 'ongoing';
  const subStatus = getOrderSubStatus(order);

  const handleReorder = async () => {
    if (reordering) return;
    setReordering(true);
    const product = await fetchProductDetail(order.productId);
    if (!product) {
      setReordering(false);
      toast({
        title: 'Produk ini sudah tidak tersedia',
        description: 'Coba jelajahi menu lain yang masih tersedia.',
      });
      return;
    }

    router.push(
      `/detail/pesanan?product=${encodeURIComponent(order.productId)}&qty=${order.quantity}`
    );
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-hairline bg-white p-4 shadow-[0_10px_30px_-24px_rgba(27,77,50,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sage-500/40 hover:shadow-[0_16px_38px_-24px_rgba(27,77,50,0.45)] sm:p-5">
      { }
      <div className="flex items-center gap-2.5">
        <span
          className={
            order.fulfillment === 'pickup'
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-600'
              : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700'
          }
        >
          <Store className="h-4 w-4" strokeWidth={2.1} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-charcoal-900">
            {order.vendorName}
          </p>
          <p className="text-[11px] text-charcoal-500">
            #{order.orderId}
          </p>
        </div>
        <StatusBadge order={order} subStatus={subStatus} />
      </div>

      { }
      <div className="mt-3.5 flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sage-100">
          <SmartImage src={order.image} alt={order.productName} sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-charcoal-900">
            {order.productName}
          </p>
          <p className="mt-0.5 text-xs text-charcoal-500">
            ×{order.quantity}
            {typeof order.unitPrice === 'number'
              ? ` · ${formatRupiah(order.unitPrice)} / porsi`
              : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-sm font-semibold tabular-nums text-charcoal-900">
            {formatRupiah(order.total)}
          </p>
          {(order.coinEarned ?? 0) > 0 && (
            <p className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-medium text-gold-600">
              <Coins className="h-3 w-3" />+{order.coinEarned.toLocaleString('id-ID')}
            </p>
          )}
        </div>
      </div>

      { }
      {isOngoing ? (
        <OngoingFulfillmentBlock order={order} />
      ) : (
        <CompletedFulfillmentBlock order={order} reviewed={reviewed} />
      )}

      { }
      <div className="mt-auto flex items-center gap-2 pt-3">
        {isOngoing ? (
          <button
            type="button"
            onClick={() => onViewDetail(order)}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-green-700 px-3 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
          >
            <ReceiptText className="h-3.5 w-3.5" />
            Lihat Detail Pesanan
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onViewDetail(order)}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-green-700 px-3 text-xs font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <ReceiptText className="h-3.5 w-3.5" />
              Lihat Detail
            </button>
            <button
              type="button"
              onClick={handleReorder}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-green-700 px-3 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600 disabled:opacity-60"
              disabled={reordering}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Pesan Lagi
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function StatusBadge({
  order,
  subStatus,
}: {
  order: StoredOrder;
  subStatus: ReturnType<typeof getOrderSubStatus>;
}) {
  if (order.status !== 'ongoing') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-semibold text-sage-600">
        <Check className="h-3 w-3" strokeWidth={3} />
        Selesai
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-700/15">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute h-full w-full animate-ping rounded-full bg-green-600 opacity-60" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-green-700" />
      </span>
      {SUB_STATUS_LABEL[subStatus]}
    </span>
  );
}

function OngoingFulfillmentBlock({ order }: { order: StoredOrder }) {
  const remaining = useCountdown(order.estimatedCompletionAt ?? order.createdAt);
  const progress =
    remaining === null ? undefined : getOrderProgress(order);
  const subStatus = getOrderSubStatus(order, progress);
  const isDelivery = order.fulfillment === 'delivery';
  const minutes = Math.max(1, Math.ceil((remaining ?? 0) / 60));
  const almostThere = remaining !== null && remaining > 0 && remaining <= 180;

  return (
    <div className="mt-3.5 rounded-xl bg-cream-50 p-3.5 ring-1 ring-hairline">
      <p
        className={
          isDelivery
            ? 'flex items-center gap-1.5 text-xs font-semibold text-green-700'
            : 'flex items-center gap-1.5 text-xs font-semibold text-gold-600'
        }
      >
        {isDelivery ? (
          <>
            <Truck className="h-3.5 w-3.5" /> Diantar
          </>
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5" /> Ambil Sendiri
          </>
        )}
      </p>

      <p className="mt-1 truncate text-xs text-charcoal-500">
        {isDelivery ? (
          order.addressSnapshot ? (
            <>
              Ke {order.addressSnapshot.label} ·{' '}
              {order.addressSnapshot.fullAddress}
              {typeof order.distanceKm === 'number' &&
                ` · ${order.distanceKm.toLocaleString('id-ID')} km`}
            </>
          ) : (
            'Alamat pengiriman'
          )
        ) : (
          order.vendorAddress ?? order.vendorName
        )}
      </p>

      <div className="mt-2.5 flex items-end justify-between gap-3">
        <p className="text-xs font-medium text-charcoal-900">
          {remaining !== null && remaining <= 0 ? (
            'Pesanan selesai'
          ) : almostThere ? (
            isDelivery ? (
              'Hampir sampai!'
            ) : (
              'Hampir siap!'
            )
          ) : isDelivery ? (
            <>Perkiraan tiba dalam {minutes} menit</>
          ) : (
            <>Siap diambil dalam {minutes} menit</>
          )}
        </p>
        <p
          className={`font-display text-base font-semibold tabular-nums ${
            almostThere ? 'text-gold-600' : 'text-charcoal-900'
          }`}
        >
          {remaining === null ? (
            <span className="inline-block h-4 w-14 animate-pulse rounded bg-sage-100" />
          ) : (
            formatCountdown(remaining)
          )}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Progres pesanan"
        aria-valuenow={Math.round(getOrderProgress(order) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sage-100"
      >
        <div
          className="h-full rounded-full bg-green-700 transition-all duration-1000"
          style={{ width: `${getOrderProgress(order) * 100}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] text-charcoal-500">
        {SUB_STATUS_LABEL[subStatus]}
      </p>
    </div>
  );
}

function CompletedFulfillmentBlock({
  order,
  reviewed,
}: {
  order: StoredOrder;
  reviewed: boolean;
}) {
  const finishedIso = order.completedAt ?? order.estimatedCompletionAt;
  return (
    <div className="mt-3.5 rounded-xl bg-cream-50 p-3.5 ring-1 ring-hairline">
      <p
        className={
          order.fulfillment === 'delivery'
            ? 'flex items-center gap-1.5 text-xs font-semibold text-green-700'
            : 'flex items-center gap-1.5 text-xs font-semibold text-gold-600'
        }
      >
        {order.fulfillment === 'delivery' ? (
          <>
            <Truck className="h-3.5 w-3.5" /> Diantar
          </>
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5" /> Ambil Sendiri
          </>
        )}
      </p>
      <p className="mt-1 truncate text-xs text-charcoal-500">
        {order.fulfillment === 'delivery'
          ? `Ke ${order.addressSnapshot?.label ?? 'alamat'}${
              typeof order.distanceKm === 'number'
                ? ` · ${order.distanceKm.toLocaleString('id-ID')} km`
                : ''
            }`
          : `Di ${order.vendorAddress ?? order.vendorName}`}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] text-charcoal-500">
          {finishedIso
            ? `Selesai pada ${formatOrderDate(finishedIso)} · ${new Date(finishedIso)
                .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
            : `Dibuat ${formatOrderDate(order.createdAt)}`}
        </p>
        {reviewed && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-green-700">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            Sudah dinilai
          </span>
        )}
      </div>
    </div>
  );
}
