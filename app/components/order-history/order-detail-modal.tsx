'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Coins,
  Copy,
  MapPin,
  RotateCcw,
  Star,
  Store,
  Truck,
} from 'lucide-react';
import { SmartImage } from '@/app/components/SmartImage';
import { formatRupiah } from '@/lib/data';
import { getProductById } from '@/app/detail/product/data';
import type { StoredOrder } from '@/lib/types';
import {
  getOrderSubStatus,
  getOrderTimeline,
  mapsUrl,
  paymentMethodName,
} from '@/lib/order-utils';
import {
  formatOrderDate,
  formatOrderTime,
  SUB_STATUS_LABEL,
} from '@/lib/order-utils';
import { useCountdown, formatCountdown } from '@/lib/useCountdown';
import { getReviewFor, saveReview } from '@/lib/review-storage';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

export function OrderDetailModal({
  order,
  userId,
  onClose,
  onReviewed,
}: {
  order: StoredOrder | null;
  userId: string | null;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const existingReview = useMemo(() => {
    if (!order || !userId) return undefined;
    return getReviewFor(order.orderId, userId);
  }, [order, userId]);

  const handleCopy = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      toast({ title: 'Order ID disalin' });
    } catch {
      toast({
        title: 'Gagal menyalin',
        description: `Salin manual: #${order.orderId}`,
      });
    }
  };

  const handleReorder = () => {
    if (!order) return;
    const product = getProductById(order.productId);
    if (!product) {
      toast({ title: 'Produk ini sudah tidak tersedia' });
      return;
    }
    router.push(
      `/detail/pesanan?product=${encodeURIComponent(order.productId)}&qty=${order.quantity}`
    );
  };

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92dvh] w-[min(560px,100vw-1rem)] flex-col sm:max-h-[85vh]">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Detail Pesanan</DialogTitle>
              <DialogDescription className="sr-only">
                Rincian transaksi pesanan ReBites.
              </DialogDescription>
            </DialogHeader>

            <div className="-mx-1 mt-1 min-h-0 flex-1 overflow-y-auto px-1">
              { }
              <div className="flex items-center justify-between gap-2 rounded-xl bg-cream-100 px-3 py-2">
                <p className="truncate font-display text-sm font-semibold tabular-nums text-charcoal-900">
                  #{order.orderId}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-white px-3 text-xs font-semibold text-charcoal-900 transition-colors hover:border-sage-500/50 hover:text-green-700"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-700" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Salin ID
                </button>
              </div>

              <StatusStrip order={order} />

              { }
              <SectionTitle>Produk</SectionTitle>
              <div className="mt-2 flex items-center gap-3 rounded-xl ring-1 ring-hairline p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sage-100">
                  <SmartImage src={order.image} alt={order.productName} sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-charcoal-900">
                    {order.productName}
                  </p>
                  <p className="text-xs text-charcoal-500">{order.vendorName}</p>
                  <p className="mt-0.5 text-xs text-charcoal-500">
                    ×{order.quantity}
                    {typeof order.unitPrice === 'number'
                      ? ` · ${formatRupiah(order.unitPrice)} / porsi`
                      : ''}
                    {' · '}
                    Subtotal {formatRupiah(order.subtotal)}
                  </p>
                </div>
              </div>

              { }
              <SectionTitle>
                {order.fulfillment === 'delivery' ? 'Pengiriman' : 'Pengambilan'}
              </SectionTitle>
              <FulfillmentSection order={order} />

              { }
              <SectionTitle>Pembayaran</SectionTitle>
              <dl className="mt-2 space-y-2 rounded-xl ring-1 ring-hairline p-3.5 text-sm">
                <Row label="Subtotal" value={formatRupiah(order.subtotal)} />
                {order.discount > 0 && (
                  <Row
                    label={`Diskon promo${order.promoCode ? ` (${order.promoCode})` : ''}`}
                    value={`−${formatRupiah(order.discount)}`}
                    accent
                  />
                )}
                <Row label="Biaya admin" value={formatRupiah(order.serviceFee)} />
                {order.deliveryFee > 0 && (
                  <Row label="Biaya pengantaran" value={formatRupiah(order.deliveryFee)} />
                )}
                {(order.coinUsed ?? 0) > 0 && (
                  <Row
                    label="ReBites Coin digunakan"
                    value={`−${(order.coinUsed ?? 0).toLocaleString('id-ID')} Coin`}
                    accent
                  />
                )}
                <div className="flex items-center justify-between border-t border-hairline pt-2.5">
                  <dt className="font-display font-medium text-charcoal-900">Total</dt>
                  <dd className="font-display text-lg font-semibold tabular-nums text-green-700">
                    {formatRupiah(order.total)}
                  </dd>
                </div>
              </dl>

              { }
              {(order.coinEarned ?? 0) > 0 && (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-gold-100 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                    <Coins className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold tabular-nums text-gold-600">
                      +{order.coinEarned.toLocaleString('id-ID')} Coin diperoleh
                    </p>
                    <p className="text-xs text-charcoal-500">
                      Reward pembelian masuk ke saldo Coin kamu
                    </p>
                  </div>
                </div>
              )}

              { }
              <SectionTitle>Riwayat Status</SectionTitle>
              <ol className="mt-2 space-y-2.5 rounded-xl ring-1 ring-hairline p-3.5">
                {getOrderTimeline(order).map((entry) => (
                  <li key={`${entry.label}-${entry.timeIso}`} className="flex items-start gap-3">
                    <span
                      className={
                        entry.done
                          ? 'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-700 text-white'
                          : 'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-hairline bg-white'
                      }
                    >
                      {entry.done && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-charcoal-900">
                        {entry.label}
                      </span>
                      <span className="block text-xs text-charcoal-500">
                        {formatOrderTime(entry.timeIso)}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              { }
              <SectionTitle>Informasi Pesanan</SectionTitle>
              <dl className="mt-2 space-y-2 rounded-xl ring-1 ring-hairline p-3.5 text-sm">
                <Row label="Order ID" value={`#${order.orderId}`} mono />
                <Row label="Tanggal" value={formatOrderDate(order.createdAt)} />
                <Row label="Waktu" value={formatOrderTime(order.createdAt)} />
                <Row label="Metode pembayaran" value={paymentMethodName(order.paymentMethodId)} />
                <Row
                  label="Status"
                  value={
                    order.status === 'completed'
                      ? 'Selesai'
                      : SUB_STATUS_LABEL[getOrderSubStatus(order)]
                  }
                />
                {typeof order.co2eSavedKg === 'number' && (
                  <Row
                    label="CO₂e dicegah"
                    value={`≈ ${order.co2eSavedKg.toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                    })} kg`}
                  />
                )}
              </dl>

              { }
              {order.status === 'completed' && (
                <ReviewBlock
                  orderId={order.orderId}
                  vendorName={order.vendorName}
                  productName={order.productName}
                  userId={userId}
                  existing={existingReview}
                  onSaved={() => {
                    toast({ title: 'Penilaian tersimpan', description: 'Terima kasih atas ulasannya!' });
                    onReviewed();
                  }}
                />
              )}
            </div>

            { }
            <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
              {order.status === 'completed' && (
                <button
                  type="button"
                  onClick={handleReorder}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-4 text-sm font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Pesan Lagi
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-green-700 px-4 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatusStrip({ order }: { order: StoredOrder }) {
  const remaining = useCountdown(order.estimatedCompletionAt ?? order.createdAt);
  if (order.status === 'completed') {
    const at = order.completedAt ?? order.estimatedCompletionAt;
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-sage-100 px-3 py-2 text-xs font-semibold text-sage-600">
        <Check className="h-4 w-4" strokeWidth={3} />
        Selesai{at ? ` pada ${formatOrderDateTimeShort(at)}` : ''}
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-green-50 px-3 py-2.5 ring-1 ring-green-700/15">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-green-600 opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-green-700" />
        </span>
        {SUB_STATUS_LABEL[getOrderSubStatus(order)]}
        {remaining !== null && remaining > 0 && (
          <span className="text-charcoal-500">
            ·{' '}
            {order.fulfillment === 'delivery'
              ? `Perkiraan tiba dalam ${Math.max(1, Math.ceil(remaining / 60))} menit`
              : `Siap diambil dalam ${Math.max(1, Math.ceil(remaining / 60))} menit`}
          </span>
        )}
      </span>
      <span className="font-display text-base font-semibold tabular-nums text-green-700">
        {remaining !== null && remaining > 0 ? formatCountdown(remaining) : '—'}
      </span>
    </div>
  );
}

function FulfillmentSection({ order }: { order: StoredOrder }) {
  const isDelivery = order.fulfillment === 'delivery';

  return (
    <div className="mt-2 space-y-3 rounded-xl ring-1 ring-hairline p-3.5">
      { }
      <div className="flex items-start gap-3">
        <span
          className={
            isDelivery
              ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700'
              : 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-600'
          }
        >
          <Store className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-charcoal-900">
            {isDelivery ? 'Dari toko' : 'Ambil di'}
          </p>
          <p className="text-[13px] text-charcoal-900">{order.vendorName}</p>
          <p className="text-xs text-charcoal-500">{order.vendorAddress ?? '—'}</p>
          {!isDelivery && order.vendorOpenHours && (
            <p className="mt-0.5 text-xs text-charcoal-500">
              Jam operasional {order.vendorOpenHours}
            </p>
          )}
          <a
            href={mapsUrl(order.vendorAddress ?? '')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
          >
            <MapPin className="h-3 w-3" /> Lihat Lokasi
          </a>
        </div>
      </div>

      {isDelivery && order.addressSnapshot && (
        <>
          <div className="ml-4 h-px bg-hairline" style={{ width: 24 }} />
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <Truck className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-charcoal-900">
                Ke {order.addressSnapshot.label}
              </p>
              <p className="text-[13px] text-charcoal-900">
                {order.addressSnapshot.receiverName} · {order.addressSnapshot.phone}
              </p>
              <p className="break-words text-xs text-charcoal-500">
                {order.addressSnapshot.fullAddress}, {order.addressSnapshot.district},{' '}
                {order.addressSnapshot.city}, {order.addressSnapshot.province}
              </p>
              {order.addressSnapshot.note && (
                <p className="mt-0.5 text-xs italic text-charcoal-500">
                  Catatan: {order.addressSnapshot.note}
                </p>
              )}
              {typeof order.distanceKm === 'number' && (
                <p className="mt-1 inline-flex rounded-full bg-cream-100 px-2 py-0.5 text-[11px] font-semibold text-charcoal-900">
                  Jarak {order.distanceKm.toLocaleString('id-ID')} km · estimasi{' '}
                  {order.estimatedMinutes ?? '—'} menit
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {!isDelivery && typeof order.preparationMinutes === 'number' && (
        <p className="rounded-lg bg-cream-50 px-3 py-2 text-xs text-charcoal-500">
          Estimasi siap diambil ± {order.preparationMinutes} menit setelah pesanan dibuat.
        </p>
      )}
    </div>
  );
}

function ReviewBlock({
  orderId,
  vendorName,
  productName,
  userId,
  existing,
  onSaved,
}: {
  orderId: string;
  vendorName: string;
  productName: string;
  userId: string | null;
  existing:
    | { rating: number; comment: string; createdAt: string }
    | undefined;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [saving, setSaving] = useState(false);

  if (existing) {
    return (
      <div className="mt-6">
        <SectionTitle>Penilaianmu</SectionTitle>
        <div className="mt-2 rounded-xl ring-1 ring-hairline p-3.5">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-green-700">
            <Check className="h-4 w-4" strokeWidth={3} />
            Sudah dinilai
          </p>
          <div className="mt-1.5 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={
                  n <= existing.rating
                    ? 'h-4 w-4 fill-gold-500 text-gold-500'
                    : 'h-4 w-4 text-hairline'
                }
              />
            ))}
          </div>
          {existing.comment && (
            <p className="mt-2 break-words text-[13px] text-charcoal-900">
              “{existing.comment}”
            </p>
          )}
        </div>
      </div>
    );
  }

  const submit = () => {
    if (saving || !userId || rating < 1) return;
    setSaving(true);
    try {
      saveReview({
        orderId,
        userId,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <SectionTitle>Bagaimana pengalamanmu?</SectionTitle>
      <p className="mt-1 text-xs text-charcoal-500">
        Nilai pesanan {productName} dari {vendorName}.
      </p>
      <div className="mt-2 rounded-xl ring-1 ring-hairline p-3.5">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Beri ${n} bintang`}
              onClick={() => setRating(n)}
              className="rounded p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={
                  n <= rating
                    ? 'h-6 w-6 fill-gold-500 text-gold-500'
                    : 'h-6 w-6 text-hairline'
                }
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalamanmu (opsional)…"
          rows={2}
          className="mt-2.5 w-full resize-none rounded-lg border border-hairline bg-cream-50 px-3 py-2 text-[13px] text-charcoal-900 placeholder:text-charcoal-500/60 outline-none focus:border-sage-500 focus:ring-4 focus:ring-green-50"
        />
        <button
          type="button"
          onClick={submit}
          disabled={rating < 1 || saving}
          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-green-700 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-sage-100 disabled:text-sage-500"
        >
          Beri Penilaian
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-5 first:mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-500">
      {children}
    </h3>
  );
}

function Row({
  label,
  value,
  accent = false,
  mono = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-charcoal-500">{label}</dt>
      <dd
        className={
          accent
            ? 'text-right font-medium tabular-nums text-green-700'
            : mono
              ? 'text-right font-medium tabular-nums text-charcoal-900'
              : 'text-right font-medium text-charcoal-900'
        }
      >
        {value}
      </dd>
    </div>
  );
}

function formatOrderDateTimeShort(iso: string): string {
  return `${formatOrderDate(iso)}, ${formatOrderTime(iso)}`;
}
