'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import type { ProductDetail } from '@/app/detail/product/data';
import { fetchProductDetail } from '@/app/detail/product/detail-data';
import type { OrderDraft } from '@/lib/types';
import { CheckoutProvider } from './checkout-context';
import { CheckoutDecor } from './checkout-decor';
import { StepIndicator } from './step-indicator';
import { OrderItemCard } from './order-item-card';
import { QuantityStepperCard } from './quantity-stepper-card';
import { FulfillmentToggle } from './fulfillment-toggle';
import { PickupInfoCard } from './pickup-info-row';
import { DeliveryAddressSection } from './delivery-address-section';
import { PaymentMethodList } from './payment-method-list';
import { PaymentSummaryCard } from './payment-summary-card';
import { PickupCodeNote } from './pickup-code-note';
import { StickyMobileBar } from './sticky-mobile-bar';

const RESERVATION_MINUTES = 35;

function buildOrderDraft(product: ProductDetail): OrderDraft {
  return {
    productId: product.id,
    productSlug: product.slug,
    vendorName: product.vendor.name,
    vendorSlug: product.vendor.id,
    productName: product.title,
    image: product.images[0],
    originalPrice: product.originalPrice,
    discountedPrice: product.discountedPrice,
    stockRemaining: product.stockRemaining,
    distanceKm: product.distanceKm,
    pickupTime: product.pickupTime,
    pickupLocation: product.pickupLocation,
    reservedUntil: new Date(
      Date.now() + RESERVATION_MINUTES * 60 * 1000
    ).toISOString(),
    co2ePerUnitKg: product.co2eSavedKg,
  };
}

export function CheckoutView() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>(
    'loading'
  );

  useEffect(() => {
    let active = true;
    if (!productId) {
      setStatus('not-found');
      return;
    }
    setStatus('loading');
    fetchProductDetail(productId).then((product) => {
      if (!active) return;
      if (product) {
        setDraft(buildOrderDraft(product));
        setStatus('ready');
      } else {
        setStatus('not-found');
      }
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const initialQuantity = useMemo(() => {
    const raw = Number.parseInt(searchParams.get('qty') ?? '', 10);
    if (!Number.isFinite(raw)) return 1;
    return Math.min(Math.max(raw, 1), Math.max(1, draft?.stockRemaining ?? 1));
  }, [searchParams, draft?.stockRemaining]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-cream-50" />;
  }

  if (status === 'not-found' || !draft) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-50 px-6 text-center">
        <p className="font-sans text-lg font-bold text-charcoal-900">
          Produk tidak ditemukan
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal-500">
          Menu yang akan kamu pesan sudah tidak tersedia.
        </p>
        <Link
          href="/home"
          className="mt-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
        >
          Kembali ke Beranda
        </Link>
      </main>
    );
  }

  return (
    <CheckoutProvider draft={draft} initialQuantity={initialQuantity}>
      <main className="relative min-h-screen bg-cream-50 pb-28 lg:pb-16">
        <CheckoutDecor />

        <div className="relative mx-auto max-w-[1400px] px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
          { }
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              aria-label="Kembali"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-sage-100 bg-white text-green-700 transition-colors hover:bg-green-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Langkah 2 dari 3 · Pembayaran
            </p>
          </div>

          <div className="mt-6 max-w-2xl lg:mt-8">
            <StepIndicator active={1} />
          </div>

          <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.05] tracking-[-0.02em] text-charcoal-900">
            Detail <span className="font-extralight italic">pesanan</span>
          </h1>

          <div className="mt-8 grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-10">
            { }
            <div className="space-y-4 sm:space-y-6">
              <OrderItemCard />

              <div id="checkout-qty-card" className="scroll-mt-28">
                <QuantityStepperCard />
              </div>

              <FulfillmentToggle />

              <PickupInfoCard />
              <DeliveryAddressSection />

              <PaymentMethodList />
            </div>

            { }
            <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <PaymentSummaryCard />
              <PickupCodeNote />
            </div>
          </div>
        </div>

        <StickyMobileBar />
      </main>
    </CheckoutProvider>
  );
}
