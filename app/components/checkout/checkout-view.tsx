'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getProductById } from '@/app/detail/product/data';
import { orderDraft } from '@/lib/data';
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

function buildOrderDraft(product: NonNullable<
  ReturnType<typeof getProductById>
>): OrderDraft {
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

  const draft = useMemo<OrderDraft>(() => {
    const productId = searchParams.get('product');
    if (!productId) return orderDraft;
    const product = getProductById(productId);
    return product ? buildOrderDraft(product) : orderDraft;
  }, [searchParams]);

  const initialQuantity = useMemo(() => {
    const raw = Number.parseInt(searchParams.get('qty') ?? '', 10);
    if (!Number.isFinite(raw)) return 1;
    return Math.min(Math.max(raw, 1), Math.max(1, draft.stockRemaining));
  }, [searchParams, draft.stockRemaining]);

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
