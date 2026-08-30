'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  MapPin,
  ReceiptText,
  Truck,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import { formatRupiah } from '@/lib/data';
import { useCheckout } from './checkout-context';

const PAYMENT_NAMES: Record<string, string> = {
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  'transfer-bank': 'Transfer Bank',
};

export function CheckoutSuccessDialog() {
  const router = useRouter();
  const { successOrder } = useCheckout();

  const handleDismiss = () => {
    
    router.push('/home');
  };

  return (
    <Dialog
      open={Boolean(successOrder)}
      onOpenChange={(open) => {
        if (!open) handleDismiss();
      }}
    >
      <DialogContent
        className="max-w-md gap-0 rounded-3xl border-sage-100 bg-white p-6 sm:p-7"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-charcoal-900">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-charcoal-500">
            Penjual sedang menyiapkan pesananmu. Detailnya bisa kamu lihat di
            riwayat pesanan.
          </p>
        </div>

        {successOrder && (
          <>
            <div className="mt-5 flex items-start gap-3.5 rounded-2xl border border-sage-100 bg-cream-50 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary ring-1 ring-sage-100">
                {successOrder.fulfillment === 'delivery' ? (
                  <Truck className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-charcoal-900">
                  {successOrder.productName}
                </p>
                <p className="mt-0.5 text-xs text-charcoal-500">
                  {successOrder.vendorName} · {successOrder.quantity} porsi ·{' '}
                  {PAYMENT_NAMES[successOrder.paymentMethodId] ?? '-'}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-primary p-4 text-cream-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-400">
                <Coins className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-50/70">
                  ReBites Coin didapat
                </p>
                <p className="font-display text-lg font-semibold tabular-nums text-gold-400">
                  +{formatRupiah(successOrder.coinEarned ?? 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-sage-100 pt-3 text-sm mt-3">
              <span className="font-medium text-charcoal-500">Total bayar</span>
              <span className="font-display text-base font-semibold tabular-nums text-primary">
                {formatRupiah(successOrder.total)}
              </span>
            </div>
          </>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push('/riwayatPesanan')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-caramel hover:text-white"
          >
            <ReceiptText className="h-4 w-4" />
            Lihat Riwayat Pesanan
          </button>
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-caramel"
          >
            Kembali ke Beranda
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
